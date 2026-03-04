from typing import Optional
from pydantic import BaseModel, EmailStr
from models import UserRole, PropertyStatus


# ── User schemas ─────────────────────────────────────────────────────────────

class UserBase(BaseModel):
    nombre: str
    email: EmailStr
    telefono: Optional[str] = None
    facebook_link: Optional[str] = None
    rol: UserRole = UserRole.cliente


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True


# ── Property schemas ──────────────────────────────────────────────────────────

class PropertyBase(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    precio: float
    latitud: Optional[float] = None
    longitud: Optional[float] = None
    url_imagen: Optional[str] = None
    estado: PropertyStatus = PropertyStatus.disponible


class PropertyCreate(PropertyBase):
    owner_id: int


class PropertyUpdate(BaseModel):
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    precio: Optional[float] = None
    latitud: Optional[float] = None
    longitud: Optional[float] = None
    url_imagen: Optional[str] = None
    estado: Optional[PropertyStatus] = None


class PropertyOut(PropertyBase):
    id: int
    owner_id: int
    owner: UserOut

    class Config:
        from_attributes = True
