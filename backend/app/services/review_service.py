from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.repositories.review import review_repo
from app.schemas.review import ReviewCreate

class ReviewService:
    async def get_reviews(self, db: AsyncSession, target_type: str, target_id: int, skip: int = 0, limit: int = 100):
        return await review_repo.get_by_target(db, target_type=target_type, target_id=target_id, skip=skip, limit=limit)

    async def create_review(self, db: AsyncSession, reviewer_id: int, review_in: ReviewCreate):
        review_data = review_in.model_dump()
        review_data.update({
            "reviewer_id": reviewer_id,
            "is_published": True
        })
        return await review_repo.create(db, obj_in=review_data)

review_service = ReviewService()
