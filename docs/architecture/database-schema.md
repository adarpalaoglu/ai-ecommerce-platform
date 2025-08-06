# Database Schema

```sql
-- User Table
CREATE TABLE Users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Product Table
CREATE TABLE Products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    imageUrl VARCHAR(255),
    category VARCHAR(255),
    stock INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Order Table
CREATE TABLE Orders (
    id VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    totalAmount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    shippingAddressId VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (shippingAddressId) REFERENCES Addresses(id)
);

-- OrderItem Table
CREATE TABLE OrderItems (
    id VARCHAR(255) PRIMARY KEY,
    orderId VARCHAR(255) NOT NULL,
    productId VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (orderId) REFERENCES Orders(id),
    FOREIGN KEY (productId) REFERENCES Products(id)
);

-- Address Table
CREATE TABLE Addresses (
    id VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255),
    zipCode VARCHAR(20),
    country VARCHAR(255) NOT NULL,
    isDefault BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userId) REFERENCES Users(id)
);
```

### Data Management
- **Data Migration:** Database schema changes will be managed using AWS CDK for DynamoDB table updates. For relational databases (if used in the future), Alembic or similar migration tools would be employed.
- **Data Seeding:** Initial data (e.g., product categories, sample products) will be loaded via scripts during deployment or development setup.
- **Data Backup:** DynamoDB tables will utilize point-in-time recovery. Critical S3 buckets will have versioning and cross-region replication enabled.
- **Data Recovery:** Recovery procedures will involve restoring from point-in-time backups for DynamoDB and S3, and re-deploying infrastructure via AWS CDK.