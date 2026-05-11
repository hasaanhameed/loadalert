from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.oauth2 import get_current_user
from app.models.user import User
from app.services.sync_service import SyncService

router = APIRouter(prefix="/sync", tags=["Sync"])


@router.post("/sync", status_code=status.HTTP_200_OK)
async def trigger_sync(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Triggers a full LMS sync for the authenticated user using their stored
    (encrypted) credentials.  Called by the frontend 'Sync Portal' button.
    """
    success = await SyncService.sync_by_stored_credentials(db, current_user)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not sync with LMS. Please check your portal credentials.",
        )
    return {"message": "Sync completed successfully"}
