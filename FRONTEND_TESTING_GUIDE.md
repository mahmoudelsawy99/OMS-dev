# Frontend API Testing Guide

This guide provides step-by-step instructions to test all frontend endpoints and their API integrations.

## 🚀 Quick Start

1. **Start the Frontend Server:**
   ```bash
   npm run dev
   ```
   The app will be available at: http://localhost:3000

2. **Login with Test Credentials:**
   - Email: `admin@example.com`
   - Password: `admin123`

## 📋 Available API Endpoints

### 1. Authentication API (`authAPI`)
- **Login**: `/login`
- **Register**: `/register`
- **Get Current User**: `/auth/me`
- **Logout**: Client-side token removal

### 2. Users API (`usersAPI`)
- **Get All Users**: `/users`
- **Get User by ID**: `/users/:id`
- **Create User**: `/users` (POST)
- **Update User**: `/users/:id` (PUT)
- **Delete User**: `/users/:id` (DELETE)

### 3. Customers API (`customersAPI`)
- **Get All Customers**: `/customers`
- **Get Customer by ID**: `/customers/:id`
- **Create Customer**: `/customers` (POST)
- **Update Customer**: `/customers/:id` (PUT)
- **Delete Customer**: `/customers/:id` (DELETE)

### 4. Orders API (`ordersAPI`)
- **Get All Orders**: `/orders`
- **Get Order by ID**: `/orders/:id`
- **Create Order**: `/orders` (POST)
- **Update Order**: `/orders/:id` (PUT)
- **Delete Order**: `/orders/:id` (DELETE)
- **Update Status**: `/orders/:id/status` (PUT)
- **Add Policy**: `/orders/:id/policies` (POST)
- **Add SIAL**: `/orders/:id/sials` (POST)
- **Add Customs**: `/orders/:id/customs` (POST)
- **Add Invoice**: `/orders/:id/purchase-invoices` (POST)
- **Add Transport**: `/orders/:id/transport-locations` (POST)

### 5. Suppliers API (`suppliersAPI`)
- **Get All Suppliers**: `/suppliers`
- **Get Supplier by ID**: `/suppliers/:id`
- **Create Supplier**: `/suppliers` (POST)
- **Update Supplier**: `/suppliers/:id` (PUT)
- **Delete Supplier**: `/suppliers/:id` (DELETE)

### 6. Vehicles API (`vehiclesAPI`)
- **Get All Vehicles**: `/vehicles`
- **Get Vehicle by ID**: `/vehicles/:id`
- **Create Vehicle**: `/vehicles` (POST)
- **Update Vehicle**: `/vehicles/:id` (PUT)
- **Delete Vehicle**: `/vehicles/:id` (DELETE)

### 7. Invoices API (`invoicesAPI`)
- **Get All Invoices**: `/invoices`
- **Get Invoice by ID**: `/invoices/:id`
- **Create Invoice**: `/invoices` (POST)
- **Update Invoice**: `/invoices/:id` (PUT)
- **Delete Invoice**: `/invoices/:id` (DELETE)

### 8. Reports API (`reportsAPI`)
- **Dashboard Stats**: `/reports/dashboard`
- **Order Stats**: `/reports/orders`
- **Financial Stats**: `/reports/financial`

### 9. Shipments API (`shipmentsAPI`)
- **Get All Shipments**: `/shipments`
- **Get Shipment by ID**: `/shipments/:id`
- **Create Shipment**: `/shipments` (POST)
- **Update Shipment**: `/shipments/:id` (PUT)
- **Delete Shipment**: `/shipments/:id` (DELETE)
- **Update Tracking**: `/shipments/:id/tracking` (PUT)

### 10. Notifications API (`notificationsAPI`)
- **Get All Notifications**: `/notifications`
- **Mark as Read**: `/notifications/:id/read` (PUT)
- **Mark All as Read**: `/notifications/read-all` (PUT)
- **Delete Notification**: `/notifications/:id` (DELETE)

### 11. Profile API (`profileAPI`)
- **Get Profile**: `/profile`
- **Update Profile**: `/profile` (PUT)
- **Change Password**: `/profile/password` (PUT)

## 🧪 Step-by-Step Testing Instructions

### 1. Authentication Testing

#### Test Login
1. Navigate to: http://localhost:3000/login
2. Enter credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Click "تسجيل الدخول"
4. **Expected Result**: Redirect to dashboard with success message

#### Test Register
1. Navigate to: http://localhost:3000/register
2. Fill in registration form
3. Click "إنشاء حساب"
4. **Expected Result**: Account created and redirect to login

### 2. Users Management Testing

#### Test Users List
1. Navigate to: http://localhost:3000/users
2. **Expected Result**: Display list of users with search/filter options
3. **API Test**: Check browser network tab for `/api/users` call

#### Test Create User
1. Click "إضافة مستخدم جديد" button
2. Fill in user details
3. Click "إضافة المستخدم"
4. **Expected Result**: User created with success toast
5. **API Test**: Check for `/api/users` POST call

#### Test Edit User
1. Click edit button on any user
2. Modify user details
3. Click "حفظ التغييرات"
4. **Expected Result**: User updated with success toast
5. **API Test**: Check for `/api/users/:id` PUT call

#### Test Delete User
1. Click delete button on any user
2. Confirm deletion
3. **Expected Result**: User deleted with success toast
4. **API Test**: Check for `/api/users/:id` DELETE call

### 3. Customers Management Testing

#### Test Customers List
1. Navigate to: http://localhost:3000/customers
2. **Expected Result**: Display list of customers
3. **API Test**: Check for `/api/customers` call

#### Test Create Customer
1. Navigate to: http://localhost:3000/customers/add
2. Fill in customer details (individual or company)
3. Click "إضافة العميل"
4. **Expected Result**: Customer created with success toast
5. **API Test**: Check for `/api/customers` POST call

#### Test Customer Details
1. Click on any customer in the list
2. **Expected Result**: Display customer details page
3. **API Test**: Check for `/api/customers/:id` call

#### Test Edit Customer
1. In customer details page, click edit
2. Modify customer details
3. Click "حفظ التغييرات"
4. **Expected Result**: Customer updated with success toast
5. **API Test**: Check for `/api/customers/:id` PUT call

### 4. Orders Management Testing

#### Test Orders List
1. Navigate to: http://localhost:3000/orders
2. **Expected Result**: Display list of orders with filters
3. **API Test**: Check for `/api/orders` call

#### Test Create Order
1. Click "إضافة طلب جديد"
2. Fill in order details
3. Click "إنشاء الطلب"
4. **Expected Result**: Order created with success toast
5. **API Test**: Check for `/api/orders` POST call

#### Test Order Details
1. Click on any order in the list
2. **Expected Result**: Display order details page
3. **API Test**: Check for `/api/orders/:id` call

#### Test Order Components (High Priority)
1. In order details page, test adding:
   - **Policy**: Click "إضافة بوليصة"
   - **SIAL**: Click "إضافة سال"
   - **Customs**: Click "بيان جمركي"
   - **Invoice**: Click "إضافة فاتورة"
   - **Transport**: Click "إضافة موقع النقل"
2. **Expected Result**: Each component added with success toast
3. **API Test**: Check for respective POST calls

#### Test Admin Actions
1. In order details page (as admin), test:
   - **Approve Order**: Click "موافقة"
   - **Reject Order**: Click "رفض"
   - **Request Documents**: Click "طلب مستندات إضافية"
2. **Expected Result**: Status updated with success toast
3. **API Test**: Check for `/api/orders/:id` PUT call

### 5. Client Orders Testing

#### Test Client Orders List
1. Navigate to: http://localhost:3000/client/orders
2. **Expected Result**: Display client's orders
3. **API Test**: Check for `/api/orders` call

#### Test Client Order Details
1. Click on any order
2. **Expected Result**: Display order details
3. **API Test**: Check for `/api/orders/:id` call

### 6. Client Section Orders Testing

#### Test Client Section Orders
1. Navigate to: http://localhost:3000/client-section/orders
2. **Expected Result**: Display orders with status filter
3. **API Test**: Check for `/api/orders` call

### 7. Supplier Orders Testing

#### Test Supplier Orders
1. Navigate to: http://localhost:3000/supplier/orders
2. **Expected Result**: Display orders with approve/reject options
3. **API Test**: Check for `/api/orders` call

#### Test Approve/Reject Orders
1. Click approve/reject on pending orders
2. **Expected Result**: Status updated with success toast
3. **API Test**: Check for `/api/orders/:id` PUT call

### 8. Profile Management Testing

#### Test Profile Update
1. Navigate to: http://localhost:3000/client/profile
2. Modify profile details
3. Click "حفظ التغييرات"
4. **Expected Result**: Profile updated with success toast
5. **API Test**: Check for `/api/profile` PUT call

### 9. Dashboard Testing

#### Test Dashboard Stats
1. Navigate to: http://localhost:3000/dashboard
2. **Expected Result**: Display dashboard with statistics
3. **API Test**: Check for `/api/reports/dashboard` call

### 10. Invoices Management Testing

#### Test Invoices List
1. Navigate to: http://localhost:3000/invoices
2. **Expected Result**: Display list of invoices with statistics
3. **API Test**: Check for `/api/invoices` call

#### Test Create Invoice
1. Click "إضافة فاتورة" button
2. Fill in invoice details (client name, order number, amount, status)
3. Click "إضافة الفاتورة"
4. **Expected Result**: Invoice created with success toast
5. **API Test**: Check for `/api/invoices` POST call

#### Test Invoice Statistics
1. Check the statistics cards at the top
2. **Expected Result**: Display total invoices, total amounts, paid amounts, pending amounts
3. **API Test**: Data should be calculated from API response

### 11. Vehicles Management Testing

#### Test Vehicles List
1. Navigate to: http://localhost:3000/vehicles
2. **Expected Result**: Display list of vehicles with statistics
3. **API Test**: Check for `/api/vehicles` call

#### Test Create Vehicle
1. Click "إضافة مركبة" button
2. Fill in vehicle details (type, model, plate number, driver, location)
3. Click "إضافة المركبة"
4. **Expected Result**: Vehicle created with success toast
5. **API Test**: Check for `/api/vehicles` POST call

#### Test Vehicle Statistics
1. Check the statistics cards at the top
2. **Expected Result**: Display total vehicles, available, in transit, maintenance
3. **API Test**: Data should be calculated from API response

### 12. Reports Testing

#### Test Reports Page
1. Navigate to: http://localhost:3000/reports
2. **Expected Result**: Display various reports
3. **API Test**: Check for reports API calls

## 🔍 Testing Checklist

### ✅ Authentication
- [ ] Login functionality
- [ ] Register functionality
- [ ] Logout functionality
- [ ] Token persistence
- [ ] Protected route access

### ✅ Users Management
- [ ] List users
- [ ] Create user
- [ ] Edit user
- [ ] Delete user
- [ ] Search/filter users

### ✅ Customers Management
- [ ] List customers
- [ ] Create customer (individual)
- [ ] Create customer (company)
- [ ] Edit customer
- [ ] Delete customer
- [ ] Customer details

### ✅ Orders Management
- [ ] List orders
- [ ] Create order
- [ ] Order details
- [ ] Add policy
- [ ] Add SIAL
- [ ] Add customs declaration
- [ ] Add purchase invoice
- [ ] Add transport location
- [ ] Approve order
- [ ] Reject order
- [ ] Request documents

### ✅ Client Views
- [ ] Client orders list
- [ ] Client order details
- [ ] Client profile update

### ✅ Supplier Views
- [ ] Supplier orders list
- [ ] Approve/reject orders

### ✅ Profile Management
- [ ] View profile
- [ ] Update profile
- [ ] Change password

### ✅ Invoices Management
- [ ] List invoices
- [ ] Create invoice
- [ ] Invoice statistics
- [ ] Search/filter invoices

### ✅ Vehicles Management
- [ ] List vehicles
- [ ] Create vehicle
- [ ] Vehicle statistics
- [ ] Search vehicles

### ✅ Dashboard & Reports
- [ ] Dashboard statistics
- [ ] Reports page

## 🐛 Common Issues & Solutions

### 1. API Connection Issues
- **Issue**: "فشل في الاتصال بالخادم"
- **Solution**: Check if backend server is running on `http://31.97.156.49:5001`

### 2. Authorization Issues
- **Issue**: "غير مصرح بالوصول"
- **Solution**: Ensure you're logged in with correct role permissions

### 3. Data Loading Issues
- **Issue**: "فشل في تحميل البيانات"
- **Solution**: Check browser console for API errors

### 4. Fallback to localStorage
- **Expected**: When API fails, data loads from localStorage
- **Test**: Disconnect internet and verify fallback functionality

## 📊 Performance Testing

### Load Testing
1. Test with large datasets
2. Monitor API response times
3. Check for memory leaks
4. Test concurrent user scenarios

### Error Handling Testing
1. Test network failures
2. Test invalid data inputs
3. Test authorization failures
4. Test server errors

## 🎯 Success Criteria

- ✅ All API endpoints respond correctly
- ✅ Error handling works properly
- ✅ Loading states display correctly
- ✅ Toast notifications show appropriate messages
- ✅ Fallback to localStorage works when API fails
- ✅ Data transformations are correct
- ✅ User experience is smooth and responsive

## 📝 Testing Notes

- Keep browser developer tools open to monitor network requests
- Check console for any JavaScript errors
- Verify that all toast notifications appear correctly
- Test both success and error scenarios
- Verify that data persists correctly in localStorage fallback
- Test with different user roles and permissions

## 🔧 Debugging Tips

1. **Check Network Tab**: Monitor all API calls in browser dev tools
2. **Check Console**: Look for JavaScript errors or API error messages
3. **Check localStorage**: Verify data is being stored correctly
4. **Check API Response**: Ensure backend is returning expected data format
5. **Test with Postman**: Verify API endpoints work independently

This testing guide covers all the integrated frontend endpoints. Follow the step-by-step instructions to thoroughly test each feature and ensure the API integration is working correctly. 