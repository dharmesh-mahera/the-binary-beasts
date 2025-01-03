from flask import Blueprint, request, jsonify, session
from app.database import get_db_connection
from datetime import datetime
from pydantic import ValidationError, BaseModel, EmailStr
from app.schemas import ExpenseCreate
from werkzeug.security import check_password_hash, generate_password_hash
from functools import wraps
from typing import Optional

bp = Blueprint('api', __name__)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserSignup(BaseModel):
    email: EmailStr
    first_name: str
    last_name: Optional[str] = None
    contact: Optional[str] = None
    password: str

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({
                'error': 'Unauthorized',
                'message': 'Please login to access this resource'
            }), 401
        return f(*args, **kwargs)
    return decorated_function

@bp.route('users/<int:user_id>/expenses', methods=['POST'])
@login_required
def create_expense(user_id):
    try:
        # Validate input data
        data = request.get_json()
        expense_data = ExpenseCreate(**data)
        
        # Insert into database
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Verify category exists
                cursor.execute("""
                    SELECT id FROM categories 
                    WHERE name = %s
                """, (expense_data.category))
                
                category_result = cursor.fetchone()
                if not category_result:
                    return jsonify({
                        'error': 'Invalid category',
                        'message': 'Category not found'
                    }), 400
                
                category_id = category_result['id']
                
                # Insert expense
                sql = """
                    INSERT INTO expenses (amount, description, user_id, category_id, 
                                        created_at, modified_at)
                    VALUES (%s, %s, %s, %s, NOW(3), NOW(3))
                """
                cursor.execute(sql, (
                    expense_data.amount,
                    expense_data.description,
                    user_id,
                    category_id
                ))
                expense_id = cursor.lastrowid
                
                # Fetch the created expense with category details
                cursor.execute("""
                    SELECT e.*, c.name as category 
                    FROM expenses e
                    JOIN categories c ON e.category_id = c.id
                    WHERE e.id = %s
                """, (expense_id,))
                created_expense = cursor.fetchone()
                
            conn.commit()
            
            return jsonify({
                'message': 'Expense added successfully',
                'expense': {
                    **created_expense,
                    'created_at': created_expense['created_at'].isoformat(),
                    'modified_at': created_expense['modified_at'].isoformat()
                }
            }), 201
            
        finally:
            conn.close()
            
    except ValidationError as e:
        return jsonify({
            'error': 'Validation error',
            'details': e.errors()
        }), 400
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@bp.route('users/<int:user_id>/expenses', methods=['GET'])
@login_required
def list_expenses(user_id):
    try:
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Get search and filter parameters
                search_query = request.args.get('q')
                category = request.args.get('category')
                start_date = request.args.get('start_date')
                end_date = request.args.get('end_date')
                min_amount = request.args.get('min_amount')
                max_amount = request.args.get('max_amount')
                sort_by = request.args.get('sort_by', 'date')  # default sort by date
                sort_order = request.args.get('sort_order', 'desc')  # default descending
                page = int(request.args.get('page', 1))
                per_page = int(request.args.get('per_page', 10))
                
                # Start building the query
                sql_parts = ["""
                    SELECT e.*, c.name as category 
                    FROM expenses e
                    JOIN categories c ON e.category_id = c.id
                    WHERE e.user_id = %s
                """]
                params = [user_id]
                
                # Build count query in parallel
                count_sql_parts = ["""
                    SELECT COUNT(*) as total 
                    FROM expenses e
                    JOIN categories c ON e.category_id = c.id
                    WHERE e.user_id = %s
                """]
                count_params = [user_id]
                
                # Full-text search
                if search_query:
                    # Clean and prepare search query
                    search_terms = ' '.join([f'+{term}*' for term in search_query.split()])
                    search_condition = """
                        AND (MATCH(e.description) AGAINST (%s IN BOOLEAN MODE)
                        OR MATCH(c.name) AGAINST (%s IN BOOLEAN MODE))
                    """
                    sql_parts.append(search_condition)
                    count_sql_parts.append(search_condition)
                    params.extend([search_terms, search_terms])
                    count_params.extend([search_terms, search_terms])
                
                # Apply filters
                if category:
                    sql_parts.append("AND c.name = %s")
                    count_sql_parts.append("AND c.name = %s")
                    params.append(category)
                    count_params.append(category)
                
                if start_date:
                    sql_parts.append("AND DATE(e.created_at) >= %s")
                    count_sql_parts.append("AND DATE(e.created_at) >= %s")
                    params.append(start_date)
                    count_params.append(start_date)
                
                if end_date:
                    sql_parts.append("AND DATE(e.created_at) <= %s")
                    count_sql_parts.append("AND DATE(e.created_at) <= %s")
                    params.append(end_date)
                    count_params.append(end_date)
                
                if min_amount:
                    sql_parts.append("AND e.amount >= %s")
                    count_sql_parts.append("AND e.amount >= %s")
                    params.append(float(min_amount))
                    count_params.append(float(min_amount))
                
                if max_amount:
                    sql_parts.append("AND e.amount <= %s")
                    count_sql_parts.append("AND e.amount <= %s")
                    params.append(float(max_amount))
                    count_params.append(float(max_amount))
                
                # Add sorting
                valid_sort_fields = {
                    'date': 'e.created_at',
                    'amount': 'e.amount',
                    'category': 'c.name',
                    'created': 'e.created_at'
                }
                
                sort_field = valid_sort_fields.get(sort_by, 'e.created_at')
                sort_direction = 'DESC' if sort_order.lower() == 'desc' else 'ASC'
                sql_parts.append(f"ORDER BY {sort_field} {sort_direction}")
                
                # Add pagination
                offset = (page - 1) * per_page
                sql_parts.append("LIMIT %s OFFSET %s")
                params.extend([per_page, offset])
                
                # Execute main query
                final_sql = ' '.join(sql_parts)
                cursor.execute(final_sql, params)
                expenses = cursor.fetchall()
                
                # Get total count for pagination
                final_count_sql = ' '.join(count_sql_parts)
                cursor.execute(final_count_sql, count_params)
                total_count = cursor.fetchone()['total']
                
                # Format response data
                for expense in expenses:
                    # expense['created_at'] = expense['created_at'].isoformat()
                    expense['date'] = expense['created_at'].isoformat()
                    expense['modified_at'] = expense['modified_at'].isoformat()
                    expense['amount'] = float(expense['amount'])
                    del expense['created_at']

                
                return jsonify({
                    'expenses': expenses,
                    'pagination': {
                        'current_page': page,
                        'per_page': per_page,
                        'total_items': total_count,
                        'total_pages': (total_count + per_page - 1) // per_page
                    },
                    'filters': {
                        'search_query': search_query,
                        'category': category,
                        'date_range': {
                            'start': start_date,
                            'end': end_date
                        },
                        'amount_range': {
                            'min': min_amount,
                            'max': max_amount
                        }
                    }
                }), 200
                
        finally:
            conn.close()
            
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@bp.route('users/<int:user_id>/expenses/<int:expense_id>', methods=['PUT'])
@login_required
def update_expense(user_id, expense_id):
    try:
        # Validate input data
        data = request.get_json()
        expense_data = ExpenseCreate(**data)
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Check if expense exists and belongs to user
                cursor.execute("""
                    SELECT * FROM expenses 
                    WHERE id = %s AND user_id = %s
                """, (expense_id, user_id))
                
                if not cursor.fetchone():
                    return jsonify({
                        'error': 'Not found',
                        'message': f'Expense with id {expense_id} not found or does not belong to user'
                    }), 404
                
                # Verify category exists and belongs to user
                cursor.execute("""
                    SELECT id FROM categories 
                    WHERE name = %s AND created_by = %s
                """, (expense_data.category, user_id))
                
                category_result = cursor.fetchone()
                if not category_result:
                    return jsonify({
                        'error': 'Invalid category',
                        'message': 'Category not found or does not belong to user'
                    }), 400
                
                category_id = category_result['id']
                
                # Update expense
                sql = """
                    UPDATE expenses 
                    SET amount = %s, 
                        description = %s, 
                        category_id = %s,
                        modified_at = NOW(3)
                    WHERE id = %s AND user_id = %s
                """
                
                cursor.execute(sql, (
                    expense_data.amount,
                    expense_data.description,
                    category_id,
                    expense_id,
                    user_id
                ))
                
                # Fetch updated expense with category details
                cursor.execute("""
                    SELECT e.*, c.name as category 
                    FROM expenses e
                    JOIN categories c ON e.category_id = c.id
                    WHERE e.id = %s
                """, (expense_id,))
                updated_expense = cursor.fetchone()
                
            conn.commit()
            
            return jsonify({
                'message': 'Expense updated successfully',
                'expense': {
                    **updated_expense,
                    'created_at': updated_expense['created_at'].isoformat(),
                    'modified_at': updated_expense['modified_at'].isoformat()
                }
            }), 200
            
        finally:
            conn.close()
            
    except ValidationError as e:
        return jsonify({
            'error': 'Validation error',
            'details': e.errors()
        }), 400
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@bp.route('users/<int:user_id>/expenses/<int:expense_id>', methods=['DELETE'])
@login_required
def delete_expense(user_id, expense_id):
    try:
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Check if expense exists and belongs to user
                cursor.execute("""
                    SELECT * FROM expenses 
                    WHERE id = %s AND user_id = %s
                """, (expense_id, user_id))
                
                if not cursor.fetchone():
                    return jsonify({
                        'error': 'Not found',
                        'message': f'Expense with id {expense_id} not found or does not belong to user'
                    }), 404
                
                # Delete expense
                cursor.execute("""
                    DELETE FROM expenses 
                    WHERE id = %s AND user_id = %s
                """, (expense_id, user_id))
                
            conn.commit()
            
            return jsonify({
                'message': 'Expense deleted successfully',
                'id': expense_id
            }), 200
            
        finally:
            conn.close()
            
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@bp.route('users/<int:user_id>/expenses/summary', methods=['GET'])
@login_required
def get_expense_summary(user_id):
    try:
        # Get optional date range filters from query parameters
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Base query for category summary
                sql = """
                    SELECT 
                        c.name as category,
                        COUNT(*) as transaction_count,
                        SUM(e.amount) as total_amount,
                        MIN(e.amount) as min_amount,
                        MAX(e.amount) as max_amount,
                        AVG(e.amount) as avg_amount
                    FROM expenses e
                    JOIN categories c ON e.category_id = c.id
                    WHERE e.user_id = %s
                """
                params = [user_id]
                
                # Add date filters if provided
                if start_date:
                    sql += " AND DATE(e.created_at) >= %s"
                    params.append(start_date)
                if end_date:
                    sql += " AND DATE(e.created_at) <= %s"
                    params.append(end_date)
                
                # Group by category
                sql += " GROUP BY c.name ORDER BY total_amount DESC"
                
                cursor.execute(sql, params)
                category_summary = cursor.fetchall()
                
                # Calculate total expenses
                sql_total = """
                    SELECT SUM(amount) as grand_total 
                    FROM expenses 
                    WHERE user_id = %s
                """
                total_params = [user_id]
                
                if start_date:
                    sql_total += " AND DATE(created_at) >= %s"
                    total_params.append(start_date)
                if end_date:
                    sql_total += " AND DATE(created_at) <= %s"
                    total_params.append(end_date)
                
                cursor.execute(sql_total, total_params)
                grand_total = cursor.fetchone()['grand_total'] or 0
                
                # Calculate percentages and format numbers
                for category in category_summary:
                    category['percentage'] = round((category['total_amount'] / grand_total) * 100, 2)
                    category['total_amount'] = float(category['total_amount'])
                    category['min_amount'] = float(category['min_amount'])
                    category['max_amount'] = float(category['max_amount'])
                    category['avg_amount'] = round(float(category['avg_amount']), 2)
                
                return jsonify({
                    'summary': category_summary,
                    'grand_total': float(grand_total),
                    'date_range': {
                        'start_date': start_date,
                        'end_date': end_date
                    }
                }), 200
                
        finally:
            conn.close()
            
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@bp.route('/login', methods=['POST'])
def login():
    try:
        # Validate input data
        data = request.get_json()
        login_data = UserLogin(**data)
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Get user by email
                cursor.execute("""
                    SELECT id, email, first_name, last_name, contact, password_hash 
                    FROM user WHERE email = %s
                """, (login_data.email,))
                
                user = cursor.fetchone()
                
                if not user or not check_password_hash(user['password_hash'], login_data.password):
                    return jsonify({
                        'error': 'Authentication failed',
                        'message': 'Invalid email or password'
                    }), 401
                
                # Set session data
                session['user_id'] = user['id']
                session['email'] = user['email']
                session['first_name'] = user['first_name']
                
                return jsonify({
                    'message': 'Login successful',
                    'user': {
                        'id': user['id'],
                        'email': user['email'],
                        'first_name': user['first_name'],
                        'last_name': user['last_name'],
                        'contact': user['contact']
                    }
                }), 200
                
        finally:
            conn.close()
            
    except ValidationError as e:
        return jsonify({
            'error': 'Validation error',
            'details': e.errors()
        }), 400
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({
        'message': 'Logged out successfully'
    }), 200

# Example of using the decorator
@bp.route('/protected-route')
@login_required
def protected_route():
    return jsonify({
        'message': 'This is a protected route',
        'user_id': session['user_id']
    })

@bp.route('/signup', methods=['POST'])
def signup():
    try:
        # Validate input data
        data = request.get_json()
        user_data = UserSignup(**data)
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Check if email already exists
                cursor.execute("""
                    SELECT id FROM user WHERE email = %s
                """, (user_data.email,))
                
                if cursor.fetchone():
                    return jsonify({
                        'error': 'Email already registered',
                        'message': 'Please use a different email address'
                    }), 400
                
                # Hash the password
                password_hash = generate_password_hash(user_data.password)
                
                # Insert new user
                cursor.execute("""
                    INSERT INTO user (email, first_name, last_name, contact, password_hash)
                    VALUES (%s, %s, %s, %s, %s)
                """, (
                    user_data.email,
                    user_data.first_name,
                    user_data.last_name,
                    user_data.contact,
                    password_hash
                ))
                
                user_id = cursor.lastrowid
                
            conn.commit()
            
            # Set session data after successful signup
            session['user_id'] = user_id
            session['email'] = user_data.email
            session['first_name'] = user_data.first_name
            
            return jsonify({
                'message': 'User registered successfully',
                'user': {
                    'id': user_id,
                    'email': user_data.email,
                    'first_name': user_data.first_name,
                    'last_name': user_data.last_name,
                    'contact': user_data.contact
                }
            }), 201
            
        finally:
            conn.close()
            
    except ValidationError as e:
        return jsonify({
            'error': 'Validation error',
            'details': e.errors()
        }), 400
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500