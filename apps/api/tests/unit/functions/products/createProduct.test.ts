import { createProduct } from '../../../../src/functions/products/createProduct';
import { AppError } from '../../../../src/utils/AppError';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

// Mock the authMiddleware
jest.mock('../../../../src/middleware/authMiddleware', () => ({
  authMiddleware: jest.fn((roles) => (req: any, res: any, next: any) => {
    req.user = { id: 'test-user', roles: ['admin'] }; // Mock an admin user
    if (roles.some((role: string) => req.user.roles.includes(role))) {
      next();
    } else {
      next(new AppError('Forbidden', 403));
    }
  }),
}));

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('createProduct', () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    ddbMock.reset();
    mockRequest = {
      body: {
        name: 'Test Product',
        description: 'This is a test product',
        price: 100,
        imageUrl: 'http://example.com/image.jpg',
        category: 'Electronics',
        stock: 10,
      },
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should create a product successfully for an authorized user', async () => {
    ddbMock.on(PutCommand).resolves({});

    await createProduct(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'success',
        data: expect.objectContaining({
          product: expect.objectContaining({
            name: 'Test Product',
            price: 100,
          }),
        }),
      }),
    );
    expect(ddbMock.calls()).toHaveLength(1);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 if required fields are missing', async () => {
    mockRequest.body.name = undefined;

    await createProduct(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
    expect(ddbMock.calls()).toHaveLength(0);
  });

  it('should return 403 if user is not authorized', async () => {
    // Temporarily override the mock authMiddleware for this test case
    jest.mock('../../../../src/middleware/authMiddleware', () => ({
      authMiddleware: jest.fn((roles) => (req: any, res: any, next: any) => {
        req.user = { id: 'test-user', roles: ['customer'] }; // Mock a customer user
        if (roles.some((role: string) => req.user.roles.includes(role))) {
          next();
        } else {
          next(new AppError('Forbidden', 403));
        }
      }),
    }));

    // Re-import createProduct to get the updated mock
    const { createProduct: createProductUnauthorized } = require('../../../../src/functions/products/createProduct');

    await createProductUnauthorized(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    expect(mockNext.mock.calls[0][0].statusCode).toBe(403);
    expect(ddbMock.calls()).toHaveLength(0);
  });

  it('should return 500 if DynamoDB operation fails', async () => {
    ddbMock.on(PutCommand).rejects(new Error('DynamoDB error'));

    await createProduct(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    expect(mockNext.mock.calls[0][0].statusCode).toBe(500);
    expect(ddbMock.calls()).toHaveLength(1);
  });
});
