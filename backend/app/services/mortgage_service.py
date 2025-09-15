import math
from .typing import Any
from decimal import Decimal
from app.schemas.mortgage import MortgageRequest, PaymentBreakdown, MortgageResponse

def calc_mortgage(req: MortgageRequest) -> MortgageResponse:
    P = float(Decimal(req.principal))
    r = float(req.annual_interest_rate) / 100.0 / req.compounding_per_year
    n = req.term_years * req.compounding_per_year

    # Handle zero/near-zero rate gracefully
    if r == 0:
        base_payment = P / n
    else:
        base_payment = P * (r * (1 + r) ** n) / ((1 + r) ** n - 1)

    monthly_payment = base_payment + float(req.extra_payment)

    schedule: list[PaymentBreakdown] = []
    balance = P
    m = 0
    # Hard cap to avoid infinite loop due to float rounding
    max_iters = n + 600

    while balance > 0 and m < max_iters:
        m += 1
        interest = balance * r
        principal = monthly_payment - interest
        if principal > balance:
            principal = balance
            monthly_payment_last = interest + principal
        balance = max(0.0, balance - principal)
        schedule.append(PaymentBreakdown(
            month=m, interest=round(interest, 2), principal=round(principal, 2), balance=round(balance, 2)
        ))

    payoff_months = len(schedule)
    total_paid = sum((pb.interest + pb.principal) for pb in schedule)
    total_interest = total_paid - P

    return MortgageResponse(
        monthly_payment=round(monthly_payment, 2),
        total_interest=round(total_interest, 2),
        total_paid=round(total_paid, 2),
        payoff_months=payoff_months,
        schedule=schedule
    )
