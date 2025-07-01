import requests
import json
from typing import Dict, Any, Optional

class APITester:
    def __init__(self, base_url: str = "http://localhost:5000/api"):
        self.base_url = base_url
        self.auth_token = ""
        self.admin_token = ""
        self.customer_id = ""
        self.order_id = ""
        self.vehicle_id = ""
        
        # Test data
        self.test_data = {
            "admin": {
                "email": "admin@prospeed.com",
                "password": "admin123"
            },
            "customer": {
                "name": "Ahmed Al-Rashid",
                "email": "ahmed@example.com",
                "phone": "+966501111111",
                "company": {
                    "name": "Al-Rashid Trading",
                    "taxId": "123456789",
                    "industry": "Import/Export"
                },
                "address": {
                    "street": "123 Business District",
                    "city": "Riyadh",
                    "country": "Saudi Arabia"
                },
                "customerType": "business",
                "creditLimit": 50000,
                "status": "active"
            },
            "order": {
                "serviceType": "land_transport",
                "status": "pending",
                "priority": "high",
                "origin": {
                    "address": "Riyadh Industrial City",
                    "city": "Riyadh",
                    "country": "Saudi Arabia",
                    "coordinates": {"lat": 24.7136, "lng": 46.6753}
                },
                "destination": {
                    "address": "Jeddah Port",
                    "city": "Jeddah",
                    "country": "Saudi Arabia",
                    "coordinates": {"lat": 21.3891, "lng": 39.8579}
                },
                "cargo": {
                    "description": "Electronic Equipment",
                    "weight": 1500,
                    "dimensions": {"length": 200, "width": 150, "height": 100},
                    "value": 25000,
                    "quantity": 10,
                    "packageType": "box"
                },
                "pricing": {
                    "basePrice": 2500,
                    "additionalCharges": [{"description": "Insurance", "amount": 250}],
                    "discount": 0,
                    "tax": 390,
                    "totalAmount": 3290
                }
            },
            "vehicle": {
                "plateNumber": "ABC-1234",
                "type": "truck",
                "model": {
                    "brand": "Mercedes",
                    "model": "Actros",
                    "year": 2022
                },
                "capacity": {
                    "weight": 25000,
                    "volume": 100
                },
                "driver": {
                    "name": "Mohammed Al-Fahd",
                    "phone": "+966503333333",
                    "licenseNumber": "DL123456",
                    "licenseExpiry": "2025-12-31"
                },
                "status": "available",
                "currentLocation": {
                    "address": "Riyadh Logistics Hub",
                    "coordinates": {"lat": 24.7136, "lng": 46.6753}
                }
            }
        }

    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, token: Optional[str] = None) -> Dict[str, Any]:
        """Make HTTP request to API"""
        url = f"{self.base_url}{endpoint}"
        headers = {"Content-Type": "application/json"}
        
        if token:
            headers["Authorization"] = f"Bearer {token}"
        
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers)
            elif method.upper() == "POST":
                response = requests.post(url, headers=headers, json=data)
            elif method.upper() == "PUT":
                response = requests.put(url, headers=headers, json=data)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=headers)
            else:
                return {"success": False, "error": "Invalid method"}
            
            if response.status_code < 400:
                return {"success": True, "data": response.json(), "status": response.status_code}
            else:
                return {"success": False, "error": response.json(), "status": response.status_code}
                
        except Exception as e:
            return {"success": False, "error": str(e), "status": 0}

    def test_health_check(self):
        """Test health check endpoint"""
        print("🏥 Testing Health Check...")
        result = self.make_request("GET", "/health")
        print(f"Status: {result['status']} {'✅' if result['success'] else '❌'}")
        if result['success']:
            print(f"Response: {result['data']}")
        else:
            print(f"Error: {result['error']}")
        print("---")

    def test_login(self):
        """Test login endpoint"""
        print("🔐 Testing Login...")
        result = self.make_request("POST", "/auth/login", self.test_data["admin"])
        print(f"Status: {result['status']} {'✅' if result['success'] else '❌'}")
        if result['success']:
            self.admin_token = result['data']['token']
            print(f"Admin token received: {self.admin_token[:20]}...")
        else:
            print(f"Error: {result['error']}")
        print("---")

    def test_register(self):
        """Test register endpoint"""
        print("📝 Testing Register...")
        register_data = {
            "name": "Test User",
            "email": "testuser@example.com",
            "password": "test1234",
            "phone": "+966501234000",
            "role": "client",
            "address": {
                "street": "123 Test Street",
                "city": "Riyadh",
                "country": "Saudi Arabia"
            }
        }
        result = self.make_request("POST", "/auth/register", register_data)
        print(f"Status: {result['status']} {'✅' if result['success'] else '❌'}")
        if result['success']:
            self.auth_token = result['data']['token']
            print(f"User token received: {self.auth_token[:20]}...")
        else:
            print(f"Error: {result['error']}")
        print("---")

    def test_get_current_user(self):
        """Test get current user endpoint"""
        print("👤 Testing Get Current User...")
        result = self.make_request("GET", "/auth/me", token=self.auth_token)
        print(f"Status: {result['status']} {'✅' if result['success'] else '❌'}")
        if result['success']:
            print(f"User: {result['data']['user']['name']}")
        else:
            print(f"Error: {result['error']}")
        print("---")

    def test_create_customer(self):
        """Test create customer endpoint"""
        print("👥 Testing Create Customer...")
        result = self.make_request("POST", "/customers", self.test_data["customer"], self.auth_token)
        print(f"Status: {result['status']} {'✅' if result['success'] else '❌'}")
        if result['success']:
            self.customer_id = result['data']['data']['_id']
            print(f"Customer created with ID: {self.customer_id}")
        else:
            print(f"Error: {result['error']}")
        print("---")

    def test_get_customers(self):
        """Test get all customers endpoint"""
        print("📋 Testing Get All Customers...")
        result = self.make_request("GET", "/customers", token=self.auth_token)
        print(f"Status: {result['status']} {'✅' if result['success'] else '❌'}")
        if result['success']:
            print(f"Found {len(result['data']['data'])} customers")
        else:
            print(f"Error: {result['error']}")
        print("---")

    def test_create_vehicle(self):
        """Test create vehicle endpoint"""
        print("🚛 Testing Create Vehicle...")
        result = self.make_request("POST", "/vehicles", self.test_data["vehicle"], self.auth_token)
        print(f"Status: {result['status']} {'✅' if result['success'] else '❌'}")
        if result['success']:
            self.vehicle_id = result['data']['data']['_id']
            print(f"Vehicle created with ID: {self.vehicle_id}")
        else:
            print(f"Error: {result['error']}")
        print("---")

    def test_create_order(self):
        """Test create order endpoint"""
        print("📦 Testing Create Order...")
        order_data = self.test_data["order"].copy()
        order_data["customer"] = self.customer_id
        result = self.make_request("POST", "/orders", order_data, self.auth_token)
        print(f"Status: {result['status']} {'✅' if result['success'] else '❌'}")
        if result['success']:
            self.order_id = result['data']['data']['_id']
            print(f"Order created with ID: {self.order_id}")
        else:
            print(f"Error: {result['error']}")
        print("---")

    def test_get_orders(self):
        """Test get all orders endpoint"""
        print("📋 Testing Get All Orders...")
        result = self.make_request("GET", "/orders", token=self.auth_token)
        print(f"Status: {result['status']} {'✅' if result['success'] else '❌'}")
        if result['success']:
            print(f"Found {len(result['data']['data'])} orders")
        else:
            print(f"Error: {result['error']}")
        print("---")

    def test_update_order_status(self):
        """Test update order status endpoint"""
        print("🔄 Testing Update Order Status...")
        status_data = {
            "status": "in_transit",
            "notes": "Package picked up and in transit"
        }
        result = self.make_request("PUT", f"/orders/{self.order_id}/status", status_data, self.auth_token)
        print(f"Status: {result['status']} {'✅' if result['success'] else '❌'}")
        if result['success']:
            print("Order status updated successfully")
        else:
            print(f"Error: {result['error']}")
        print("---")

    def test_get_vehicles(self):
        """Test get all vehicles endpoint"""
        print("🚛 Testing Get All Vehicles...")
        result = self.make_request("GET", "/vehicles", token=self.auth_token)
        print(f"Status: {result['status']} {'✅' if result['success'] else '❌'}")
        if result['success']:
            print(f"Found {len(result['data']['data'])} vehicles")
        else:
            print(f"Error: {result['error']}")
        print("---")

    def test_get_shipments(self):
        """Test get all shipments endpoint"""
        print("📦 Testing Get All Shipments...")
        result = self.make_request("GET", "/shipments", token=self.auth_token)
        print(f"Status: {result['status']} {'✅' if result['success'] else '❌'}")
        if result['success']:
            print(f"Found {len(result['data']['data'])} shipments")
        else:
            print(f"Error: {result['error']}")
        print("---")

    def test_get_invoices(self):
        """Test get all invoices endpoint"""
        print("🧾 Testing Get All Invoices...")
        result = self.make_request("GET", "/invoices", token=self.auth_token)
        print(f"Status: {result['status']} {'✅' if result['success'] else '❌'}")
        if result['success']:
            print(f"Found {len(result['data']['data'])} invoices")
        else:
            print(f"Error: {result['error']}")
        print("---")

    def test_get_reports(self):
        """Test get reports endpoint"""
        print("📊 Testing Get Reports...")
        result = self.make_request("GET", "/reports", token=self.admin_token)
        print(f"Status: {result['status']} {'✅' if result['success'] else '❌'}")
        if result['success']:
            print("Reports retrieved successfully")
        else:
            print(f"Error: {result['error']}")
        print("---")

    def test_get_notifications(self):
        """Test get notifications endpoint"""
        print("🔔 Testing Get Notifications...")
        result = self.make_request("GET", "/notifications", token=self.auth_token)
        print(f"Status: {result['status']} {'✅' if result['success'] else '❌'}")
        if result['success']:
            print(f"Found {len(result['data']['data'])} notifications")
        else:
            print(f"Error: {result['error']}")
        print("---")

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting API Tests...\n")
        
        # Test order
        self.test_health_check()
        self.test_login()
        self.test_register()
        self.test_get_current_user()
        self.test_create_customer()
        self.test_get_customers()
        self.test_create_vehicle()
        self.test_create_order()
        self.test_get_orders()
        self.test_update_order_status()
        self.test_get_vehicles()
        self.test_get_shipments()
        self.test_get_invoices()
        self.test_get_reports()
        self.test_get_notifications()
        
        print("✅ All tests completed!")
        print("\n📊 Summary:")
        print(f"- Admin Token: {'✅' if self.admin_token else '❌'}")
        print(f"- User Token: {'✅' if self.auth_token else '❌'}")
        print(f"- Customer ID: {self.customer_id or '❌'}")
        print(f"- Vehicle ID: {self.vehicle_id or '❌'}")
        print(f"- Order ID: {self.order_id or '❌'}")

if __name__ == "__main__":
    tester = APITester()
    tester.run_all_tests() 