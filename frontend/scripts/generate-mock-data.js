const fs = require('fs');
const path = require('path');

const mockDir = path.join(__dirname, '..', 'src', 'mock');
if (!fs.existsSync(mockDir)) fs.mkdirSync(mockDir, { recursive: true });

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randEl = (arr) => arr[rand(0, arr.length - 1)];

const cities = ["Guwahati", "Silchar", "Agartala", "Shillong", "Kolkata", "Bengaluru", "Delhi", "Mumbai"];
const firstNames = ["Amit", "Rahul", "Priya", "Sneha", "Vikram", "Neha", "Rohan", "Anjali", "Suresh", "Ramesh", "Kiran", "Arjun"];
const lastNames = ["Sharma", "Singh", "Patel", "Das", "Bose", "Gupta", "Kumar", "Reddy", "Nair", "Iyer"];
const statuses = ["Available", "Rented", "Maintenance"];

// Owners (20)
const owners = Array.from({ length: 20 }, (_, i) => ({
  id: `owner_${i + 1}`,
  name: `${randEl(firstNames)} ${randEl(lastNames)}`,
  company: `${randEl(lastNames)} Equipments Ltd.`,
  email: `owner${i + 1}@example.com`,
  phone: `+91 98${rand(10000000, 99999999)}`,
  rating: (rand(35, 50) / 10).toFixed(1),
  location: randEl(cities),
  totalEquipment: rand(5, 50),
  joinedAt: "2023-01-15",
  photo: `https://i.pravatar.cc/150?u=owner${i}`
}));

// Drivers (20)
const drivers = Array.from({ length: 20 }, (_, i) => ({
  id: `driver_${i + 1}`,
  name: `${randEl(firstNames)} ${randEl(lastNames)}`,
  email: `driver${i + 1}@example.com`,
  phone: `+91 97${rand(10000000, 99999999)}`,
  rating: (rand(40, 50) / 10).toFixed(1),
  experience: `${rand(2, 15)} years`,
  status: randEl(["Available", "On Job", "Offline"]),
  assignedEquipment: null,
  photo: `https://i.pravatar.cc/150?u=driver${i}`
}));

// Equipment (30)
const equipmentTypes = ["Excavator", "Bulldozer", "Crane", "Loader", "Dump Truck", "Compactor", "Concrete Mixer", "Generator", "Scissor Lift", "Forklift"];
const equipment = Array.from({ length: 30 }, (_, i) => {
  const type = randEl(equipmentTypes);
  const owner = randEl(owners);
  return {
    id: `eq_${i + 1}`,
    name: `Heavy-Duty ${type} ${rand(100, 999)}X`,
    category: type,
    description: `Professional grade ${type.toLowerCase()} for construction needs. Maintained and serviced regularly.`,
    pricePerHour: rand(500, 5000),
    pricePerDay: rand(4000, 40000),
    location: owner.location,
    rating: (rand(40, 50) / 10).toFixed(1),
    reviewsCount: rand(5, 120),
    status: randEl(statuses),
    ownerId: owner.id,
    image: `https://images.unsplash.com/photo-1579730538965-4f40f04f37df?auto=format&fit=crop&w=600&q=80`,
    features: ["GPS Tracking", "Operator Included", "Fuel Efficient"]
  };
});

// Bookings (50)
const bookingStatuses = ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];
const bookings = Array.from({ length: 50 }, (_, i) => {
  const eq = randEl(equipment);
  return {
    id: `book_${i + 1}`,
    equipmentId: eq.id,
    equipmentName: eq.name,
    ownerId: eq.ownerId,
    renterId: `user_${rand(1, 10)}`,
    driverId: rand(0, 1) ? randEl(drivers).id : null,
    startDate: "2026-07-01",
    endDate: "2026-07-05",
    totalPrice: rand(5000, 100000),
    status: randEl(bookingStatuses),
    location: eq.location
  };
});

// Notifications
const notifications = [
  { id: "notif_1", type: "booking", title: "Booking Confirmed", message: "Your booking for Excavator 500X has been confirmed.", date: "2026-06-30T10:00:00Z", read: false },
  { id: "notif_2", type: "payment", title: "Payment Received", message: "Payment of ₹15,000 received for booking book_12.", date: "2026-06-29T14:30:00Z", read: true }
];

// Reviews
const reviews = [
  { id: "rev_1", equipmentId: "eq_1", userId: "user_1", userName: "Ravi Kumar", rating: 5, comment: "Excellent condition and very punctual delivery.", date: "2026-06-28" },
  { id: "rev_2", equipmentId: "eq_2", userId: "user_2", userName: "Neha Singh", rating: 4, comment: "Good equipment, but driver was a bit late.", date: "2026-06-25" }
];

// Analytics
const analytics = {
  totalRevenue: 1250000,
  activeRentals: 15,
  totalBookings: 320,
  growth: "+12.5%",
  monthlyRevenue: [
    { month: "Jan", revenue: 80000 },
    { month: "Feb", revenue: 95000 },
    { month: "Mar", revenue: 110000 },
    { month: "Apr", revenue: 105000 },
    { month: "May", revenue: 130000 },
    { month: "Jun", revenue: 145000 }
  ]
};

// Wallet
const wallet = {
  balance: 45000,
  recentTransactions: [
    { id: "txn_1", type: "credit", amount: 15000, date: "2026-06-30", description: "Booking income (book_12)" },
    { id: "txn_2", type: "debit", amount: 2000, date: "2026-06-28", description: "Platform fee" },
    { id: "txn_3", type: "credit", amount: 32000, date: "2026-06-25", description: "Booking income (book_10)" }
  ]
};

// Profile
const profile = {
  id: "user_1",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 9876543210",
  role: "renter",
  joinedAt: "2025-11-20",
  photo: "https://i.pravatar.cc/150?u=johndoe",
  address: "123 Main Street, Guwahati, Assam"
};

const writeJson = (filename, data) => fs.writeFileSync(path.join(mockDir, filename), JSON.stringify(data, null, 2));

writeJson('owners.json', owners);
writeJson('drivers.json', drivers);
writeJson('equipment.json', equipment);
writeJson('bookings.json', bookings);
writeJson('notifications.json', notifications);
writeJson('reviews.json', reviews);
writeJson('analytics.json', analytics);
writeJson('wallet.json', wallet);
writeJson('profile.json', profile);

console.log('Mock data generated successfully!');
