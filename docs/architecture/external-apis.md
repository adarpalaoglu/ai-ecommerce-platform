# External APIs

### Stripe API
- **Purpose:** Payment processing.
- **Documentation:** https://stripe.com/docs/api
- **Base URL(s):** https://api.stripe.com/v1
- **Authentication:** API Key (Bearer Token)
- **Rate Limits:** Varies by endpoint, typically 100-200 requests/second.

**Key Endpoints Used:**
- `POST /v1/charges` - Create a new charge.

**Integration Notes:** Webhooks will be used to receive payment status updates.