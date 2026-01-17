# Authentication & Active Sessions

## Overview
ari uses **JWT (JSON Web Token)** for authentication.
- **Short-lived Access Tokens**: Valid for 5 minutes.
- **Long-lived Refresh Tokens**: Valid for 30 days.

This mechanism enhances security by minimizing the window of opportunity if an access token is compromised. It also allows users to immediately revoke access for specific devices (long-lived sessions) via the Active Sessions API.

## User Guide
### Login
When you log in, you receive:
1.  `token`: Access token (JWT).
2.  `refresh_token`: Token to obtain new access tokens.

### Active Sessions
You can view your active sessions in "Security" settings.
- **View**: See a list of devices/sessions currently logged in.
- **Revoke**: Log out a specific device by deleting its session. This invalidates the Refresh Token. The device will be logged out once its current 5-minute Access Token expires.

## Developer Guide
### Technology Stack
- **LexikJWTAuthenticationBundle**: Handles JWT generation and validation.
- **GesdinetJWTRefreshTokenBundle**: Handles Refresh Token lifecycle.

### Multi-Tenancy
Refresh Tokens are strictly scoped to the `Tenant` (User).
- **Storage**: Custom `App\Entity\RefreshToken` entity.
- **Isolation**: Implements `App\Security\TenantAwareInterface`. The `TenantFilter` automatically ensures users can only see and manage their own tokens.
- **Audit**: Tokens include `ipAddress` and `userAgent` captured at login (via `App\EventListener\RefreshTokenListener`).

### API Endpoints
- `POST /api/token/refresh`: Exchange a refresh token for a new JWT.
- `GET /api/active-sessions`: List active refresh tokens.
- `DELETE /api/active-sessions/{id}`: Revoke a refresh token.
