from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_admin
from app.database.session import get_db
from app.models.property import Property, PropertyImage
from app.models.user import User
from app.schemas.common import Message
from app.schemas.property import PropertyImageOut
from app.services import cloudinary_service

router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.post("/property/{property_id}", response_model=List[PropertyImageOut])
async def upload_property_images(
    property_id: int,
    files: List[UploadFile],
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    if not cloudinary_service.is_enabled():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Image storage is not configured (set CLOUDINARY_* env vars).",
        )

    start_pos = len(prop.images)
    created = []
    for i, file in enumerate(files):
        result = cloudinary_service.upload_image(file.file, folder="wallmark/properties")
        image = PropertyImage(
            property_id=prop.id,
            url=result["url"],
            public_id=result["public_id"],
            position=start_pos + i,
        )
        db.add(image)
        created.append(image)
    db.commit()
    for img in created:
        db.refresh(img)
    return created


@router.post("/generic", response_model=PropertyImageOut)
async def upload_generic_image(
    file: UploadFile,
    _: User = Depends(get_current_admin),
):
    """Upload a single image (banner, testimonial avatar, blog cover) and get a URL back."""
    if not cloudinary_service.is_enabled():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Image storage is not configured (set CLOUDINARY_* env vars).",
        )
    result = cloudinary_service.upload_image(file.file, folder="wallmark/content")
    return PropertyImageOut(id=0, url=result["url"], public_id=result["public_id"], position=0)


@router.delete("/property-image/{image_id}", response_model=Message)
def delete_property_image(
    image_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    image = db.query(PropertyImage).filter(PropertyImage.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    cloudinary_service.delete_image(image.public_id)
    db.delete(image)
    db.commit()
    return Message(detail="Image deleted")
