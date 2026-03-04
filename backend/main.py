from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import engine, get_db

# Create all tables on startup
models.Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI(
    title="Inmobiliaria Alicante API",
    description="API REST para la plataforma inmobiliaria en Alicante, España.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Properties ────────────────────────────────────────────────────────────────

@app.get("/properties", response_model=List[schemas.PropertyOut])
def list_properties(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """Return all available properties (public catalog)."""
    return (
        db.query(models.Property)
        .offset(skip)
        .limit(limit)
        .all()
    )


@app.get("/properties/{property_id}", response_model=schemas.PropertyOut)
def get_property(property_id: int, db: Session = Depends(get_db)):
    """Return a single property by ID."""
    prop = db.query(models.Property).filter(
        models.Property.id == property_id
    ).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    return prop


@app.post("/properties", response_model=schemas.PropertyOut, status_code=201)
def create_property(
    payload: schemas.PropertyCreate,
    db: Session = Depends(get_db),
):
    """Create a new property listing (admin / comercial)."""
    owner = db.query(models.User).filter(
        models.User.id == payload.owner_id
    ).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Usuario propietario no encontrado")
    prop = models.Property(**payload.model_dump())
    db.add(prop)
    db.commit()
    db.refresh(prop)
    return prop


@app.put("/properties/{property_id}", response_model=schemas.PropertyOut)
def update_property(
    property_id: int,
    payload: schemas.PropertyUpdate,
    db: Session = Depends(get_db),
):
    """Update a property (change status, details, etc.)."""
    prop = db.query(models.Property).filter(
        models.Property.id == property_id
    ).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(prop, field, value)
    db.commit()
    db.refresh(prop)
    return prop


@app.delete("/properties/{property_id}", status_code=204)
def delete_property(property_id: int, db: Session = Depends(get_db)):
    """Delete a property listing (admin only)."""
    prop = db.query(models.Property).filter(
        models.Property.id == property_id
    ).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    db.delete(prop)
    db.commit()


# ── Users ─────────────────────────────────────────────────────────────────────

@app.get("/users", response_model=List[schemas.UserOut])
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.User).offset(skip).limit(limit).all()


@app.get("/users/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user


@app.post("/users", response_model=schemas.UserOut, status_code=201)
def create_user(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(
        models.User.email == payload.email
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    hashed = pwd_context.hash(payload.password)
    user_data = payload.model_dump(exclude={"password"})
    user_data["password_hash"] = hashed
    user = models.User(**user_data)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
