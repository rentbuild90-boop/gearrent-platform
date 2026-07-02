from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_db
from app.schemas.review import ReviewOut, ReviewListResponse, ReviewResponse, ReviewCreate
from app.services.review_service import review_service
from app.core.deps import get_current_active_user
from app.database.models.auth import User

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.get("/{target_type}/{target_id}", response_model=ReviewListResponse)
async def get_reviews(
    target_type: str,
    target_id: int,
    skip: int = 0, limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    reviews = await review_service.get_reviews(db, target_type=target_type.upper(), target_id=target_id, skip=skip, limit=limit)
    return ReviewListResponse(
        data=[ReviewOut.model_validate(r) for r in reviews]
    )

@router.post("", response_model=ReviewResponse)
async def create_review(
    review_in: ReviewCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    review = await review_service.create_review(db, reviewer_id=current_user.id, review_in=review_in)
    return ReviewResponse(
        message="Review submitted",
        data=ReviewOut.model_validate(review)
    )
