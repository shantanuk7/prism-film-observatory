# Prism Backend (Phase 1)

Auth + Users + TMDb + Cloudinary. SQL via Prisma (PostgreSQL default).

## Setup
1. `cp .env.example .env` and fill values
2. `npm install`
3. `npx prisma migrate dev --name init`
4. `npm run dev`

- `POST /auth/signup` { username, email, password, role? }
- `POST /auth/login` { email, password }
- `POST /auth/refresh` { refreshToken }
- `POST /auth/logout` { refreshToken } (Bearer access token required)
- `GET /users/me` (Bearer)
- `PUT /users/me` (Bearer) form-data: profilePic (file), body: { username? }
- `PUT /users/me/password` (Bearer) { currentPassword, newPassword }
- `GET /tmdb/search?q=...&page=1`

## Notes
- Access token in `Authorization: Bearer <token>`
- Refresh token stored in DB, rotated on each refresh.
- Cloudinary folder: `prism/profile_pics` for profile images.
- Adjust CORS origin with `CLIENT_ORIGIN`.
