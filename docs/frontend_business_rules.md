# Frontend Business Rules & Backend Requirements

## SECTION 21: Business Rules (Inferred from UI Flows)

1. **User / Profile Relationships**:
   - A single account (`User`) can have different operational contexts, but the frontend strictly silos views via roles (`/user`, `/owner`, `/driver`, `/admin`).
   - Phone numbers and Emails must be unique across the platform.

2. **Equipment & Ownership**:
   - An Owner can own multiple pieces of Equipment (One-to-Many).
   - Equipment belongs to exactly one Owner.
   - Equipment cannot be deleted if there is an active or upcoming Booking. It must be marked as "Archived" or "Maintenance".

3. **Bookings & Rentals**:
   - A Booking has one Renter (User) and targets one piece of Equipment.
   - Booking dates cannot overlap for the same Equipment (unless quantity > 1, but UI implies unique equipment tracking).
   - A Booking requires Owner approval unless "Instant Book" is inferred. (UI has "Requests" tab for Owners, implying approval is required).
   - A Booking can optionally include a Driver.

4. **Drivers & Jobs**:
   - Owners assign Drivers to Bookings, OR Drivers pick up broadcasted jobs (UI has `/driver/jobs` suggesting a job board, and `/owner/drivers` suggesting fleet-assigned drivers).
   - A Driver can only be on one Active Job at a time.
   - Driver receives a rating specifically tied to a completed Booking.

5. **Financial & Wallet**:
   - Bookings lock funds or require deposits.
   - Payments flow into the platform, taking a commission, and outputting to the Owner's Wallet.
   - Wallets allow withdrawal to external bank accounts.
   - Admin allocates payouts manually or automatically (`/admin/payments/allocate`).

---

## SECTION 22: Future Backend Requirements (API Surface)

**Authentication (`/auth/*`)**
- `POST /api/auth/register`: Create user, send OTP.
- `POST /api/auth/login`: Validate credentials, return JWT.
- `POST /api/auth/otp/verify`: Validate SMS/Email token.

**Equipment / Search (`/equipment`, `/search`)**
- `GET /api/equipment`: List equipment (Query params: lat, lng, radius, category, minPrice, maxPrice).
- `GET /api/equipment/:id`: Detailed specs, reviews, calendar availability.
- `POST /api/equipment`: (Owner) Add new machinery (multipart form for images).
- `PUT /api/equipment/:id`: (Owner) Update price/status.

**Bookings (`/user/bookings`, `/owner/requests`)**
- `POST /api/bookings`: Request a rental. Payload: `equipmentId`, `startDate`, `endDate`.
- `GET /api/bookings`: List bookings for current token user (Filtered by Renter or Owner role).
- `PATCH /api/bookings/:id/status`: Owner approves/rejects, or Renter cancels.
- `GET /api/bookings/:id/track`: Return realtime lat/lng of equipment/driver.

**Payments & Wallet (`/owner/wallet`, `/booking_checkout`)**
- `POST /api/payments/checkout`: Generate payment gateway intent/session.
- `GET /api/wallet`: Fetch current balance and recent transactions.
- `POST /api/wallet/withdraw`: Request payout to bank account.

**Admin Operations (`/admin/*`)**
- `GET /api/admin/stats`: Fetch aggregate GMV, user counts.
- `GET /api/admin/users`: Paginated list of all users.
- `PATCH /api/admin/users/:id/kyc`: Approve/Reject user documents.
- `POST /api/admin/categories`: Create new platform categories.

**Developer Operations (`/developer/*`)**
- `GET /api/dev/logs`: Stream system logs.
- `GET /api/dev/health`: Return service status (DB, Redis, External APIs).
- `POST /api/dev/db/query`: Execute raw SQL (highly restricted).

---

## SECTION 26: Missing Information

**Can Infer from Frontend:**
- Overall data relationships (Owner -> Equipment -> Booking).
- Required form fields and validations.
- Role-based access hierarchy.
- Dashboard metric requirements.

**Cannot Infer from Frontend:**
- **Database Engine**: Whether PostgreSQL, MySQL, or MongoDB is intended. (Prompt says "prepare a MySQL database", so it will be relational).
- **Payment Gateway**: Whether Stripe, Razorpay, or PayPal will be integrated.
- **Real-time Engine**: Whether tracking and chat use WebSockets (Socket.io), Server-Sent Events, or third-party (Pusher/Firebase).
- **File Storage**: Where images and KYC documents are actually stored (AWS S3, Cloudinary).
- **Pricing Algorithm**: How distance-based delivery fees or dynamic pricing logic is calculated.

**Needs Backend Decision:**
- Commission structure (Fixed flat fee vs percentage per category).
- Data retention policies for GDPR/compliance.
- Rate limiting and API security measures.
- Background jobs architecture (Cron vs Queue for booking expirations).

---

## SECTION 27: Final Summary

- **Total Pages / Routes**: ~65 discrete routes mapped across 6 roles.
- **Total Components**: ~20 standard UI components, plus ~15 specialized layout/card components.
- **Total Forms**: ~12 major forms (Auth, Settings, Equipment, Checkout, Wallets).
- **Total Tables (estimated)**: ~15 (Admin users, Admin bookings, Owner fleet, Developer logs, etc.).
- **Total Entities (estimated)**: 14 primary database tables.
- **Total APIs Required**: ~40-50 RESTful endpoints to satisfy all frontend views.
- **Total CRUD Modules**: Users, Equipment, Categories, Bookings, Reviews, Payments.
- **Total Dashboards**: 5 (Admin, Developer, Owner, Driver, User).

*End of Application Analysis.*
