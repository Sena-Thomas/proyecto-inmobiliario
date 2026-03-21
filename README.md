# Inmobiliaria Mónica Anzola

Plataforma inmobiliaria SaaS para la asesora Mónica Anzola. Permite publicar, explorar y contactar propiedades (casas, apartamentos, locales) en venta y arriendo.

## Tecnologías

- **Frontend:** React + Vite + Tailwind CSS v4 + React Leaflet
- **Backend:** FastAPI + SQLAlchemy + PostgreSQL (Azure)
- **Auth:** JWT + Google OAuth (Firebase / Google Identity)

## Roles y acceso

| Rol    | Correos                                                                 |
|--------|-------------------------------------------------------------------------|
| Admin  | `thomasfernandoroan@gmail.com`, `serviasi@hotmail.com`, `thomas_frodrigueza@soy.sena.edu.co`, `throdrigueza@unal.edu.co` |
| Cliente | Cualquier otro correo registrado                                        |

Solo los administradores pueden crear, editar y eliminar propiedades.

## Variables de entorno

### Backend (`backend/.env`)
```
DATABASE_URL=postgresql://...
JWT_SECRET_KEY=tu-clave-secreta
GOOGLE_CLIENT_ID=tu-google-client-id
```

### Frontend (`frontend/.env`)
```
VITE_GOOGLE_CLIENT_ID=tu-google-client-id
VITE_MONICA_PHONE=573001234567       # número WhatsApp (código país sin +)
VITE_FACEBOOK_URL=https://www.facebook.com/tu-pagina
VITE_INSTAGRAM_URL=https://www.instagram.com/tu-perfil
```

## Despliegue

- **Frontend:** Azure Static Web Apps (`https://nice-desert-0564dc70f.1.azurestaticapps.net`)
- **Backend:** Azure App Service

## Desarrollo local

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

