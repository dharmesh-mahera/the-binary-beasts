from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

class ExpenseCreate(BaseModel):
    amount: float = Field(..., gt=0, description="Expense amount must be greater than 0")
    description: Optional[str] = Field(None, max_length=1024)
    category: str = Field(..., min_length=1, max_length=50)