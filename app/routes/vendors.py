from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, schemas

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def create_vendor(vendor: schemas.VendorCreate, db: Session = Depends(get_db)):
    new_vendor = models.Vendor(**vendor.model_dump())
    db.add(new_vendor)
    db.commit()
    db.refresh(new_vendor)
    return new_vendor


@router.get("/")
def get_vendors(db: Session = Depends(get_db)):
    return db.query(models.Vendor).all()

@router.put("/{vendor_id}")
def update_vendor(vendor_id: int, updated: schemas.VendorCreate, db: Session = Depends(get_db)):
    vendor = db.query(models.Vendor).filter(models.Vendor.id == vendor_id).first()

    if not vendor:
        return {"error": "Vendor not found"}

    vendor.name = updated.name
    vendor.contact = updated.contact
    vendor.rating = updated.rating

    db.commit()
    return {"message": "Vendor updated"}


@router.delete("/{vendor_id}")
def delete_vendor(vendor_id: int, db: Session = Depends(get_db)):
    vendor = db.query(models.Vendor).filter(models.Vendor.id == vendor_id).first()

    if not vendor:
        return {"error": "Vendor not found"}

    db.delete(vendor)
    db.commit()

    return {"message": "Vendor deleted"}