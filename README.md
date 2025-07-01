# Pro Speed Logistics Backend API

A comprehensive logistics management system backend built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <your-repo-url>
cd pro-speed-backend
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Environment Setup**
Copy the `.env` file and update the values:
\`\`\`bash
cp .env .env.local
\`\`\`

Update the following variables in `.env`:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT tokens
- `EMAIL_USER` & `EMAIL_PASS`: Email credentials (optional)

4. **Start MongoDB**
Make sure MongoDB is running on your system or update the connection string for cloud MongoDB.

5. **Seed the database** (Optional)
\`\`\`bash
npm run seed
\`\`\`

6. **Start the server**
\`\`\`bash
# Development mode
npm run dev

# Production mode
npm start
\`\`\`

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Users Management
- `GET /api/users` - Get all users (Admin only)
- `POST /api/users` - Create new user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)

### Customers Management
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get single customer
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Orders Management
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Query Parameters
Most GET endpoints support:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status
- `search` - Search term

## 🔐 Authentication

All protected routes require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## 👥 User Roles

- **Admin**: Full access to all resources
- **Employee**: Can manage orders, customers, and shipments
- **Client**: Can view their own orders and shipments
- **Supplier**: Can manage their assigned orders

## 🗄️ Database Schema

### User Schema
- Personal information (name, email, phone)
- Role-based access control
- Address information
- Authentication data

### Customer Schema
- Contact information
- Company details (for business customers)
- Billing and shipping addresses
- Credit limit and payment terms

### Order Schema
- Customer reference
- Service type and priority
- Origin and destination details
- Cargo information
- Pricing breakdown
- Timeline tracking
- Document attachments

### Vehicle Schema
- Vehicle details and capacity
- Driver information
- Current location and status
- Maintenance records

## 🔧 Environment Variables

\`\`\`env
# Database
MONGODB_URI=mongodb://localhost:27017/prospeed
DB_NAME=prospeed

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
\`\`\`

## 🧪 Sample Data

Run the seed script to populate the database with sample data:
\`\`\`bash
npm run seed
\`\`\`

This creates:
- Admin user: `admin@prospeed.com` / `admin123`
- Employee user: `employee@prospeed.com` / `employee123`
- Client user: `client@example.com` / `client123`
- Sample customers, orders, and vehicles

## 📦 API Response Format

All API responses follow this format:
\`\`\`json
{
  "success": true,
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
\`\`\`

Error responses:
\`\`\`json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
\`\`\`

## 🚀 Deployment

1. Set `NODE_ENV=production` in your environment
2. Update `MONGODB_URI` to your production database
3. Set a secure `JWT_SECRET`
4. Configure your web server (nginx, Apache) to proxy requests
5. Use PM2 or similar for process management

## 📝 License

This project is licensed under the MIT License.
