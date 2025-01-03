from flask import Blueprint, request, jsonify
from app.database import get_db_connection
from datetime import datetime
from pydantic import ValidationError
from app.schemas import ExpenseCreate

bp = Blueprint('api', __name__)

@bp.route('users/<int:user_id>/expenses', methods=['POST'])
def create_expense(user_id):
    try:
        # Validate input data
        data = request.get_json()
        expense_data = ExpenseCreate(**data)
        
        # Convert string date to datetime.date if provided
        expense_date = datetime.strptime(expense_data.date, '%Y-%m-%d').date() \
            if expense_data.date else datetime.utcnow().date()
        
        # Insert into database
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """
                    INSERT INTO expenses (amount, date, description, category)
                    VALUES (%s, %s, %s, %s)
                """
                cursor.execute(sql, (
                    expense_data.amount,
                    expense_date,
                    expense_data.description,
                    expense_data.category
                ))
                expense_id = cursor.lastrowid
                
                # Fetch the created expense
                cursor.execute("SELECT * FROM expenses WHERE id = %s", (expense_id,))
                created_expense = cursor.fetchone()
                
            conn.commit()
            
            return jsonify({
                'message': 'Expense added successfully',
                'expense': {
                    **created_expense,
                    'date': created_expense['date'].isoformat()
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
def list_expenses(user_id):
    try:
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Add support for optional query parameters
                category = request.args.get('category')
                start_date = request.args.get('start_date')
                end_date = request.args.get('end_date')
                
                sql = "SELECT * FROM expenses WHERE 1=1"
                params = []
                
                if category:
                    sql += " AND category = %s"
                    params.append(category)
                if start_date:
                    sql += " AND date >= %s"
                    params.append(start_date)
                if end_date:
                    sql += " AND date <= %s"
                    params.append(end_date)
                
                sql += " ORDER BY date DESC"
                
                cursor.execute(sql, params)
                expenses = cursor.fetchall()
                
                # Convert date objects to ISO format strings
                for expense in expenses:
                    expense['date'] = expense['date'].isoformat()
                    expense['created_at'] = expense['created_at'].isoformat()
                
                return jsonify({
                    'expenses': expenses,
                    'total': len(expenses)
                }), 200
                
        finally:
            conn.close()
            
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@bp.route('users/<int:user_id>/expenses/<int:expense_id>', methods=['PUT'])
def update_expense(user_id, expense_id):
    try:
        # Validate input data
        data = request.get_json()
        expense_data = ExpenseCreate(**data)
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Check if expense exists
                cursor.execute("SELECT * FROM expenses WHERE id = %s", (expense_id,))
                if not cursor.fetchone():
                    return jsonify({
                        'error': 'Not found',
                        'message': f'Expense with id {expense_id} not found'
                    }), 404
                
                # Update expense
                sql = """
                    UPDATE expenses 
                    SET amount = %s, date = %s, description = %s, category = %s
                    WHERE id = %s
                """
                
                expense_date = datetime.strptime(expense_data.date, '%Y-%m-%d').date() \
                    if expense_data.date else datetime.utcnow().date()
                
                cursor.execute(sql, (
                    expense_data.amount,
                    expense_date,
                    expense_data.description,
                    expense_data.category,
                    expense_id
                ))
                
                # Fetch updated expense
                cursor.execute("SELECT * FROM expenses WHERE id = %s", (expense_id,))
                updated_expense = cursor.fetchone()
                
            conn.commit()
            
            return jsonify({
                'message': 'Expense updated successfully',
                'expense': {
                    **updated_expense,
                    'date': updated_expense['date'].isoformat(),
                    'created_at': updated_expense['created_at'].isoformat()
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
def delete_expense(user_id, expense_id):
    try:
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Check if expense exists
                cursor.execute("SELECT * FROM expenses WHERE id = %s", (expense_id,))
                if not cursor.fetchone():
                    return jsonify({
                        'error': 'Not found',
                        'message': f'Expense with id {expense_id} not found'
                    }), 404
                
                # Delete expense
                cursor.execute("DELETE FROM expenses WHERE id = %s", (expense_id,))
                
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
                        category,
                        COUNT(*) as transaction_count,
                        SUM(amount) as total_amount,
                        MIN(amount) as min_amount,
                        MAX(amount) as max_amount,
                        AVG(amount) as avg_amount
                    FROM expenses
                    WHERE 1=1
                """
                params = []
                
                # Add date filters if provided
                if start_date:
                    sql += " AND date >= %s"
                    params.append(start_date)
                if end_date:
                    sql += " AND date <= %s"
                    params.append(end_date)
                
                # Group by category
                sql += " GROUP BY category ORDER BY total_amount DESC"
                
                cursor.execute(sql, params)
                category_summary = cursor.fetchall()
                
                # Calculate total expenses
                sql_total = "SELECT SUM(amount) as grand_total FROM expenses WHERE 1=1"
                total_params = []
                
                if start_date:
                    sql_total += " AND date >= %s"
                    total_params.append(start_date)
                if end_date:
                    sql_total += " AND date <= %s"
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