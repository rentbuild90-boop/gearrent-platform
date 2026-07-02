# Frontend Data Models & State Documentation

## SECTION 9: Data Models (Inferred)

Based on UI fields, props in cards (e.g., `EquipmentCard`, `BookingCard`, `UserCard`), and form inputs, the following data entities exist:

### `User`
Properties: `id`, `name`, `email`, `phone`, `role` (User, Owner, Driver, Admin, Dev), `avatarUrl`, `isVerified`, `createdAt`, `address`, `preferences` (sms, email).

### `Equipment`
Properties: `id`, `ownerId`, `title`, `description`, `categoryId`, `pricePerDay`, `pricePerHour`, `images` (array), `status` (Available, Rented, Maintenance), `city`, `location` (lat, lng), `specs` (JSON/Text), `rating`, `reviewCount`, `createdAt`.

### `Booking`
Properties: `id`, `renterId`, `equipmentId`, `ownerId`, `driverId` (nullable), `startDate`, `endDate`, `totalAmount`, `status` (Pending, Approved, Active, Completed, Cancelled), `paymentStatus` (Pending, Paid, Refunded), `deliveryLocation`, `createdAt`.

### `Driver`
Properties: `id` (references User), `ownerId` (if fleet driver), `licenseNumber`, `experienceYears`, `status` (Available, On-Job, Offline), `currentLocation`, `rating`.

### `Wallet`
Properties: `id`, `userId`, `balance`, `currency`, `lastUpdated`.

### `Payment / Transaction`
Properties: `id`, `walletId`, `bookingId`, `amount`, `type` (Credit, Debit, Withdrawal), `status` (Pending, Success, Failed), `method` (Card, NetBanking, Transfer), `timestamp`.

### `Review`
Properties: `id`, `bookingId`, `reviewerId`, `targetId` (Equipment or Driver), `rating` (1-5), `comment`, `createdAt`.

### `Category`
Properties: `id`, `name`, `description`, `iconUrl`, `baseCommissionRate`, `isActive`.

### `Notification`
Properties: `id`, `userId`, `title`, `message`, `type` (Booking, Payment, System), `isRead`, `createdAt`, `actionUrl`.

---

## SECTION 10: Mock Data

Based on the structure, components like `MockChart.jsx` and `MockMapCard.jsx` rely on hardcoded JSON structures for testing.

- **File**: `MockChart.jsx`
  - **Object Name**: `revenueData`
  - **Fields**: `month`, `revenue`, `expenses`
- **File**: `DataTable.jsx` (Assumed mock props)
  - **Object Name**: `mockUsers`, `mockBookings`
  - **Relationships**: Contains raw IDs mapping users to bookings for frontend display.
- **File**: Component Default Props
  - **Object Name**: `equipmentList`
  - **Fields**: `id`, `title`, `price`, `status`, `imageUrl`.

---

## SECTION 11: State Management

Based on standard Next.js and React patterns found in the components:

- **`useState`**: Used extensively in forms (`email`, `password`, `showPassword`), Modals (open/close state), Drawers (toggle state), and custom inputs (date pickers, sliders).
- **`Context` / `Zustand` / `Redux`**: Likely used for Global State.
  - **Auth State**: Stores `currentUser`, `jwtToken`, `userRole`.
  - **Theme State**: Handled by `ThemeProvider.jsx` (Dark/Light mode).
  - **UI State**: GlobalModal and GlobalDrawer visibility, Notification counters.
- **`React Query` / `SWR`**: Expected for API data fetching.
  - **Caches**: `equipmentList`, `userBookings`, `walletBalance`. Handles loading (`skeleton.jsx`) and error states gracefully.

---

## SECTION 19: Status Values

**Booking Status**
- `PENDING`: Waiting for owner approval.
- `APPROVED`: Accepted, awaiting payment/start.
- `ACTIVE`: Currently rented / machinery in use.
- `COMPLETED`: Returned and finalized.
- `CANCELLED`: Aborted by user or owner.
- `DISPUTED`: Issue raised to admin.

**Equipment Status**
- `AVAILABLE`: Ready to be booked.
- `RENTED`: Currently occupied.
- `MAINTENANCE`: Down for repairs.
- `PENDING_APPROVAL`: Newly added, waiting for admin check.
- `ARCHIVED`: Soft deleted by owner.

**Driver Status**
- `AVAILABLE`: Ready for a job.
- `ON_JOB`: Currently operating machinery.
- `OFFLINE`: Not working / End of shift.

**Payment Status**
- `PENDING`: Initiated but not cleared.
- `SUCCESS / PAID`: Funds secured.
- `FAILED`: Transaction error.
- `REFUNDED`: Money returned to renter.

**Wallet Status**
- `ACTIVE`: Standard operational state.
- `FROZEN`: Locked by admin due to dispute/fraud.

**Verification Status (KYC)**
- `UNVERIFIED`: Missing documents.
- `PENDING`: Documents uploaded, under review.
- `VERIFIED`: Approved.
- `REJECTED`: Documents invalid.

---

## SECTION 23: Entity Candidates (Database Tables)

1. `users`: Core identity table.
2. `user_roles`: RBAC linking users to permissions.
3. `equipment`: The core marketplace item.
4. `categories`: Lookup table for equipment types.
5. `bookings`: Transactional core for rentals.
6. `drivers`: Profile extension for operator details.
7. `wallets`: Financial ledger per user.
8. `transactions`: Immutable record of money movement.
9. `reviews`: User-generated feedback.
10. `documents`: Storage pointers for KYC/RC uploads.
11. `locations`: Geo-spatial data for tracking/cities.
12. `messages`: Chat logs between users.
13. `notifications`: System alerts.
14. `system_logs`: Developer audit trails.

---

## SECTION 24: Potential Foreign Keys

- `equipment.owner_id` → `users.id` (One-to-Many)
- `equipment.category_id` → `categories.id` (One-to-Many)
- `bookings.renter_id` → `users.id` (One-to-Many)
- `bookings.equipment_id` → `equipment.id` (One-to-Many)
- `bookings.owner_id` → `users.id` (One-to-Many)
- `bookings.driver_id` → `drivers.id` (One-to-Many, Optional)
- `drivers.user_id` → `users.id` (One-to-One)
- `wallets.user_id` → `users.id` (One-to-One)
- `transactions.wallet_id` → `wallets.id` (One-to-Many)
- `transactions.booking_id` → `bookings.id` (One-to-Many, Optional)
- `reviews.booking_id` → `bookings.id` (One-to-One or One-to-Many)
- `reviews.reviewer_id` → `users.id` (One-to-Many)
- `documents.user_id` → `users.id` (One-to-Many)
- `messages.sender_id` → `users.id` (One-to-Many)
- `messages.booking_id` → `bookings.id` (One-to-Many)

---

## SECTION 25: Potential Indexes

To optimize the required UI queries, the following indexes are highly recommended:

- **`users` table**: `phone` (Unique), `email` (Unique).
- **`equipment` table**: `owner_id` (Lookup fleet), `status` (Filter available), `category_id` (Filter), `city`/`location` (Geo-spatial index for Map Search).
- **`bookings` table**: `renter_id` (User dashboard), `owner_id` (Owner dashboard), `status` (Active tracking), `created_at` (Sorting).
- **`transactions` table**: `wallet_id` (Ledger calculation), `created_at` (Timeline).
- **`drivers` table**: `status`, `current_location` (Geo-spatial).
