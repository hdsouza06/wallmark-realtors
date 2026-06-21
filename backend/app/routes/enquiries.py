from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_admin
from app.database.session import get_db
from app.middleware.rate_limit import limiter
from app.models.enquiry import Enquiry
from app.models.user import User
from app.schemas.common import Message
from app.schemas.enquiry import EnquiryCreate, EnquiryOut
from app.services.email_service import send_enquiry_notification

router = APIRouter(prefix="/enquiries", tags=["enquiries"])


@router.post("", response_model=Message)
@limiter.limit("10/minute")
async def create_enquiry(
    request: Request,
    payload: EnquiryCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    enquiry = Enquiry(**payload.model_dump())
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)

    background_tasks.add_task(
        send_enquiry_notification,
        {
            "name": enquiry.name,
            "email": enquiry.email,
            "phone": enquiry.phone,
            "subject": enquiry.subject,
            "message": enquiry.message,
            "enquiry_type": enquiry.enquiry_type.value,
            "property_ref": enquiry.property_ref,
        },
    )
    return Message(detail="Thank you! Our team will reach out to you shortly.")


@router.get("", response_model=list[EnquiryOut])
def list_enquiries(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    return db.query(Enquiry).order_by(Enquiry.created_at.desc()).all()


@router.patch("/{enquiry_id}/read", response_model=EnquiryOut)
def mark_read(
    enquiry_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    enquiry.is_read = True
    db.commit()
    db.refresh(enquiry)
    return enquiry


@router.delete("/{enquiry_id}", response_model=Message)
def delete_enquiry(
    enquiry_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    db.delete(enquiry)
    db.commit()
    return Message(detail="Enquiry deleted")
