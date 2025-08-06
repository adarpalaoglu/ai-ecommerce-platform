# Monitoring and Observability

### Monitoring Stack
- **Frontend Monitoring:** Google Analytics, Sentry (for error tracking), Lighthouse (for performance audits).
- **Backend Monitoring:** AWS CloudWatch (for Lambda metrics, API Gateway logs), Prometheus/Grafana (for custom metrics if needed).
- **Error Tracking:** Sentry (unified for frontend and backend).
- **Performance Monitoring:** AWS X-Ray (for distributed tracing), Lighthouse, WebPageTest.

### Key Metrics
**Frontend Metrics:**
- Core Web Vitals (LCP, FID, CLS)
- JavaScript errors (rate, count)
- API response times (client-side perception)
- User interactions (clicks, page views)

**Backend Metrics:**
- Request rate (requests per second)
- Error rate (5xx errors)
- Response time (average, p90, p99)
- Database query performance (latency, throughput)