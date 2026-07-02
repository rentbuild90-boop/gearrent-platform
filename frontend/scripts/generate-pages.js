const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', 'src', 'app');

const createPage = (route, name, content) => {
  const dir = path.join(appDir, route);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.jsx'), content);
};

const createLayout = (route, content) => {
  const dir = path.join(appDir, route);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'layout.jsx'), content);
};

const genericPage = (title) => `
import { Card, CardContent } from "@/components/ui/card";

export default function ${title.replace(/\s+/g, '')}Page() {
  return (
    <div className="container mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold mb-6">${title}</h1>
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <p>This is the ${title} page. UI components will be rendered here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
`;

// Public Pages
createPage('', 'Landing', genericPage('GearRent Landing'));
createPage('about', 'About', genericPage('About Us'));
createPage('categories', 'Categories', genericPage('Categories'));
createPage('equipment', 'Equipment Listing', genericPage('Equipment Listing'));
createPage('equipment/[id]', 'Equipment Details', genericPage('Equipment Details'));
createPage('search', 'Search', genericPage('Search'));
createPage('wishlist', 'Wishlist', genericPage('Wishlist'));
createPage('faq', 'FAQ', genericPage('FAQ'));
createPage('contact', 'Contact', genericPage('Contact'));
createPage('privacy', 'Privacy', genericPage('Privacy Policy'));
createPage('terms', 'Terms', genericPage('Terms & Conditions'));

// Auth Pages
createPage('auth/splash', 'Splash', genericPage('Splash'));
createPage('auth/login', 'Login', genericPage('Login'));
createPage('auth/register', 'Register', genericPage('Register'));
createPage('auth/otp', 'OTP Screen', genericPage('Enter OTP'));
createPage('auth/forgot-password', 'Forgot Password', genericPage('Forgot Password'));
createPage('auth/role', 'Role Selection', genericPage('Choose Role'));

// Layouts for dashboards
const dashboardLayout = (role) => `
import { Sidebar } from "@/components/Layout/Sidebar";
import { BottomNav } from "@/components/Layout/BottomNav";
import { Navbar } from "@/components/Layout/Navbar";

export default function ${role}Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block">
        <Sidebar role="${role.toLowerCase()}" />
      </div>
      <div className="flex-1 flex flex-col md:ml-64 mb-16 md:mb-0">
        <Navbar role="${role.toLowerCase()}" />
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/20">
          {children}
        </main>
      </div>
      <div className="md:hidden">
        <BottomNav role="${role.toLowerCase()}" />
      </div>
    </div>
  );
}
`;

createLayout('user', dashboardLayout('User'));
createLayout('owner', dashboardLayout('Owner'));
createLayout('driver', dashboardLayout('Driver'));
createLayout('admin', dashboardLayout('Admin'));

// User Pages
createPage('user', 'Dashboard', genericPage('User Dashboard'));
createPage('user/nearby', 'Nearby Equipment', genericPage('Nearby Equipment'));
createPage('user/categories', 'User Categories', genericPage('Categories'));
createPage('user/search', 'User Search', genericPage('Search Equipment'));
createPage('user/wishlist', 'User Wishlist', genericPage('My Wishlist'));
createPage('user/bookings', 'Bookings', genericPage('My Bookings'));
createPage('user/bookings/[id]', 'Booking Details', genericPage('Booking Details'));
createPage('user/bookings/[id]/track', 'Track Booking', genericPage('Track Booking'));
createPage('user/notifications', 'Notifications', genericPage('Notifications'));
createPage('user/chat', 'Chat UI', genericPage('Messages'));
createPage('user/profile', 'Profile', genericPage('My Profile'));
createPage('user/settings', 'Settings', genericPage('Settings'));
createPage('user/help', 'Help', genericPage('Help & Support'));

// Owner Pages
createPage('owner', 'Dashboard', genericPage('Owner Dashboard'));
createPage('owner/equipment', 'My Equipment', genericPage('My Equipment'));
createPage('owner/equipment/[id]', 'Equipment Details', genericPage('Equipment Details'));
createPage('owner/equipment/add', 'Add Equipment', genericPage('Add Equipment'));
createPage('owner/equipment/[id]/edit', 'Edit Equipment', genericPage('Edit Equipment'));
createPage('owner/requests', 'Booking Requests', genericPage('Booking Requests'));
createPage('owner/bookings', 'Bookings', genericPage('Manage Bookings'));
createPage('owner/drivers', 'Drivers', genericPage('Manage Drivers'));
createPage('owner/analytics', 'Analytics', genericPage('Analytics'));
createPage('owner/wallet', 'Wallet', genericPage('My Wallet'));
createPage('owner/messages', 'Messages', genericPage('Messages'));
createPage('owner/notifications', 'Notifications', genericPage('Notifications'));
createPage('owner/profile', 'Profile', genericPage('Owner Profile'));
createPage('owner/settings', 'Settings', genericPage('Settings'));

// Driver Pages
createPage('driver', 'Dashboard', genericPage('Driver Dashboard'));
createPage('driver/jobs', 'Assigned Jobs', genericPage('Assigned Jobs'));
createPage('driver/jobs/[id]', 'Job Details', genericPage('Job Details'));
createPage('driver/income', 'Income', genericPage('My Income'));
createPage('driver/history', 'History', genericPage('Job History'));
createPage('driver/ratings', 'Ratings', genericPage('My Ratings'));
createPage('driver/messages', 'Messages', genericPage('Messages'));
createPage('driver/notifications', 'Notifications', genericPage('Notifications'));
createPage('driver/profile', 'Profile', genericPage('Driver Profile'));

// Admin Pages
createPage('admin', 'Dashboard', genericPage('Admin Dashboard'));
createPage('admin/users', 'Users', genericPage('Manage Users'));
createPage('admin/owners', 'Owners', genericPage('Manage Owners'));
createPage('admin/drivers', 'Drivers', genericPage('Manage Drivers'));
createPage('admin/equipment', 'Equipment', genericPage('Manage Equipment'));
createPage('admin/bookings', 'Bookings', genericPage('Manage Bookings'));
createPage('admin/payments', 'Payments', genericPage('Manage Payments'));
createPage('admin/categories', 'Categories', genericPage('Manage Categories'));
createPage('admin/cities', 'Cities', genericPage('Manage Cities'));
createPage('admin/reports', 'Reports', genericPage('Reports'));
createPage('admin/analytics', 'Analytics', genericPage('Platform Analytics'));
createPage('admin/settings', 'Settings', genericPage('Platform Settings'));

console.log('Pages generated successfully!');
