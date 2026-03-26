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


def calculate_total(items):
    subtotal = sum(item.quantity * item.price for item in items)
    tax = subtotal * 0.05
    return subtotal + tax


@router.post("/")
def create_order(order: schemas.POCreate, db: Session = Depends(get_db)):
    try:
        vendor = db.query(models.Vendor).filter(models.Vendor.id == order.vendor_id).first()
        if not vendor:
            return {"error": "Vendor not found"}

        total = calculate_total(order.items)

        new_order = models.PurchaseOrder(
            reference_no=order.reference_no,
            vendor_id=order.vendor_id,
            total_amount=total,
            status="Pending"
        )

        db.add(new_order)
        db.commit()
        db.refresh(new_order)

        for item in order.items:
            db_item = models.POItem(
                order_id=new_order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=item.price
            )
            db.add(db_item)

            product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
            if product:
                product.stock_level -= item.quantity

        db.commit()

        return {"message": "Order created", "total": total}

    except Exception as e:
        return {"error": str(e)}


    
@router.get("/")
def get_orders(db: Session = Depends(get_db)):
    return db.query(models.PurchaseOrder).all()

@router.put("/{order_id}/status")
def update_status(order_id: int, status: str, db: Session = Depends(get_db)):
    order = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.id == order_id).first()

    if not order:
        return {"error": "Order not found"}

    order.status = status
    db.commit()

    return {"message": "Status updated"}

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.id == order_id).first()

    if not order:
        return {"error": "Order not found"}

    db.delete(order)
    db.commit()

    return {"message": "Order deleted"}