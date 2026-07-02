# Frontend Routes Documentation

## SECTION 1: Project Overview

- **Framework**: Next.js (App Router) with React.
- **Folder structure**: Feature-driven nested directory structure under `frontend/src/app`. Separate `frontend/src/components` for reusable UI and layouts.
- **Routing structure**: File-based routing using Next.js `page.jsx` conventions.
- **Layout hierarchy**: Root layout (`app/layout.jsx`) wraps the whole app. Role-based layouts exist for `/admin`, `/developer`, `/driver`, `/owner`, and `/user`.
- **Shared layouts**: Role-specific sidebars (e.g., `AdminSidebar.jsx`, `DeveloperSidebar.jsx`) act as shared navigation in nested route groups.
- **Middleware**: Expected to handle authentication, role-based access control (RBAC), and protected route redirection (e.g., redirecting unauthenticated users to `/auth/login`).
- **Route groups**: Logically grouped by roles (e.g., `/admin`, `/owner`, `/driver`, `/user`, `/developer`).
- **Dynamic routes**: Uses `[id]` parameters for specific entity views (e.g., `/equipment/[id]`, `/user/bookings/[id]`, `/driver/jobs/[id]`).
- **Protected routes**: All paths under `/admin`, `/owner`, `/driver`, `/user`, and `/developer` require specific authentication and authorization levels.

---

## SECTION 2: Complete Route List

| URL | Role | Page Name | Purpose | Parent Layout | Navigation Source |
|---|---|---|---|---|---|
| `/` | General | Landing Page | Home page & primary entry | Root Layout | Top Navbar |
| `/about` | General | About Us | Company info | Root Layout | Footer |
| `/auth/login` | General | Login | User authentication | Root Layout | Top Navbar |
| `/auth/register` | General | Register | New user signup | Root Layout | Login Page |
| `/auth/forgot-password` | General | Forgot Password | Password recovery | Root Layout | Login Page |
| `/auth/otp` | General | OTP Verification | 2FA / Phone verification | Root Layout | Login Flow |
| `/auth/passkey` | General | Passkey Login | Passwordless login | Root Layout | Login Flow |
| `/auth/pin` | General | PIN Login | Quick access login | Root Layout | Login Flow |
| `/auth/role` | General | Role Selection | Choose user role on signup | Root Layout | Registration Flow |
| `/auth/splash` | General | Splash Screen | Initial loading/routing | Root Layout | App Init |
| `/categories` | General | Categories | Browse equipment categories | Root Layout | Top Navbar |
| `/contact` | General | Contact Us | Support and inquiries | Root Layout | Footer |
| `/equipment` | General | Equipment Listing | Browse & search equipment | Root Layout | Top Navbar |
| `/equipment/[id]` | General | Equipment Details | View specific equipment | Root Layout | Equipment Listing |
| `/faq` | General | FAQ | Frequently asked questions | Root Layout | Footer |
| `/privacy` | General | Privacy Policy | Legal documentation | Root Layout | Footer |
| `/search` | General | Search Results | Advanced search & filters | Root Layout | Search Bar |
| `/terms` | General | Terms of Service | Legal documentation | Root Layout | Footer |
| `/wishlist` | General | Global Wishlist | View saved items | Root Layout | Top Navbar |

**Admin Routes**
| URL | Role | Page Name | Purpose | Parent Layout | Navigation Source |
|---|---|---|---|---|---|
| `/admin` | Admin | Admin Dashboard | High-level metrics | Admin Layout | Sidebar |
| `/admin/analytics` | Admin | Analytics | Platform statistics | Admin Layout | Sidebar |
| `/admin/bookings` | Admin | All Bookings | Manage platform bookings | Admin Layout | Sidebar |
| `/admin/categories` | Admin | Manage Categories | CRUD for categories | Admin Layout | Sidebar |
| `/admin/cities` | Admin | Manage Cities | Service area management | Admin Layout | Sidebar |
| `/admin/drivers` | Admin | All Drivers | Manage driver accounts | Admin Layout | Sidebar |
| `/admin/equipment` | Admin | All Equipment | Manage listed equipment | Admin Layout | Sidebar |
| `/admin/owners` | Admin | All Owners | Manage equipment owners | Admin Layout | Sidebar |
| `/admin/payments` | Admin | Payments | Monitor transactions | Admin Layout | Sidebar |
| `/admin/payments/allocate` | Admin | Allocate Payments | Distribute funds | Admin Layout | Payments |
| `/admin/payments/stats` | Admin | Payment Stats | Financial analytics | Admin Layout | Payments |
| `/admin/pricing` | Admin | Pricing Rules | Global fee configuration | Admin Layout | Sidebar |
| `/admin/reports` | Admin | Reports | Downloadable data exports | Admin Layout | Sidebar |
| `/admin/roles` | Admin | Role Management | RBAC configuration | Admin Layout | Settings |
| `/admin/settings` | Admin | Global Settings | Platform configuration | Admin Layout | Sidebar |
| `/admin/tracking` | Admin | Live Tracking | Map view of active rentals | Admin Layout | Sidebar |
| `/admin/users` | Admin | All Users | Manage user accounts | Admin Layout | Sidebar |

**Developer Routes**
| URL | Role | Page Name | Purpose | Parent Layout | Navigation Source |
|---|---|---|---|---|---|
| `/developer` | Developer | Dev Dashboard | System overview | Dev Layout | Sidebar |
| `/developer/ai` | Developer | AI Config | Configure AI prompts | Dev Layout | Sidebar |
| `/developer/analytics` | Developer | Tech Analytics | Error & performance stats | Dev Layout | Sidebar |
| `/developer/api-explorer` | Developer | API Explorer | Test internal APIs | Dev Layout | Sidebar |
| `/developer/api-keys` | Developer | API Keys | Manage integration keys | Dev Layout | Sidebar |
| `/developer/audit` | Developer | Audit Logs | System security logs | Dev Layout | Sidebar |
| `/developer/backups` | Developer | Database Backups | Manage DB snapshots | Dev Layout | Sidebar |
| `/developer/database` | Developer | Database Tools | Run SQL queries safely | Dev Layout | Sidebar |
| `/developer/deployment` | Developer | Deployment Info | CI/CD statuses | Dev Layout | Sidebar |
| `/developer/environment` | Developer | Env Variables | View/Manage secrets | Dev Layout | Sidebar |
| `/developer/features` | Developer | Feature Flags | Toggle application features | Dev Layout | Sidebar |
| `/developer/git` | Developer | Version Control | Current branch/commit | Dev Layout | Sidebar |
| `/developer/health` | Developer | System Health | Uptime & latency checks | Dev Layout | Sidebar |
| `/developer/logs` | Developer | Server Logs | Live application logs | Dev Layout | Sidebar |
| `/developer/maintenance` | Developer | Maintenance Mode | Toggle platform downtime | Dev Layout | Sidebar |
| `/developer/monitoring` | Developer | Monitoring | Prometheus/Grafana views | Dev Layout | Sidebar |
| `/developer/notifications` | Developer | Notification System | Debug email/SMS sending | Dev Layout | Sidebar |
| `/developer/overview` | Developer | Infrastructure | Cloud resources view | Dev Layout | Sidebar |
| `/developer/queue` | Developer | Job Queue | Redis/Celery worker status | Dev Layout | Sidebar |
| `/developer/redis` | Developer | Cache Explorer | Browse Redis keys | Dev Layout | Sidebar |
| `/developer/security` | Developer | Security Hub | Firewall & WAF rules | Dev Layout | Sidebar |
| `/developer/services` | Developer | Microservices | External service health | Dev Layout | Sidebar |
| `/developer/simulator` | Developer | Simulator | Impersonate users/events | Dev Layout | Sidebar |
| `/developer/storage` | Developer | S3/Storage | File upload management | Dev Layout | Sidebar |
| `/developer/system` | Developer | System Config | Low-level settings | Dev Layout | Sidebar |
| `/developer/terminal` | Developer | Web Terminal | Direct server CLI access | Dev Layout | Sidebar |
| `/developer/webhooks` | Developer | Webhooks | Outbound event config | Dev Layout | Sidebar |

**Driver Routes**
| URL | Role | Page Name | Purpose | Parent Layout | Navigation Source |
|---|---|---|---|---|---|
| `/driver` | Driver | Driver Dashboard | Upcoming jobs & summary | Driver Layout | Sidebar |
| `/driver/history` | Driver | Job History | Past completed jobs | Driver Layout | Sidebar |
| `/driver/income` | Driver | Earnings | Payouts and balances | Driver Layout | Sidebar |
| `/driver/jobs` | Driver | Available Jobs | Browse equipment requests | Driver Layout | Sidebar |
| `/driver/jobs/[id]` | Driver | Job Details | Specific job instructions | Driver Layout | Jobs List |
| `/driver/messages` | Driver | Messages | Chat with owners/renters | Driver Layout | Sidebar |
| `/driver/notifications` | Driver | Notifications | System alerts | Driver Layout | Top Navbar |
| `/driver/profile` | Driver | Driver Profile | KYC & personal info | Driver Layout | Sidebar |
| `/driver/ratings` | Driver | Reviews & Ratings | Feedback from owners | Driver Layout | Sidebar |

**Owner Routes**
| URL | Role | Page Name | Purpose | Parent Layout | Navigation Source |
|---|---|---|---|---|---|
| `/owner` | Owner | Owner Dashboard | Fleet & revenue overview | Owner Layout | Sidebar |
| `/owner/analytics` | Owner | Revenue Analytics | Equipment ROI metrics | Owner Layout | Sidebar |
| `/owner/bookings` | Owner | Bookings | Manage rentals | Owner Layout | Sidebar |
| `/owner/drivers` | Owner | My Drivers | Manage assigned drivers | Owner Layout | Sidebar |
| `/owner/equipment` | Owner | My Fleet | List of owned machinery | Owner Layout | Sidebar |
| `/owner/equipment/add` | Owner | Add Equipment | List a new machine | Owner Layout | Fleet |
| `/owner/equipment/[id]` | Owner | Equipment Details | View specific machine stats | Owner Layout | Fleet |
| `/owner/equipment/[id]/edit` | Owner | Edit Equipment | Update machine info/pricing| Owner Layout | Equipment Details |
| `/owner/messages` | Owner | Messages | Chat with renters | Owner Layout | Sidebar |
| `/owner/notifications` | Owner | Notifications | Booking/payment alerts | Owner Layout | Top Navbar |
| `/owner/profile` | Owner | Owner Profile | Business KYC | Owner Layout | Sidebar |
| `/owner/requests` | Owner | Rental Requests | Approve/Reject bookings | Owner Layout | Sidebar |
| `/owner/settings` | Owner | Account Settings | Preferences & security | Owner Layout | Sidebar |
| `/owner/wallet` | Owner | Wallet | Earnings & withdrawals | Owner Layout | Sidebar |

**User / Renter Routes**
| URL | Role | Page Name | Purpose | Parent Layout | Navigation Source |
|---|---|---|---|---|---|
| `/user` | User | User Dashboard | Overview of activities | User Layout | Sidebar |
| `/user/bookings` | User | My Bookings | Active & past rentals | User Layout | Sidebar |
| `/user/bookings/[id]` | User | Booking Details | Specific rental overview | User Layout | Bookings |
| `/user/bookings/[id]/track`| User | Track Delivery | Live map for equipment | User Layout | Booking Details |
| `/user/categories` | User | Browse Categories | View machines by type | User Layout | Sidebar |
| `/user/chat` | User | Messages | Chat with owners/drivers | User Layout | Sidebar |
| `/user/help` | User | Help & Support | Contact support tickets | User Layout | Sidebar |
| `/user/nearby` | User | Map Search | Find machinery near me | User Layout | Sidebar |
| `/user/notifications` | User | Notifications | Status updates | User Layout | Top Navbar |
| `/user/profile` | User | Profile | Personal details & KYC | User Layout | Sidebar |
| `/user/search` | User | Advanced Search | Filtered rental search | User Layout | Sidebar |
| `/user/settings` | User | Settings | Passwords & preferences | User Layout | Sidebar |
| `/user/wishlist` | User | Saved Items | Shortlisted equipment | User Layout | Sidebar |

---

## SECTION 3: Roles

### 1. User (Renter)
- **Dashboard**: `/user` (Overview of active rentals, upcoming deliveries, recent searches).
- **Navigation**: Sidebar with Links to Bookings, Chat, Nearby Map, Wishlist, Settings.
- **Permissions**: Browse equipment, place booking requests, initiate chat, track active rentals, manage personal profile.
- **Pages**: `/user/*`, `/equipment`, `/search`.
- **Possible CRUD operations**: Create bookings, Read equipment listings, Update profile, Delete (cancel) bookings, Add to wishlist.

### 2. Owner (Equipment Provider)
- **Dashboard**: `/owner` (Fleet utilization, pending requests, recent earnings).
- **Navigation**: Sidebar with Fleet, Bookings, Wallet, Requests, Analytics.
- **Permissions**: Add/Edit/Remove equipment, Approve/Reject bookings, Withdraw funds, Assign drivers.
- **Pages**: `/owner/*`.
- **Possible CRUD operations**: Create equipment listings, Read bookings, Update equipment status/price, Delete equipment, Approve/Reject requests.

### 3. Driver (Operator)
- **Dashboard**: `/driver` (Active job, today's schedule, quick income view).
- **Navigation**: Sidebar with Jobs, History, Income, Ratings, Profile.
- **Permissions**: Accept/Reject assigned jobs, update job status (En Route, Operating, Completed), receive ratings.
- **Pages**: `/driver/*`.
- **Possible CRUD operations**: Read available jobs, Update job status, Read earnings, Update profile/KYC documents.

### 4. Admin (Platform Manager)
- **Dashboard**: `/admin` (Platform-wide GMV, active users, pending verifications, global map).
- **Navigation**: Sidebar with Users, Equipment, Bookings, Payments, Settings, Tracking.
- **Permissions**: Full read/write access to user data, override bookings, issue refunds, approve KYC, suspend accounts.
- **Pages**: `/admin/*`.
- **Possible CRUD operations**: Create categories/cities, Read any user/booking, Update pricing models, Delete/Suspend fraudulent accounts.

### 5. Developer (System Operator)
- **Dashboard**: `/developer` (Server health, API traffic, error rates).
- **Navigation**: Sidebar with Database, Logs, Environment, Redis, Webhooks, Terminal.
- **Permissions**: Execute raw queries, clear cache, view system logs, manage environment variables, toggle maintenance mode.
- **Pages**: `/developer/*`.
- **Possible CRUD operations**: Create backups/webhooks, Read logs/database, Update environment/feature flags, Delete cache keys.

---

## SECTION 12: Navigation Flow

### User Journey 1: Registration to First Booking
`Landing Page` → `Click Sign Up` → `/auth/register` → `Input Details` → `/auth/role (Select User)` → `/auth/otp (Verify Phone)` → `/user (Dashboard)` → `Search Bar` → `/search` → `Click Equipment` → `/equipment/[id]` → `Select Dates & Request` → `/booking_checkout_secure_payment` → `Pay Deposit` → `/user/bookings`

### User Journey 2: Owner Listing Equipment
`Login` → `/auth/role (Select Owner)` → `/owner` → `Click 'Add Equipment'` → `/owner/equipment/add` → `Upload Photos & Details` → `Submit` → `/owner/equipment` (Status: Pending Approval)

### User Journey 3: Driver Job Acceptance
`Login` → `/driver` → `Click Available Jobs` → `/driver/jobs` → `View Details` → `/driver/jobs/[id]` → `Click Accept` → `/driver/history` (Moved to active)

### User Journey 4: Tracking an Active Rental
`/user/bookings` → `Select Active Booking` → `/user/bookings/[id]` → `Click 'Track Delivery'` → `/user/bookings/[id]/track` (Live Map)

### User Journey 5: Admin Dispute Resolution
`/admin` → `Search Booking ID` → `/admin/bookings` → `View Details` → `/admin/payments` → `Issue Refund` → `/admin/users` → `Send Warning Notification`
