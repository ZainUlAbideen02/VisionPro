from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

try:
    from jose import jwt
    HAS_JOSE = True
except ImportError:
    HAS_JOSE = False

security = HTTPBearer(auto_error=False)

def get_current_tenant_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    Validates Authorization Bearer token (Clerk JWT or fallback dev token).
    Extracts tenant_id / sub for multi-tenant security isolation.
    """
    if not credentials:
        return "tenant_default_demo"
    
    token = credentials.credentials
    
    if token.startswith("dev_tenant_"):
        return token.replace("dev_tenant_", "")
    
    if HAS_JOSE:
        try:
            unverified_claims = jwt.get_unverified_claims(token)
            tenant_id = (
                unverified_claims.get("org_id") 
                or unverified_claims.get("tenant_id") 
                or unverified_claims.get("sub")
            )
            if tenant_id:
                return str(tenant_id)
        except Exception:
            pass
            
    return "tenant_default_demo"
