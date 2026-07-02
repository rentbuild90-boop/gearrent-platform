# Frontend Components & UI Documentation

## SECTION 4: Forms

**Auth Forms (`/auth/register`, `/auth/login`, `/auth/forgot-password`)**
- Field: Phone Number (Type: `tel`, Required: Yes)
- Field: Email Address (Type: `email`, Required: Optional on login, Yes on register)
- Field: Password (Type: `password`/`text` toggle, Required: Yes)
- Field: Full Name (Type: `text`, Required: Yes)
- Field: City/Location (Type: `text`, Required: Yes)
- Field: Bio/About (Type: `textarea`, Optional: Yes)
- Field: Role Selection (Type: `select`, Dropdown: User, Owner, Driver)
- Field: OTP Code (Type: `text`, Required: Yes, Validation: 6 digits)

**User Profile Form (`/user/profile`, `/user/settings`)**
- Field: Avatar Upload (Type: `file`, Optional)
- Field: Full Name (Type: `text`, Required: Yes)
- Field: Email (Type: `email`, Required: Yes)
- Field: Phone (Type: `tel`, Required: Yes)
- Field: Address (Type: `textarea`, Required: Yes)
- Field: SMS Notifications (Type: `checkbox`)
- Field: Email Promos (Type: `checkbox`)
- Field: Current Password (Type: `password`, Required: for change)
- Field: New Password (Type: `password`)

**Admin Category / City Forms (`/admin/categories`, `/admin/pricing`)**
- Field: Category Name (Type: `text`, Required: Yes)
- Field: Description (Type: `textarea`, Optional: Yes)
- Field: Base Price (Type: `number`, Required: Yes)
- Field: Commission Rate (Type: `number`, Required: Yes)
- Field: Pricing Model (Type: `select`, Dropdown: Hourly, Daily, Distance)
- Field: Active Status (Type: `checkbox`)

**Developer Config Forms (`/developer/api-keys`, `/developer/environment`)**
- Field: Key Name (Type: `text`, Required: Yes)
- Field: Key Value (Type: `password`, Required: Yes)
- Field: Environment Variables (Type: `textarea`, Required: Yes, Format: JSON/Key-Value)
- Field: Search Logs (Type: `text`, Search bar)

**Owner Wallet Form (`/owner/wallet`)**
- Field: Withdrawal Amount (Type: `number`, Required: Yes, Validation: > 0)
- Field: Bank Account (Type: `select`, Dropdown: Saved Accounts)

**Checkout Form (`/booking_checkout_secure_payment`)**
- Field: Start Date (Type: `datetime-local`, Required: Yes)
- Field: End Date (Type: `datetime-local`, Required: Yes)
- Field: Promo Code (Type: `text`, Optional)
- Field: Payment Method (Type: `radio`, Options: Card, Wallet, NetBanking)

---

## SECTION 5: Modals

1. **AddEquipmentModal** (`components/Modals/AddEquipmentModal.jsx`)
   - **Purpose**: Quick upload of new machinery by owners.
   - **Fields**: Name, Category, Price/Day, Photos, Specs.
   - **Buttons**: 'Save as Draft', 'Publish'.
   - **Trigger**: "Add Equipment" button on Owner Dashboard.

2. **AssignDriverModal** (`components/Modals/AssignDriverModal.jsx`)
   - **Purpose**: Assign a specific driver to an accepted booking.
   - **Fields**: Driver Dropdown, Instructions Textarea.
   - **Buttons**: 'Assign', 'Cancel'.
   - **Trigger**: "Assign Driver" button on Booking Details (Owner view).

3. **GlobalModal** (`components/GlobalModal.jsx`)
   - **Purpose**: Reusable wrapper for alerts, warnings, and unhandled flows.
   - **Buttons**: Dynamic (Confirm/Close).
   - **Trigger**: System-wide state (Zustand).

---

## SECTION 6: Dialogs (Inferred via `ui/dialog.jsx`)

- **Confirmation Dialogs**: Used when marking a job as "Completed", or accepting a booking.
- **Delete Dialogs**: Used when archiving equipment, deleting a user account, or removing a bank account. ("Are you sure you want to delete X? This action is irreversible.")
- **Approval Dialogs**: Admin approving KYC documents.
- **Reject Dialogs**: Owner rejecting a rental request (requires reasoning text input).
- **Warning Dialogs**: Withdrawing funds below minimum balance, or navigating away with unsaved form data.

---

## SECTION 7: Drawers

1. **FilterDrawer** (`components/Drawers/FilterDrawer.jsx`)
   - **Purpose**: Mobile-friendly slide-out for advanced search filtering.
2. **NotificationDrawer** (`components/Drawers/NotificationDrawer.jsx`)
   - **Purpose**: Displays recent alerts, messages, and system updates.
3. **GlobalDrawer** (`components/GlobalDrawer.jsx`)
   - **Purpose**: Generic slide-out for mobile navigation or context-heavy side panels (like quick chat).

---

## SECTION 8: Components

**Reusable UI Components (`src/components/ui/`)**
- `avatar.jsx`: User profile pictures with fallback initials.
- `badge.jsx`: Status indicators (Pending, Active, Completed).
- `button.jsx`: Standardized buttons (Variants: Primary, Secondary, Destructive, Ghost, Outline).
- `card.jsx`: Content containers for dashboards.
- `carousel.jsx`: Image slider for equipment photos.
- `dialog.jsx`: Alert dialogs.
- `drawer.jsx`: Slide-out panels.
- `dropdown-menu.jsx`: Context menus (e.g., 3-dots action menu).
- `input.jsx`: Standard text fields with focus states.
- `navigation-menu.jsx`: Top navbar structure.
- `scroll-area.jsx`: Custom styled scrollbars.
- `separator.jsx`: Thematic HR lines.
- `skeleton.jsx`: Loading state placeholders.
- `switch.jsx`: Toggle buttons for settings.
- `table.jsx`: Grid data presentation.
- `tabs.jsx`: Content switching (e.g., Active vs Past bookings).

**Feature Components (`src/components/`)**
- `AdminSidebar.jsx` / `DeveloperSidebar.jsx`
- `BookingCard.jsx`: Displays rental timeframe, cost, and status.
- `DriverCard.jsx`: Displays driver rating, status, and contact.
- `EquipmentCard.jsx`: Thumbnail, price, name, location.
- `OwnerCard.jsx`: Owner details, total fleet size.
- `ReviewCard.jsx`: Star rating, text, date, reviewer name.
- `StatsCard.jsx`: Dashboard widget (Title, Value, % Change).
- `MockChart.jsx`: Visual representation of revenue/usage.
- `MockMapCard.jsx`: Static map preview for location.
- `NotificationCard.jsx`: Alert item with read/unread state.

---

## SECTION 13: Dashboard Widgets

**Admin Dashboard**
- Cards: Total GMV, Active Users, Pending KYC, Active Rentals.
- Charts: Monthly Revenue Bar Chart (`MockChart.jsx`).
- Tables: Recent Transactions, Flagged Users (`DataTable.jsx`).

**Owner Dashboard**
- Cards: Available Fleet, Rented Fleet, Monthly Earnings, Unread Messages.
- Statistics: Utilization Rate (%).
- Quick Actions: Add Equipment, Withdraw Funds.

**User Dashboard**
- Cards: Active Rentals, Saved Equipment.
- Timeline: Delivery Tracking / Job Status.

**Developer Dashboard**
- Cards: CPU Load, Memory Usage, Active DB Connections, Redis Hit Rate.
- Tables: Recent 500 Errors.

---

## SECTION 14: Search

- **Equipment**: Main search bar on Landing & `/user/nearby` (Searches Name, Category, Location).
- **Bookings**: Admin and Owner booking list (Searches Booking ID, User Name).
- **Drivers**: Owner dashboard (Searches Driver Name, Phone).
- **Logs**: Developer `/developer/logs` (Searches trace ID, error message).
- **Vehicles/Fleet**: Admin and Owner views.
- **Messages**: User/Driver/Owner Chat (Searches contact name).
- **Files/Storage**: Developer `/developer/storage` (Searches filename).

---

## SECTION 15: Filters

- **City/Location**: Radius slider, predefined areas.
- **Price**: Min/Max range slider (`<input type="range">`).
- **Category**: Checkboxes for 'Excavators', 'Cranes', 'Tractors', etc.
- **Status**: Dropdown for (Available, Rented, Maintenance).
- **Booking Date**: Date range picker.
- **Owner**: Admin view to filter by specific owner ID.

---

## SECTION 16: Tables

**Using `DataTable.jsx` and `table.jsx`**
- **Columns**: Dynamic based on data (e.g., ID, Date, Name, Amount, Status, Actions).
- **Sorting**: Clickable headers (Asc/Desc) for Date, Price, Rating.
- **Filtering**: Integrated search input per column or global search above the table.
- **Pagination**: Next/Prev buttons, Rows per page select (10, 20, 50).
- **Bulk Actions**: Checkboxes on left column to "Approve Selected", "Export CSV".
- **Export**: Buttons to download CSV/PDF (found in Admin Analytics/Reports).

---

## SECTION 17: File Uploads

- **Images**: Equipment photos (Carousel), User Avatars.
- **Documents**: 
  - Driver License (KYC)
  - Owner PAN Card / Tax ID
  - Aadhaar / National ID
  - Vehicle RC (Registration Certificate)
  - Insurance Documents
- **Invoices**: PDF uploads for custom enterprise quotes.

---

## SECTION 18: Notifications

- **Booking**: "New request received", "Booking accepted", "Booking cancelled".
- **Payment**: "Deposit successful", "Withdrawal processed", "Refund issued".
- **Approval**: "KYC Verified", "Equipment Approved".
- **Wallet**: "Low balance", "Funds received".
- **Message**: "New message from [User]".
- **Warning**: "Job delay reported", "Driver reassigned".
- **System**: "Scheduled maintenance at midnight".

---

## SECTION 20: Actions (Buttons)

- **Approve**: Accept bookings, approve KYC, approve equipment listings.
- **Reject**: Decline bookings (requires reason), reject KYC.
- **Cancel**: End booking early or withdraw request before acceptance.
- **Assign Driver**: Connect an operator to a machine for a specific job.
- **Withdraw**: Transfer wallet funds to bank account.
- **Pay**: Complete checkout, add wallet funds.
- **Track**: Open live map view.
- **Book**: Initiate a rental request.
- **Review**: Submit a rating/comment after completion.
- **Upload**: Select files from device.
- **Delete / Archive**: Remove or hide equipment/accounts.
- **Duplicate**: Clone an equipment listing (Admin/Owner).
