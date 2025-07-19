# Migration Guide: localStorage to API Calls

This guide helps you replace all localStorage operations with real API calls to your backend using best practices.

## 🚀 Quick Start

1. **Restart your backend server** to apply the authorization middleware changes
2. **Run the seeding script** to populate your database with fake data
3. **Use the new API service** (`lib/api.ts`) to replace localStorage operations

## 📋 Migration Checklist

### ✅ Step 1: Backend Authorization (COMPLETED)
- [x] Updated `middleware/auth.js` to allow `GENERAL_MANAGER` full access
- [ ] **ACTION REQUIRED**: Restart your backend server

### ✅ Step 2: Database Seeding (READY)
- [x] Created `scripts/seedData.js` with proper data structure
- [x] Updated data format to match backend models
- [ ] **ACTION REQUIRED**: Run `node scripts/seedData.js` after restarting backend

### ✅ Step 3: API Service (COMPLETED)
- [x] Created `lib/api.ts` with all API endpoints
- [ ] **ACTION REQUIRED**: Replace localStorage usage in components

## 🔄 How to Replace localStorage with API Calls

### Before (localStorage):
```typescript
// Get data
const customers = JSON.parse(localStorage.getItem("customers") || "[]");

// Save data
localStorage.setItem("customers", JSON.stringify([...customers, newCustomer]));
```

### After (API):
```typescript
import { customersAPI } from '@/lib/api';

// Get data
const result = await customersAPI.getAll();
const customers = result.success ? result.data : [];

// Save data
const result = await customersAPI.create(newCustomer);
```

## 📁 Files to Update

### 1. Authentication (`components/auth-provider.tsx`)
**Current**: Uses direct fetch for login
**Update**: Use `authAPI.login()` and `authAPI.register()`

### 2. Users Management (`app/users/page.tsx`)
**Current**: Uses localStorage for users
**Update**: Use `usersAPI.getAll()`, `usersAPI.create()`, etc.

### 3. Customers Management (`app/customers/page.tsx`)
**Current**: Uses localStorage for customers
**Update**: Use `customersAPI.getAll()`, `customersAPI.create()`, etc.

### 4. Orders Management (`app/orders/page.tsx`)
**Current**: Uses localStorage for orders
**Update**: Use `ordersAPI.getAll()`, `ordersAPI.create()`, etc.

### 5. Order Details (`app/orders/[id]/order-details.tsx`)
**Current**: Uses localStorage for order data and related items
**Update**: Use `ordersAPI.getById()`, `ordersAPI.addPolicy()`, etc.

### 6. Profile Management (`app/client/profile/page.tsx`)
**Current**: Uses localStorage for profile data
**Update**: Use `profileAPI.getProfile()`, `profileAPI.updateProfile()`

### 7. Registration (`app/register/page.tsx`)
**Current**: Stores data in localStorage
**Update**: Use `authAPI.register()` and `customersAPI.create()`

## 🛠️ Best Practices

### 1. Error Handling
```typescript
const { customersAPI } = await import('@/lib/api');

try {
  const result = await customersAPI.getAll();
  if (result.success) {
    setCustomers(result.data);
  } else {
    toast({
      title: "خطأ في تحميل البيانات",
      description: result.error,
      variant: "destructive",
    });
  }
} catch (error) {
  console.error('Failed to fetch customers:', error);
  toast({
    title: "خطأ في الاتصال",
    description: "فشل في الاتصال بالخادم",
    variant: "destructive",
  });
}
```

### 2. Loading States
```typescript
const [loading, setLoading] = useState(true);
const [customers, setCustomers] = useState([]);

useEffect(() => {
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const result = await customersAPI.getAll();
      if (result.success) {
        setCustomers(result.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchCustomers();
}, []);
```

### 3. Optimistic Updates
```typescript
const handleCreateCustomer = async (customerData) => {
  // Optimistic update
  const tempCustomer = { ...customerData, id: Date.now().toString() };
  setCustomers(prev => [...prev, tempCustomer]);

  try {
    const result = await customersAPI.create(customerData);
    if (result.success) {
      // Replace temp customer with real one
      setCustomers(prev => prev.map(c => 
        c.id === tempCustomer.id ? result.data : c
      ));
      toast({ title: "تم إنشاء العميل بنجاح" });
    } else {
      // Revert on error
      setCustomers(prev => prev.filter(c => c.id !== tempCustomer.id));
      toast({ 
        title: "خطأ في إنشاء العميل", 
        description: result.error,
        variant: "destructive" 
      });
    }
  } catch (error) {
    // Revert on error
    setCustomers(prev => prev.filter(c => c.id !== tempCustomer.id));
    toast({ 
      title: "خطأ في الاتصال",
      variant: "destructive" 
    });
  }
};
```

### 4. Data Caching
```typescript
// Use React Query or SWR for better caching
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const result = await customersAPI.getAll();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
};

const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: customersAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
```

## 🔧 Migration Examples

### Example 1: Customers Page Migration
```typescript
// Before
useEffect(() => {
  const storedCustomers = localStorage.getItem("customers");
  if (storedCustomers) {
    setCustomers(JSON.parse(storedCustomers));
  }
}, []);

// After
useEffect(() => {
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const result = await customersAPI.getAll();
      if (result.success) {
        setCustomers(result.data);
      } else {
        toast({
          title: "خطأ في تحميل العملاء",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في الاتصال بالخادم",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  fetchCustomers();
}, []);
```

### Example 2: Order Details Migration
```typescript
// Before
const handleAddPolicy = (policyData) => {
  const newPolicy = { ...policyData, id: Date.now() };
  const updatedPolicies = [...policies, newPolicy];
  setPolicies(updatedPolicies);

  const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
  const orderIndex = storedOrders.findIndex((o) => o.id === id);
  if (orderIndex !== -1) {
    storedOrders[orderIndex] = {
      ...storedOrders[orderIndex],
      policies: updatedPolicies,
    };
  }
  localStorage.setItem("orders", JSON.stringify(storedOrders));
};

// After
const handleAddPolicy = async (policyData) => {
  try {
    const result = await ordersAPI.addPolicy(id, policyData);
    if (result.success) {
      setPolicies(prev => [...prev, result.data]);
      toast({
        title: "تمت إضافة البوليصة",
        description: "تم إضافة البوليصة بنجاح",
      });
    } else {
      toast({
        title: "خطأ في إضافة البوليصة",
        description: result.error,
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "خطأ في الاتصال",
      description: "فشل في الاتصال بالخادم",
      variant: "destructive",
    });
  }
};
```

## 🧪 Testing Recommendations

### 1. Unit Testing
```typescript
// Test API calls
import { customersAPI } from '@/lib/api';

describe('customersAPI', () => {
  it('should fetch customers successfully', async () => {
    const result = await customersAPI.getAll();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });
});
```

### 2. Integration Testing
```typescript
// Test component with API
import { render, screen, waitFor } from '@testing-library/react';
import CustomersPage from '@/app/customers/page';

test('should load and display customers', async () => {
  render(<CustomersPage />);
  
  await waitFor(() => {
    expect(screen.getByText('شركة ألفا للتجارة')).toBeInTheDocument();
  });
});
```

### 3. E2E Testing
```typescript
// Test complete user flows
test('should create a new customer', async () => {
  await page.goto('/customers/add');
  await page.fill('[name="name"]', 'Test Customer');
  await page.fill('[name="email"]', 'test@example.com');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/customers');
  await expect(page.locator('text=Test Customer')).toBeVisible();
});
```

### 4. API Testing
```bash
# Test API endpoints
curl -X GET http://localhost:5001/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN"

curl -X POST http://localhost:5001/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test Customer","email":"test@example.com"}'
```

## 📊 Performance Monitoring

### 1. API Response Times
```typescript
// Add timing to API calls
const apiCall = async (endpoint, method, data, requireAuth) => {
  const startTime = performance.now();
  try {
    const result = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const endTime = performance.now();
    console.log(`API ${endpoint} took ${endTime - startTime}ms`);
    return result;
  } catch (error) {
    const endTime = performance.now();
    console.error(`API ${endpoint} failed after ${endTime - startTime}ms`);
    throw error;
  }
};
```

### 2. Error Tracking
```typescript
// Track API errors
const apiCall = async (endpoint, method, data, requireAuth) => {
  try {
    // ... API call logic
  } catch (error) {
    // Log to error tracking service
    console.error(`API Error: ${endpoint}`, {
      method,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
};
```

## 🚀 Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify authentication flow
- [ ] Check error handling
- [ ] Test loading states
- [ ] Verify data persistence
- [ ] Test offline scenarios
- [ ] Monitor API performance
- [ ] Update documentation

## 📚 Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [SWR Documentation](https://swr.vercel.app/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) 