const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// MongoDB connection string (you'll need to get this from your server admin)
const MONGODB_URI = 'mongodb://31.97.156.49:27017/shipping_db';

// All the static data from initialize-data.tsx and localStorage
const staticData = {
  users: [
    // مستخدمو شركتك
    {
      name: "مدير النظام",
      email: "admin@pro.com",
      password: "Admin123",
      entity: "PRO",
      role: "GENERAL_MANAGER",
    },
    {
      name: "مدير العمليات",
      email: "operations@pro.com",
      password: "Ops123",
      entity: "PRO",
      role: "OPERATIONS_MANAGER",
    },
    {
      name: "مدير التخليص",
      email: "clearance@pro.com",
      password: "Clear123",
      entity: "PRO",
      role: "CLEARANCE_MANAGER",
    },
    {
      name: "مترجم",
      email: "translator@pro.com",
      password: "Trans123",
      entity: "PRO",
      role: "TRANSLATOR",
    },
    {
      name: "مخلص جمركي",
      email: "broker@pro.com",
      password: "Broker123",
      entity: "PRO",
      role: "CUSTOMS_BROKER",
    },
    {
      name: "سائق",
      email: "driver@pro.com",
      password: "Driver123",
      entity: "PRO",
      role: "DRIVER",
    },
    {
      name: "محاسب",
      email: "accountant@pro.com",
      password: "Acc123",
      entity: "PRO",
      role: "ACCOUNTANT",
    },
    {
      name: "مدخل بيانات",
      email: "dataentry@pro.com",
      password: "Data123",
      entity: "PRO",
      role: "DATA_ENTRY",
    },
    // مستخدمو العملاء
    {
      name: "مدير شركة ألفا",
      email: "manager@alpha.com",
      password: "Alpha123",
      entity: "CLIENT",
      role: "CLIENT_MANAGER",
      entityId: "CUST001",
    },
    {
      name: "مشرف شركة ألفا",
      email: "supervisor@alpha.com",
      password: "Alpha456",
      entity: "CLIENT",
      role: "CLIENT_SUPERVISOR",
      entityId: "CUST001",
    },
    {
      name: "مدخل بيانات شركة ألفا",
      email: "data@alpha.com",
      password: "Alpha789",
      entity: "CLIENT",
      role: "CLIENT_DATA_ENTRY",
      entityId: "CUST001",
    },
    // مستخدمو الموردين
    {
      name: "مدير شركة بيتا",
      email: "manager@beta.com",
      password: "Beta123",
      entity: "SUPPLIER",
      role: "SUPPLIER_MANAGER",
      entityId: "SUPP001",
    },
    {
      name: "مشرف شركة بيتا",
      email: "supervisor@beta.com",
      password: "Beta456",
      entity: "SUPPLIER",
      role: "SUPPLIER_SUPERVISOR",
      entityId: "SUPP001",
    },
    {
      name: "مدخل بيانات شركة بيتا",
      email: "data@beta.com",
      password: "Beta789",
      entity: "SUPPLIER",
      role: "SUPPLIER_DATA_ENTRY",
      entityId: "SUPP001",
    },
  ],

  customers: [
    {
      name: "شركة ألفا للتجارة",
      type: "company",
      phone: "0512345678",
      email: "info@alpha-trading.com",
      address: "الرياض، حي العليا، شارع التخصصي",
      contactPerson: "محمد العلي",
      taxNumber: "300012345600003",
      idNumber: "1234567890",
    },
    {
      name: "أحمد محمد",
      type: "individual",
      phone: "0567891234",
      email: "ahmed@example.com",
      address: "جدة، حي الروضة، شارع الأمير سلطان",
      idNumber: "1098765432",
    },
    {
      name: "مؤسسة النور",
      type: "company",
      phone: "0545678912",
      email: "contact@alnoor.com",
      address: "الدمام، حي الشاطئ، طريق الملك فهد",
      contactPerson: "خالد النور",
      taxNumber: "300045678900003",
      idNumber: "5432167890",
    },
    {
      name: "خالد عبدالله",
      type: "individual",
      phone: "0523456789",
      email: "khalid@example.com",
      address: "الرياض، حي النزهة، شارع عبدالرحمن الغافقي",
      idNumber: "2345678901",
    },
    {
      name: "شركة بيتا للخدمات اللوجستية",
      type: "company",
      phone: "0534567891",
      email: "info@beta-logistics.com",
      address: "جدة، المنطقة الصناعية، طريق الملك عبدالعزيز",
      contactPerson: "سعود الحربي",
      taxNumber: "300078912300003",
      idNumber: "6789012345",
    },
  ],

  vehicles: [
    {
      plateNumber: "أ ب ج 1234",
      type: "شاحنة",
      model: "مرسيدس",
      year: "2020",
      capacity: "20 طن",
      driver: "محمد السائق",
      phone: "0501234567",
      status: "متاح",
    },
    {
      plateNumber: "د ه و 5678",
      type: "شاحنة",
      model: "فولفو",
      year: "2021",
      capacity: "15 طن",
      driver: "أحمد الناقل",
      phone: "0502345678",
      status: "في مهمة",
    },
    {
      plateNumber: "ز ح ط 9012",
      type: "شاحنة صغيرة",
      model: "تويوتا",
      year: "2019",
      capacity: "5 طن",
      driver: "خالد السريع",
      phone: "0503456789",
      status: "متاح",
    },
    {
      plateNumber: "ي ك ل 3456",
      type: "شاحنة",
      model: "إيسوزو",
      year: "2022",
      capacity: "10 طن",
      driver: "سعد النقل",
      phone: "0504567890",
      status: "صيانة",
    },
  ],

  orders: [
    {
      clientId: "CUST001",
      clientName: "شركة الفا للتجارة",
      services: ["shipping"],
      status: "قيد المراجعة",
      policyNumber: "POL-12345",
      documents: [
        { name: "فاتورة الشحن.pdf", type: "application/pdf" },
        { name: "صورة البضاعة.jpg", type: "image/jpeg" },
        { name: "تفاصيل الطلب.docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      clientId: "CUST002",
      clientName: "أحمد محمد",
      services: ["import", "transport"],
      status: "موافق عليه",
      policyNumber: "POL-12346",
      documents: [
        { name: "شهادة المنشأ.pdf", type: "application/pdf" }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      clientId: "CUST003",
      clientName: "مؤسسة النور",
      services: ["export"],
      status: "مرفوض",
      policyNumber: "POL-12347",
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      clientId: "CUST004",
      clientName: "خالد عبدالله",
      services: ["transport"],
      status: "بانتظار مستندات إضافية",
      policyNumber: "POL-12348",
      documents: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

// Hash password function
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function seedDirectToDatabase() {
  console.log('🌱 Starting direct database seeding...\n');

  let client;
  try {
    // Connect to MongoDB
    console.log('1. Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db();

    // Step 1: Clear existing data (optional)
    console.log('2. Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('customers').deleteMany({});
    await db.collection('vehicles').deleteMany({});
    await db.collection('orders').deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Step 2: Seed Users
    console.log('3. Seeding Users...');
    for (const user of staticData.users) {
      const hashedPassword = await hashPassword(user.password);
      const userData = {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        entity: user.entity,
        role: user.role,
        entityId: user.entityId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('users').insertOne(userData);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }
    console.log('');

    // Step 3: Seed Customers
    console.log('4. Seeding Customers...');
    for (const customer of staticData.customers) {
      const customerData = {
        ...customer,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('customers').insertOne(customerData);
      console.log(`✅ Created customer: ${customer.name}`);
    }
    console.log('');

    // Step 4: Seed Vehicles
    console.log('5. Seeding Vehicles...');
    for (const vehicle of staticData.vehicles) {
      const vehicleData = {
        ...vehicle,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('vehicles').insertOne(vehicleData);
      console.log(`✅ Created vehicle: ${vehicle.plateNumber}`);
    }
    console.log('');

    // Step 5: Seed Orders
    console.log('6. Seeding Orders...');
    for (const order of staticData.orders) {
      await db.collection('orders').insertOne(order);
      console.log(`✅ Created order for: ${order.clientName}`);
    }
    console.log('');

    console.log('🎉 Direct database seeding completed!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${staticData.users.length}`);
    console.log(`- Customers: ${staticData.customers.length}`);
    console.log(`- Vehicles: ${staticData.vehicles.length}`);
    console.log(`- Orders: ${staticData.orders.length}`);

    console.log('\n🔗 Next Steps:');
    console.log('1. Test API connectivity');
    console.log('2. Update frontend components');
    console.log('3. Verify data is accessible');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Disconnected from MongoDB');
    }
  }
}

// Run the seeding
seedDirectToDatabase(); 