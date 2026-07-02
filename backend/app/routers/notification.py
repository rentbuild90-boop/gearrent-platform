from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_db
from app.schemas.notification import NotificationOut, NotificationListResponse, NotificationResponse, NotificationCreate
from app.services.notification_service import notification_service
from app.core.deps import get_current_active_user
from app.database.models.auth import User

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=NotificationListResponse)
async def get_my_notifications(
    skip: int = 0, limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    notifications = await notification_service.get_user_notifications(db, user_id=current_user.id, skip=skip, limit=limit)
    return NotificationListResponse(
        data=[NotificationOut.model_validate(n) for n in notifications]
    )

@router.put("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_read(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_notif = await notification_service.get_user_notifications(db, user_id=current_user.id)
    # Ensure this notification belongs to user
    notif = next((n for n in db_notif if n.id == notification_id), None)
    
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    updated = await notification_service.mark_as_read(db, notification_id)
    return NotificationResponse(
        message="Notification marked as read",
        data=NotificationOut.model_validate(updated)
    )

@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_notif = await notification_service.get_user_notifications(db, user_id=current_user.id)
    notif = next((n for n in db_notif if n.id == notification_id), None)
    
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
        
    await notification_service.delete_notification(db, notification_id)
    return None
