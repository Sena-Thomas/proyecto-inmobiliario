import enum
from sqlalchemy import (
    Column, Integer, String, Float, Enum, ForeignKey, Text
)
from sqlalchemy.orm import relationship
from database import Base


class UserRole(str, enum.Enum):
    admin = "admin"
    comercial = "comercial"
    cliente = "cliente"


class PropertyStatus(str, enum.Enum):
    disponible = "disponible"
    arrendado = "arrendado"
    vendido = "vendido"
    cita_programada = "cita_programada"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    telefono = Column(String(30), nullable=True)
    facebook_link = Column(String(255), nullable=True)
    rol = Column(Enum(UserRole), default=UserRole.cliente, nullable=False)

    properties = relationship("Property", back_populates="owner")


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(200), nullable=False)
    descripcion = Column(Text, nullable=True)
    precio = Column(Float, nullable=False)
    latitud = Column(Float, nullable=True)
    longitud = Column(Float, nullable=True)
    url_imagen = Column(String(500), nullable=True)
    estado = Column(
        Enum(PropertyStatus),
        default=PropertyStatus.disponible,
        nullable=False,
    )
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="properties")
