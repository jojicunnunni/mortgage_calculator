from fastapi import APIRouter, Depends
from app.schemas.mortgage import MortgageRequest, MortgageResponse
from app.services.mortgage_service import calc_mortgage

router = APIRouter(prefix="/api/mortgage", tags=["mortgage"])

@router.post("/calculate", response_model=MortgageResponse)
def calculate_mortgage(payload: MortgageRequest) -> MortgageResponse:
    return calc_mortgage(payload)
