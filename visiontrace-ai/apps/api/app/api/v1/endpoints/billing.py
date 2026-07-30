import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, Field

from app.services.stripe_service import stripe_billing_service

router = APIRouter()
logger = logging.getLogger(__name__)

class CheckoutSessionRequest(BaseModel):
    tenant_id: str = Field("tenant_default_demo", description="Tenant ID requesting plan upgrade")
    plan_id: str = Field("pro", description="Subscription plan ID: 'pro' ($29/mo)")

class PortalSessionRequest(BaseModel):
    tenant_id: str = Field("tenant_default_demo", description="Tenant ID requesting customer portal")

@router.get("/billing/usage", status_code=status.HTTP_200_OK)
async def get_billing_usage(tenant_id: str = "tenant_default_demo"):
    """
    Returns monthly video processing quota, minutes consumed, and subscription plan details.
    """
    sub = stripe_billing_service.get_tenant_subscription(tenant_id)
    return {
        "tenant_id": tenant_id,
        "plan": sub["plan"],
        "plan_name": stripe_billing_service.PLANS[sub["plan"]]["name"],
        "status": sub["status"],
        "used_minutes": sub["used_minutes"],
        "max_minutes": sub["max_minutes"],
        "used_uploads": sub["used_uploads"],
        "quota_percentage": round((sub["used_minutes"] / sub["max_minutes"]) * 100, 1),
        "is_pro": sub["plan"] == "pro"
    }

@router.post("/billing/create-checkout-session")
async def create_checkout_session(request: CheckoutSessionRequest):
    """
    Generates a Stripe Checkout URL for upgrading to Pro Tier ($29/mo).
    """
    return stripe_billing_service.create_checkout_session(
        tenant_id=request.tenant_id,
        plan_id=request.plan_id
    )

@router.post("/billing/create-portal-session")
async def create_portal_session(request: PortalSessionRequest):
    """
    Generates a Stripe Customer Portal URL for managing payment methods & invoices.
    """
    return stripe_billing_service.create_portal_session(tenant_id=request.tenant_id)

@router.post("/billing/webhook")
async def stripe_webhook(request: Request):
    """
    Stripe Webhook Listener for customer.subscription events.
    """
    try:
        payload = await request.json()
        return stripe_billing_service.handle_webhook_event(payload)
    except Exception as e:
        logger.error(f"Error handling Stripe webhook: {e}")
        return {"status": "error", "message": str(e)}
