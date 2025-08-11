import { updateOrderStatus } from '../../../../src/functions/orders/updateOrderStatus';
import { Request, Response, NextFunction } from 'express';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

// Mock AWS SDK DynamoDB DocumentClient
const mockUpdate = jest.fn();
const mockDynamoDb = {
    update: (params: any) => ({
        promise: () => mockUpdate(params),
    }),
} as unknown as DocumentClient;

// Mock the DynamoDB DocumentClient in updateOrderStatus.ts
jest.mock('aws-sdk', () => ({
    DynamoDB: {
        DocumentClient: jest.fn(() => mockDynamoDb),
    },
}));

describe('updateOrderStatus', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {
            params: { id: 'order123' },
            body: { status: 'Shipped' },
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update order status for a manager user', async () => {
        mockRequest.user = { role: 'manager' };
        mockUpdate.mockResolvedValueOnce({ Attributes: { id: 'order123', status: 'Shipped' } });

        await updateOrderStatus(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ id: 'order123', status: 'Shipped' });
        expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
            TableName: 'Orders',
            Key: { id: 'order123' },
            UpdateExpression: 'set #status = :status, updatedAt = :updatedAt',
            ExpressionAttributeValues: expect.objectContaining({ ':status': 'Shipped' }),
        }));
    });

    it('should return 403 if user is not a manager or admin', async () => {
        mockRequest.user = { role: 'customer' };

        await updateOrderStatus(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Forbidden: Insufficient role' });
        expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('should return 400 if status is missing', async () => {
        mockRequest.user = { role: 'manager' };
        mockRequest.body = {};

        await updateOrderStatus(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Bad Request: Status is required and must be a string.' });
        expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('should return 404 if order not found', async () => {
        mockRequest.user = { role: 'manager' };
        mockUpdate.mockResolvedValueOnce({}); // No Attributes means item not found

        await updateOrderStatus(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Order not found.' });
    });

    it('should handle errors and call the error handler', async () => {
        mockRequest.user = { role: 'manager' };
        const mockError = new Error('DynamoDB error');
        mockUpdate.mockRejectedValueOnce(mockError);

        await updateOrderStatus(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockNext).toHaveBeenCalledWith(mockError);
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
    });
});