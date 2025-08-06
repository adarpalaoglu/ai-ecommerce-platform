# Development Workflow

### Local Development Setup

#### Prerequisites
```bash
# Node.js (v18 or later)
# npm (v8 or later)
# AWS CLI configured
# Docker (for local DynamoDB/Redis if needed)
```

#### Initial Setup
```bash
npm install -g nx # Install Nx globally
npm install       # Install root dependencies
nx run api:serve  # Start local backend (if applicable)
nx run web:serve  # Start local frontend
```

#### Development Commands
```bash
# Start all services
nx run-many --target=serve --all

# Start frontend only
nx run web:serve

# Start backend only
nx run api:serve

# Run tests
nx run-many --target=test --all
```

### Environment Configuration

#### Required Environment Variables
```bash
# Frontend (.env.local)
REACT_APP_API_BASE_URL=http://localhost:3000/api
REACT_APP_COGNITO_USER_POOL_ID=us-east-1_XXXXXXX
REACT_APP_COGNITO_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXX

# Backend (.env)
AWS_REGION=us-east-1
DYNAMODB_TABLE_USERS=ecommerce-users
DYNAMODB_TABLE_PRODUCTS=ecommerce-products
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXX

# Shared
# No shared environment variables directly accessed by both frontend and backend
```