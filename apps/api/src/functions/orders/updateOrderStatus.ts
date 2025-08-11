import { Request, Response, NextFunction } from 'express';
import { DynamoDB } from 'aws-sdk'; // Assuming AWS SDK is used for DynamoDB
import { authMiddleware } from '../../../middleware/authMiddleware'; // Placeholder for auth middleware
import { errorHandler } from '../../../utils/errorHandler'; // Placeholder for error handler

const dynamoDb = new DynamoDB.DocumentClient();
const ORDERS_TABLE_NAME = process.env.ORDERS_TABLE_NAME || 'Orders'; // Assuming table name from env

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Placeholder for role-based authorization
        if (!req.user || (req.user.role !== 'manager' && req.user.role !== 'admin')) {
            return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }

        // Basic validation for status
        if (!status || typeof status !== 'string') {
            return res.status(400).json({ message: 'Bad Request: Status is required and must be a string.' });
        }

        const params = {
            TableName: ORDERS_TABLE_NAME,
            Key: { id: id },
            UpdateExpression: 'set #status = :status, updatedAt = :updatedAt',
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: {
                ':status': status,
                ':updatedAt': new Date().toISOString(),
            },
            ReturnValues: 'ALL_NEW', // Return the updated item
        };

        const result = await dynamoDb.update(params).promise();

        if (!result.Attributes) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.status(200).json(result.Attributes);
    } catch (error) {
        errorHandler(error, req, res, next); // Use the standard error handler
    }
};
