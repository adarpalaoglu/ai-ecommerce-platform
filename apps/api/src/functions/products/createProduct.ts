import { Request, Response, NextFunction } from 'express';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import { Product } from '../../../../packages/shared/src/types/product';
import { authMiddleware } from '../../middleware/authMiddleware'; // Assuming this exists
import { AppError } from '../../utils/AppError'; // Assuming this exists

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Apply authentication and authorization middleware
    authMiddleware(['manager', 'admin'])(req, res, async () => {
      const { name, description, price, imageUrl, category, stock } = req.body;

      // Basic validation
      if (!name || !description || typeof price !== 'number' || typeof stock !== 'number') {
        return next(new AppError('Missing required product fields or invalid types', 400));
      }

      const newProduct: Product = {
        id: uuidv4(),
        name,
        description,
        price,
        imageUrl,
        category,
        stock,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Attempting to save new product:', newProduct); // Temporary log

      const params = {
        TableName: 'Products', // Assuming a 'Products' table in DynamoDB
        Item: newProduct,
      };

      try {
        await ddbDocClient.send(new PutCommand(params));
        res.status(201).json({
          status: 'success',
          data: {
            product: newProduct,
          },
        });
      } catch (dbError: any) {
        console.error('DynamoDB Error:', dbError);
        return next(new AppError(`Failed to create product: ${dbError.message}`, 500));
      }
    });
  } catch (error) {
    next(error); // Pass errors to the global error handler
  }
};
