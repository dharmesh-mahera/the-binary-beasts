from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

class ExpenseCreate(BaseModel):
    amount: float = Field(..., gt=0, description="Expense amount must be greater than 0")
    date: Optional[str] = None
    description: Optional[str] = Field(None, max_length=200)
    category: str = Field(..., min_length=1, max_length=50)
    
    @validator('date')
    def validate_date(cls, v):
        if v:
            try:
                datetime.strptime(v, '%Y-%m-%d')
            except ValueError:
                raise ValueError('Date must be in YYYY-MM-DD format')
        return v