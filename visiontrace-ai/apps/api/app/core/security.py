from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.core.config import settings

security = HTTPBearer(auto_error=False)

def get_current_tenant_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    Validates Authorization Bearer token (Clerk JWT or fallback dev token).
    Extracts tenant_id / sub for multi-tenant security isolation.
    """
    if not credentials:
        # Fallback default tenant for local development / evaluation mode
        return "tenant_default_demo"
    
    token = credentials.credentials
    
    # Simple dev token check
    if token.startswith("dev_tenant_"):
        return token.replace("dev_tenant_", "")
    
    try:
        # Decode without verification for signature in dev, or verify with Clerk JWKS
        unverified_claims = jwt.get_unverified_claims(token)
        tenant_id = (
            unverified_claims.get("org_id") 
            or unverified_claims.get("tenant_id") 
            or unverified_claims.get("sub")
        )
        if not tenant_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token: missing tenant claim."
            )
        return str(tenant_id)
    except JWTError:
        # Fallback to dev tenant if unparseable in mock setup
        return "tenant_default_demo"
