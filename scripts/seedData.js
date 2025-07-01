const mongoose = require("mongoose")
const User = require("../models/User")
const Customer = require("../models/Customer")
const Order = require("../models/Order")
const Vehicle = require("../models/Vehicle")
require("dotenv").config()

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Customer.deleteMany({})
    await Order.deleteMany({})
    await Vehicle.deleteMany({})

    // Create admin user
    const adminUser = new User({
      name: "Admin User",
      email: "admin@prospeed.com",
      password: "admin123",
      role: "admin",
      phone: "+966501234567",
      address: {
        street: "123 Admin Street",
        city: "Riyadh",
        country: "Saudi Arabia",
      },
    })
    await adminUser.save()

    // Create employee user
    const employeeUser = new User({
      name: "Employee User",
      email: "employee@prospeed.com",
      password: "employee123",
      role: "employee",
      phone: "+966507654321",
      address: {
        street: "456 Employee Avenue",
        city: "Jeddah",
        country: "Saudi Arabia",
      },
      createdBy: adminUser._id,
    })
    await employeeUser.save()

    // Create client user
    const clientUser = new User({
      name: "Client User",
      email: "client@example.com",
      password: "client123",
      role: "client",
      phone: "+966509876543",
      address: {
        street: "789 Client Road",
        city: "Dammam",
        country: "Saudi Arabia",
      },
      createdBy: adminUser._id,
    })
    await clientUser.save()

    // Create sample customers
    const customers = [
      {
        name: "Ahmed Al-Rashid",
        email: "ahmed@example.com",
        phone: "+966501111111",
        company: {
          name: "Al-Rashid Trading",
          taxId: "123456789",
          industry: "Import/Export",
        },
        address: {
          street: "123 Business District",
          city: "Riyadh",
          country: "Saudi Arabia",
        },
        customerType: "business",
        creditLimit: 50000,
        createdBy: adminUser._id,
      },
      {
        name: "Fatima Al-Zahra",
        email: "fatima@example.com",
        phone: "+966502222222",
        address: {
          street: "456 Residential Area",
          city: "Jeddah",
          country: "Saudi Arabia",
        },
        customerType: "individual",
        createdBy: employeeUser._id,
      },
    ]

    const createdCustomers = await Customer.insertMany(customers)

    // Create sample vehicles
    const vehicles = [
      {
        plateNumber: "ABC-1234",
        type: "truck",
        model: {
          brand: "Mercedes",
          model: "Actros",
          year: 2022,
        },
        capacity: {
          weight: 25000,
          volume: 100,
        },
        driver: {
          name: "Mohammed Al-Fahd",
          phone: "+966503333333",
          licenseNumber: "DL123456",
          licenseExpiry: new Date("2025-12-31"),
        },
        status: "available",
        currentLocation: {
          address: "Riyadh Logistics Hub",
          coordinates: {
            lat: 24.7136,
            lng: 46.6753,
          },
        },
      },
      {
        plateNumber: "XYZ-5678",
        type: "van",
        model: {
          brand: "Ford",
          model: "Transit",
          year: 2021,
        },
        capacity: {
          weight: 3500,
          volume: 15,
        },
        driver: {
          name: "Ali Al-Mutairi",
          phone: "+966504444444",
          licenseNumber: "DL789012",
          licenseExpiry: new Date("2024-06-30"),
        },
        status: "available",
        currentLocation: {
          address: "Jeddah Distribution Center",
          coordinates: {
            lat: 21.3891,
            lng: 39.8579,
          },
        },
      },
    ]

    const createdVehicles = await Vehicle.insertMany(vehicles)

    // Create sample orders
    const orders = [
      {
        orderNumber: "ORD-1001",
        customer: createdCustomers[0]._id,
        serviceType: "land_transport",
        status: "confirmed",
        priority: "high",
        origin: {
          address: "Riyadh Industrial City",
          city: "Riyadh",
          country: "Saudi Arabia",
          coordinates: { lat: 24.7136, lng: 46.6753 },
        },
        destination: {
          address: "Jeddah Port",
          city: "Jeddah",
          country: "Saudi Arabia",
          coordinates: { lat: 21.3891, lng: 39.8579 },
        },
        cargo: {
          description: "Electronic Equipment",
          weight: 1500,
          dimensions: { length: 200, width: 150, height: 100 },
          value: 25000,
          quantity: 10,
          packageType: "box",
        },
        pricing: {
          basePrice: 2500,
          additionalCharges: [
            { description: "Insurance", amount: 250 },
            { description: "Handling", amount: 150 },
          ],
          discount: 0,
          tax: 390,
          totalAmount: 3290,
        },
        timeline: {
          estimatedPickup: new Date(Date.now() + 24 * 60 * 60 * 1000),
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
        assignedTo: employeeUser._id,
        vehicle: createdVehicles[0]._id,
        createdBy: adminUser._id,
      },
      {
        orderNumber: "ORD-1002",
        customer: createdCustomers[1]._id,
        serviceType: "express_delivery",
        status: "in_transit",
        priority: "medium",
        origin: {
          address: "Jeddah Mall",
          city: "Jeddah",
          country: "Saudi Arabia",
          coordinates: { lat: 21.3891, lng: 39.8579 },
        },
        destination: {
          address: "Dammam Residential",
          city: "Dammam",
          country: "Saudi Arabia",
          coordinates: { lat: 26.4207, lng: 50.0888 },
        },
        cargo: {
          description: "Personal Documents",
          weight: 2,
          dimensions: { length: 30, width: 20, height: 5 },
          value: 100,
          quantity: 1,
          packageType: "envelope",
        },
        pricing: {
          basePrice: 150,
          additionalCharges: [],
          discount: 15,
          tax: 20.25,
          totalAmount: 155.25,
        },
        timeline: {
          estimatedPickup: new Date(Date.now() - 12 * 60 * 60 * 1000),
          actualPickup: new Date(Date.now() - 10 * 60 * 60 * 1000),
          estimatedDelivery: new Date(Date.now() + 12 * 60 * 60 * 1000),
        },
        assignedTo: employeeUser._id,
        vehicle: createdVehicles[1]._id,
        tracking: {
          trackingNumber: "TRK-2024-000001",
          currentLocation: {
            address: "Highway Rest Stop",
            coordinates: { lat: 24.0, lng: 45.0 },
            timestamp: new Date(),
          },
          updates: [
            {
              status: "picked_up",
              location: "Jeddah Mall",
              timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
              notes: "Package picked up successfully",
              updatedBy: employeeUser._id,
            },
            {
              status: "in_transit",
              location: "Highway Rest Stop",
              timestamp: new Date(),
              notes: "Package in transit to destination",
              updatedBy: employeeUser._id,
            },
          ],
        },
        createdBy: employeeUser._id,
      },
    ]

    await Order.insertMany(orders)

    console.log("✅ Sample data created successfully!")
    console.log("\n📧 Login Credentials:")
    console.log("Admin: admin@prospeed.com / admin123")
    console.log("Employee: employee@prospeed.com / employee123")
    console.log("Client: client@example.com / client123")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding data:", error)
    process.exit(1)
  }
}

seedData()
