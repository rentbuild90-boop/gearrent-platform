from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_db
from app.schemas.category import CategoryOut, CategoryListResponse, CategoryResponse, CategoryCreate, CategoryUpdate
from app.services.category_service import category_service
from app.core.deps import get_current_admin

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("", response_model=CategoryListResponse)
async def get_categories(
    db: AsyncSession = Depends(get_db)
):
    categories = await category_service.get_active_categories(db)
    return CategoryListResponse(
        data=[CategoryOut.model_validate(c) for c in categories]
    )

@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(category_id: int, db: AsyncSession = Depends(get_db)):
    category = await category_service.get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return CategoryResponse(data=CategoryOut.model_validate(category))

@router.post("", response_model=CategoryResponse)
async def create_category(
    category_in: CategoryCreate, 
    db: AsyncSession = Depends(get_db),
    admin_user = Depends(get_current_admin)
):
    category = await category_service.create_category(db, category_in)
    return CategoryResponse(
        message="Category created",
        data=CategoryOut.model_validate(category)
    )
