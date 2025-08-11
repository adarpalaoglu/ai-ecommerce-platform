import { getOrders } from '../../../../src/functions/orders/getOrders';
import { Request, Response, NextFunction } from 'express';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

// Mock AWS SDK DynamoDB DocumentClient
const mockScan = jest.fn();
const mockDynamoDb = {
    scan: (params: any) => ({
        promise: () => mockScan(params),
    }),
} as unknown as DocumentClient;

// Mock the DynamoDB DocumentClient in getOrders.ts
jest.mock('aws-sdk', () => ({
    DynamoDB: {
        DocumentClient: jest.fn(() => mockDynamoDb),
    },
}));

describe('getOrders', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all orders for a manager user', async () => {
        mockRequest.user = { role: 'manager' }; // Mock authenticated manager user
        mockScan.mockResolvedValueOnce({ Items: [{ id: '1', totalAmount: 100 }] });

        await getOrders(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith([{ id: '1', totalAmount: 100 }]);
        expect(mockScan).toHaveBeenCalledWith({ TableName: 'Orders' });
    });

    it('should return 403 if user is not a manager or admin', async () => {
        mockRequest.user = { role: 'customer' }; // Mock authenticated customer user

        await getOrders(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Forbidden: Insufficient role' });
        expect(mockScan).not.toHaveBeenCalled();
    });

    it('should handle errors and call the error handler', async () => {
        mockRequest.user = { role: 'manager' };
        const mockError = new Error('DynamoDB error');
        mockScan.mockRejectedValueOnce(mockError);

        await getOrders(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockNext).toHaveBeenCalledWith(mockError); // Assuming error handler calls next with the error
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should return an empty array if no orders exist', async () => {
        mockRequest.user = { role: 'manager' };
        mockScan.mockResolvedValueOnce({ Items: [] });

        await getOrders(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith([]);
    });
});