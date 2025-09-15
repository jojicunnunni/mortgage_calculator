from pydantic import BaseModel, Field, condecimal, PositiveInt, NonNegativeFloat

class MortgageRequest(BaseModel):
    principal: condecimal(gt=0) = Field(..., description="Loan amount")
    annual_interest_rate: NonNegativeFloat = Field(..., description="Annual % rate, e.g., 7.5")
    term_years: PositiveInt = Field(..., description="Loan term in years")
    extra_payment: NonNegativeFloat = 0.0
    compounding_per_year: PositiveInt = 12

class PaymentBreakdown(BaseModel):
    month: PositiveInt
    interest: float
    principal: float
    balance: float

class MortgageResponse(BaseModel):
    monthly_payment: float
    total_interest: float
    total_paid: float
    payoff_months: int
    schedule: list[PaymentBreakdown]
