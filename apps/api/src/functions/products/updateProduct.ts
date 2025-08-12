import { Request, Response, NextFunction } from 'express';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ProductUpdate } from '../../../../packages/shared/src/types/product';
import { authMiddleware } from '../../middleware/authMiddleware';
import { AppError } from '../../utils/AppError';

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    authMiddleware(['manager', 'admin'])(req, res, async () => {
      const { id } = req.params;
      const { name, description, price, imageUrl, category, stock } = req.body as ProductUpdate;

      if (!id) {
        return next(new AppError('Product ID is required', 400));
      }

      const updateExpressionParts: string[] = [];
      const expressionAttributeValues: { [key: string]: any } = {};

      if (name) {
        updateExpressionParts.push('#n = :name');
        expressionAttributeValues[':name'] = name;
      }
      if (description) {
        updateExpressionParts.push('#d = :description');
        expressionAttributeValues[':description'] = description;
      }
      if (price !== undefined) {
        updateExpressionParts.push('#p = :price');
        expressionAttributeValues[':price'] = price;
      }
      if (imageUrl) {
        updateExpressionParts.push('#i = :imageUrl');
        expressionAttributeValues[':imageUrl'] = imageUrl;
      }
      if (category) {
        updateExpressionParts.push('#c = :category');
        expressionAttributeValues[':category'] = category;
      }
      if (stock !== undefined) {
        updateExpressionParts.push('#s = :stock');
        expressionAttributeValues[':stock'] = stock;
      }

      if (updateExpressionParts.length === 0) {
        return next(new AppError('No fields to update', 400));
      }

      updateExpressionParts.push('#ua = :updatedAt');
      expressionAttributeValues[':updatedAt'] = new Date().toISOString();

      const updateExpression = 'SET ' + updateExpressionParts.join(', ');

      const expressionAttributeNames = {
        '#n': 'name',
        '#d': 'description',
        '#p': 'price',
        '#i': 'imageUrl',
        '#c': 'category',
        '#s': 'stock',
        '#ua': 'updatedAt',
      };

      const params = {
        TableName: 'Products',
        Key: {
          id: id,
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      };

      try {
        const result = await ddbDocClient.send(new UpdateCommand(params));
        if (!result.Attributes) {
          return next(new AppError('Product not found', 404));
        }
        res.status(200).json({
          status: 'success',
          data: {
            product: result.Attributes,
          },
        });
      } catch (dbError: any) {
        console.error('DynamoDB Error:', dbError);
        return next(new AppError(`Failed to update product: ${dbError.message}`, 500));
      }
    });
  } catch (error) {
    next(error);
  }
};
