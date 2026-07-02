---
name: GearRent Modern Design System
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#712ae2'
  on-secondary: '#ffffff'
  secondary-container: '#8a4cfc'
  on-secondary-container: '#fffbff'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bbff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#5a00c6'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
  status-available: '#10B981'
  status-booked: '#3B82F6'
  status-pending: '#F59E0B'
  status-error: '#EF4444'
  surface-background: '#F9FAFB'
  surface-card: '#FFFFFF'
  neutral-text-main: '#111827'
  neutral-text-muted: '#6B7280'
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: '1.2'
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

# GearRent Website Redesign Guide

## 1. Purpose of this document

This document is a redesign-oriented map of the current GearRent website/application codebase.

It is meant to help with:

- understanding the current site structure
- identifying the main layouts and UI patterns
- tracing the user journeys for renters, owners, drivers, and admins
- spotting architectural and design inconsistencies before redesign work starts

This guide focuses on first-party application files. Third-party dependencies in `vendor/` and `node_modules/`, generated uploads in `public/uploads/`, and one-off diagnostic notes were reviewed for context but are not the main UX architecture.

---

## 2. High-level product summary

GearRent is a PHP-based multi-role rental platform for equipment and vehicles.

Core product areas:

- `public/`: renter-facing/mobile-style experience
- `owner/`: owner dashboard for vehicle inventory and rental management
- `driver/`: driver dashboard for assigned trips and earnings
- `admin/`: admin back-office for users, rentals, drivers, owners, and pricing
- `api/` and `public/api*`: lightweight endpoints for auth, tracking, push, and AJAX actions

Main business objects:

- users
- vehicles
- bookings
- notifications / inbox items
- help tickets and replies
- push subscriptions
- driver earnings

---

## 3. Current architecture at a glance

### 3.1 Stack

- Backend: PHP
- Database: MySQL via PDO and some legacy mysqli
- Frontend: server-rendered PHP views, Bootstrap CDN, Bootstrap Icons, Google Maps JS
- Auth: session-based auth, OTP flow, Google OAuth, Firebase/webview support
- PWA: service worker, manifest, push notification setup

### 3.2 Architectural style

This is a classic PHP monolith with mixed patterns:

- business logic, DB access, HTML, CSS, and JS often live in the same file
- role dashboards are separated by folder
- shared helpers live in `includes/`, `libs/`, and `config/`
- many pages use inline CSS instead of a shared design system
- there are two parallel auth/helper styles in use:
  - `includes/persistent_login.php` + `config/config.php`
  - `libs/auth.php` + local `pdo_connect()`

### 3.3 Important implication for redesign

The system is functionally one product, but visually and structurally it behaves like several mini-products:

- renter side feels mobile-first
- owner/admin side feels dashboard-first
- driver side is another separate dashboard theme

This means redesign should first define whether GearRent should become:

1. one unified brand and design system across all roles, or
2. a deliberately split system with separate renter app and internal dashboards

---

## 4. Folder structure and what each area does

### 4.1 Core application folders

#### `public/`

Primary renter-facing area plus a few shared/public endpoints.

Key files:

- `public/index.php`: renter homepage with map, location input, categories
- `public/equipment.php`: equipment list with filtering
- `public/equipment_details.php`: equipment detail page
- `public/book_vehicle.php`: booking form
- `public/bookings.php`: renter booking history
- `public/track_booking.php`: booking tracking map
- `public/profile.php`: renter profile hub
- `public/settings.php`: settings page
- `public/inbox.php`: inbox/notifications center
- `public/help.php`: help ticket submission and replies
- `public/login.php`: login page with email/password and Google sign-in
- `public/register.php`: multi-step OTP-based registration
- `public/registration.php`: larger alternate registration flow with role-specific fields
- `public/header.php`: fixed top header with centered logo
- `public/bottom-nav.php`: fixed bottom nav used heavily on renter pages

AJAX/API-like files in `public/`:

- `public/api_get_nearby.php`
- `public/api_get_vehicle_location.php`
- `public/api_update_location.php`
- `public/api_update_dark_mode.php`
- `public/api_send_admin_message.php`
- `public/tracking_api.php`
- `public/get_ticket_replies.php`

Push endpoints:

- `public/api/subscribe-push.php`
- `public/api/unsubscribe-push.php`
- `public/api/send-push.php`
- `public/api/test-push.php`

#### `owner/`

Owner dashboard and inventory/rental operations.

Key files:

- `owner/dashboard.php`: owner KPI dashboard
- `owner/add_vehicle.php`: create vehicle listing, assign driver, upload media, set location
- `owner/my_vehicles.php`: inventory management
- `owner/edit_vehicle.php`: edit vehicle
- `owner/rental_history.php`: owner rental list/history
- `owner/rental_details.php`: booking detail view
- `owner/set_driver_earnings.php`: owner sets driver earnings
- `owner/profile.php`, `owner/edit_profile.php`, `owner/settings.php`
- `owner/sidebar.php`, `owner/bottom-nav.php`

#### `driver/`

Driver dashboard and trip operations.

Key files:

- `driver/dashboard.php`: summary dashboard
- `driver/my_trips.php`: trip list with filters
- `driver/get_trip_details.php`: trip detail AJAX/data endpoint
- `driver/update_trip_status.php`: update trip workflow/status
- `driver/my_earnings.php`: earnings summary
- `driver/help_support.php`: support area
- `driver/profile.php`, `driver/edit-profile.php`
- `driver/sidebar.php`, `driver/bottom-nav.php`

#### `admin/`

Admin management area.

Key files:

- `admin/dashboard.php`: platform overview dashboard
- `admin/manage_users.php`: manage users
- `admin/manage_owners.php`: manage owners
- `admin/manage_drivers.php`: manage drivers
- `admin/manage_rentals.php`: manage bookings/rentals
- `admin/set_vehicle_pricing.php`: admin-controlled pricing
- `admin/user_detail.php`: user details
- `admin/api_get_user_vehicles.php`: fetch vehicles for admin interactions
- `admin/sidebar.php`, `admin/bottom-nav.php`

#### `includes/`

Shared helpers used by the newer auth/session flow.

Important files:

- `includes/persistent_login.php`: session auth helpers, role guards, redirects
- `includes/session_helper.php`: overlapping session helpers
- `includes/functions.php`: user lookup, password verification, location helpers
- `includes/otp_manager.php`: OTP generation/verification helpers
- `includes/oauth_state_manager.php`: OAuth state/security support
- `includes/app_auth_tokens.php`: app auth token handling
- `includes/app_auth_security.php`: app auth security
- `includes/dark_mode.php`: dark-mode session/user helper
- `includes/db.php`: legacy mysqli connection file

#### `libs/`

Legacy auth/data access layer.

- `libs/auth.php`: `pdo_connect()`, `require_login()`, `get_user()`

#### `config/`

Configuration and provider setup.

- `config/config.php`: central config, env loading, DB constants, PDO, OAuth, Firebase, Maps, mail, SMS
- `config/email_send.php`: email OTP sending
- `config/generate-vapid-keys.php`: push setup

#### `api/`

Non-public-folder auth/app endpoints.

- `api/auth/google-signin.php`: OAuth flow handler
- `api/auth/google.php`: related Google auth handler
- `api/auth/app-redirect.php`
- `api/auth/firebase/app.php`
- `api/verify-app-token.php`

#### `sql/`

Schema and migrations.

- `sql/schema.sql`
- migrations for role fields, location, push, driver assignments, driver earnings, app auth tokens, OAuth states

---

## 5. Root-level files that matter

Important root files:

- `index.php`, `login.php`, `logout.php`: likely wrapper/legacy entry files
- `manifest.json`: PWA manifest
- `service-worker.js`: service worker
- `sw-register.js`: service worker registration
- `push-init.js`, `push-helper.js`: push notification front-end plumbing
- `offline.html`: offline fallback
- `payment-methods.php`, `privacy-policy.php`, `terms-and-conditions.php`, `about.php`
- `workflow.php`: likely internal/overview workflow page
- `setup_test_users.php`, migration files, test files

There are also many audit/summary text files for OAuth, PWA, SEO, and push. These are operational notes rather than product UI files.

---

## 6. Data model and system entities

### 6.1 Base schema from `sql/schema.sql`

#### `users`

Base fields:

- `id`
- `name`
- `email`
- `phone`
- `password_hash`
- `role`
- `created_at`

Later code and migrations imply additional columns are also in use:

- `google_id`
- `profile_pic`
- `gender`
- `address`
- `state`
- `landmark`
- `pin`
- `dark_mode`
- `language`
- `email_verified`
- `phone_verified`
- `location_lat`
- `location_lng`
- `status`
- role-specific identity fields such as `driving_licence`, `aadhar_number`, `ilp`

#### `vehicles`

Base fields:

- `id`
- `owner_id`
- `title`
- `description`
- `type`
- `hourly_rate`
- `lat`
- `lng`
- `is_available`
- `created_at`

Current application code also expects many expanded fields:

- `driver_id`
- `vehicle_image`
- `vehicle_video`
- `size_or_capacity`
- `stock_quantity`
- `available_quantity`
- `status`
- `category`
- `model_name`
- `price_amount`
- `pricing_type`
- `location_lat`
- `location_lng`

#### `bookings`

Base fields:

- `vehicle_id`
- `renter_id`
- `owner_id`
- `start_time`
- `end_time`
- `total_amount`
- `status`

Current code also expects:

- `driver_id`
- `work_location`
- `work_lat`
- `work_lng`
- `payment_method`
- `payment_status`
- `payment_amount`
- `payment_gateway`

### 6.2 Supporting tables

Used or created by code/migrations:

- `notifications`
- `inbox`
- `help_tickets`
- `ticket_replies`
- `driver_earnings`
- `push_subscriptions`
- `push_notifications`
- `notification_preferences`
- `otp_verifications`
- OAuth/app auth token tables from migration files

### 6.3 Redesign implication

The UI is relying on a richer schema than the original `sql/schema.sql` describes. Before redesigning forms and dashboards, it would be worth producing a clean canonical schema document, because the current codebase has grown beyond the original SQL.

---

## 7. Main layouts and design patterns in the current site

### 7.1 Renter/public layout pattern

Common characteristics:

- fixed header via `public/header.php`
- fixed bottom navigation via `public/bottom-nav.php`
- mobile-app style cards
- strong use of rounded corners, gradients, shadows
- large inline page-specific CSS blocks
- Bootstrap utilities mixed with handcrafted styles
- Google Maps embedded directly into pages

Main visual behavior:

- top header always visible
- bottom nav always visible
- content squeezed into middle scroll area
- pages often feel like single-screen mobile views rather than desktop-responsive layouts

### 7.2 Owner layout pattern

Common characteristics:

- left sidebar on desktop
- dashboard card grid
- more enterprise/admin-like spacing
- uses `public/assets/css/owner-dashboard.css` plus per-page styles
- optional dark mode styling

### 7.3 Driver layout pattern

Common characteristics:

- dashboard shell similar to owner/admin but not fully unified
- many pages define their own CSS variables inline
- card-heavy UI with filters, stat boxes, and lists

### 7.4 Admin layout pattern

Common characteristics:

- fixed gradient sidebar
- large stat cards
- tabular management screens
- again, mostly inline styles instead of a shared admin design system

### 7.5 Shared design language today

Repeated motifs:

- gradients: blue/purple family used often
- rounded cards and pills
- heavy shadows
- `Poppins` and `Inter`
- Bootstrap Icons
- white cards on light gray backgrounds

### 7.6 Design inconsistency summary

The current website does not have one coherent design system. It has:

- one mobile/public style
- one owner style
- one driver style
- one admin style
- several settings/help/profile pages that introduce their own mini-theme

This is the biggest redesign opportunity.

---

## 8. Frontend asset structure

### Shared CSS files

- `public/assets/css/style.css`: old/global general styling
- `public/assets/css/auth.css`: auth screens
- `public/assets/css/dark-mode.css`: dark mode
- `public/assets/css/owner-dashboard.css`: owner dashboard shell

### Media assets

- `public/assets/icons/`: category/nav icons
- `public/assets/images/`: logo, default user image, some marketing graphics
- `public/assets/videos/background.mp4`
- `public/uploads/`: user-generated images/videos for profiles and vehicles

### Observation

The shared CSS files exist, but many major pages still ignore them and define large inline styles. That means design changes currently require touching many individual PHP files.

---

## 9. Current user roles and what each can do

### 9.1 Renter

Can:

- browse categories from home
- search/filter equipment
- view equipment details
- book equipment
- view bookings
- track accepted bookings
- manage profile/settings
- access inbox/help

Main files:

- `public/index.php`
- `public/equipment.php`
- `public/equipment_details.php`
- `public/book_vehicle.php`
- `public/bookings.php`
- `public/track_booking.php`
- `public/profile.php`
- `public/settings.php`
- `public/inbox.php`
- `public/help.php`

### 9.2 Owner

Can:

- see dashboard stats
- add/edit/delete vehicles
- upload vehicle images/video
- assign driver to vehicle
- view rental history/details
- set driver earnings
- manage owner profile/settings

Main files:

- `owner/dashboard.php`
- `owner/add_vehicle.php`
- `owner/my_vehicles.php`
- `owner/edit_vehicle.php`
- `owner/rental_history.php`
- `owner/rental_details.php`
- `owner/set_driver_earnings.php`

### 9.3 Driver

Can:

- see assigned vehicles
- review trips
- update trip status
- view earnings
- manage profile/help

Main files:

- `driver/dashboard.php`
- `driver/my_trips.php`
- `driver/get_trip_details.php`
- `driver/update_trip_status.php`
- `driver/my_earnings.php`

### 9.4 Admin

Can:

- view platform stats
- manage users, owners, drivers
- manage rentals
- set vehicle pricing
- inspect user details

Main files:

- `admin/dashboard.php`
- `admin/manage_users.php`
- `admin/manage_owners.php`
- `admin/manage_drivers.php`
- `admin/manage_rentals.php`
- `admin/set_vehicle_pricing.php`
- `admin/user_detail.php`

---

## 10. Primary user journeys and flow

### 10.1 Public browse flow

1. User lands on `public/index.php`
2. User chooses location manually or via current location
3. User sees map and categories
4. User opens `public/equipment.php`
5. User filters by category/search/brand/size/location
6. User opens `public/equipment_details.php`
7. User clicks book

### 10.2 Registration flow

There are effectively two registration implementations in the project:

#### Flow A: `public/register.php`

1. Enter basic info and role
2. Email OTP sent
3. Verify email OTP
4. Phone OTP sent
5. Verify phone OTP
6. User account created
7. Session created and redirected to role dashboard

#### Flow B: `public/registration.php`

A larger role-based registration page with more conditional fields and Google signup linking.

Redesign note:

- these two registration files should probably be consolidated into one canonical flow

### 10.3 Login flow

Standard login:

1. Open `public/login.php`
2. Submit email/password
3. `verifyUserPassword()` validates user
4. `setUserSession()` stores session
5. redirect by role

Google login:

1. start from `public/login.php` or `public/google_login.php`
2. route through `api/auth/google-signin.php`
3. OAuth state validated
4. Google token exchanged and verified
5. user found or auto-created
6. session created
7. redirect to web/app target

App login:

- app-auth token generation and app callback support exist via `includes/app_auth_tokens.php` and `api/verify-app-token.php`

### 10.4 Booking flow

1. User opens `public/equipment_details.php`
2. User enters `public/book_vehicle.php`
3. User selects worksite on map or via Places autocomplete
4. System calculates booking total based on pricing type
5. Booking inserted into `bookings`
6. User is redirected to `public/bookings.php`
7. If accepted, user can track booking on `public/track_booking.php`

### 10.5 Tracking flow

1. `public/track_booking.php` loads worksite and current vehicle coordinates
2. page polls `public/tracking_api.php`
3. API returns vehicle location from booking vehicle
4. map updates marker, route, ETA, and Google Maps nav link

### 10.6 Owner inventory flow

1. Owner logs in
2. Lands on `owner/dashboard.php`
3. Opens `owner/add_vehicle.php`
4. uploads media, sets location, stock/availability, optional driver
5. manages inventory from `owner/my_vehicles.php`
6. edits/toggles/deletes vehicles

### 10.7 Driver trip flow

1. Driver logs in
2. Lands on `driver/dashboard.php`
3. reviews assigned trips in `driver/my_trips.php`
4. opens trip details
5. updates status through `driver/update_trip_status.php`
6. later reviews earnings

### 10.8 Support/inbox flow

1. User opens `public/help.php`
2. help ticket tables may be auto-created if missing
3. user submits ticket or replies
4. `public/inbox.php` aggregates:
   - inbox items
   - notifications
   - help ticket replies

---

## 11. Page-by-page redesign notes

### `public/index.php`

Current role:

- homepage
- location picker
- embedded map
- category launchpad
- promo block

Redesign opportunities:

- convert from simple category grid into a stronger search-led landing page
- better hero, trust, featured inventory, and location awareness
- make desktop layout more deliberate

### `public/equipment.php`

Current role:

- list view with filters
- mobile filter drawer

Redesign opportunities:

- cleaner card system
- stronger filter hierarchy
- better sorting and availability badges
- clearer map/list relationship

### `public/equipment_details.php`

Current role:

- product detail
- owner contact
- location map
- CTA to book

Redesign opportunities:

- richer media gallery
- clearer price breakdown
- inventory/availability status
- trust and owner credibility information

### `public/book_vehicle.php`

Current role:

- booking form
- worksite location selection
- price calculation

Redesign opportunities:

- split booking into steps
- clearer payment explanation
- validate booking duration and pricing visually

### `public/bookings.php`

Current role:

- renter activity/history

Redesign opportunities:

- tabs by status
- clearer timeline
- track/pay/contact actions grouped better

### `public/profile.php`, `public/settings.php`, `public/inbox.php`, `public/help.php`

Current role:

- account center

Redesign opportunities:

- unify these into a single account/settings/support system with consistent page shell

### Owner/Driver/Admin dashboards

Current role:

- internal operations

Redesign opportunities:

- create one reusable dashboard design system:
  - shared sidebar
  - shared topbar
  - shared stats card style
  - shared tables/forms/filters/modal system

---

## 12. API and dynamic behavior map

### Location / discovery

- `public/api_get_nearby.php`: nearby vehicles JSON
- `public/api_get_vehicle_location.php`: vehicle location lookup
- `public/api_update_location.php`: update owner/vehicle location
- `public/tracking_api.php`: booking tracking polling endpoint

### Auth

- `public/login.php`
- `public/register.php`
- `public/otp_send.php`
- `public/otp_verify.php`
- `public/google_login.php`
- `api/auth/google-signin.php`
- `api/auth/google.php`
- `api/verify-app-token.php`

### UI preferences / messaging

- `public/api_update_dark_mode.php`
- `public/get_ticket_replies.php`
- `public/api_send_admin_message.php`

### Push notifications

- `public/api/subscribe-push.php`
- `public/api/unsubscribe-push.php`
- `public/api/send-push.php`
- `public/api/test-push.php`

---

## 13. PWA, offline, and notifications

Current PWA-related assets:

- `manifest.json`
- `service-worker.js`
- `sw-register.js`
- `offline.html`
- `push-init.js`
- `push-helper.js`

Current behavior:

- service worker caches public/static content
- protected routes are intentionally not cached
- offline fallback exists
- push infrastructure is prepared

Redesign implication:

- if the renter side should feel app-like, the PWA direction is already aligned with that goal
- owner/admin/driver may not need the same app-shell treatment

---

## 14. Key technical observations that matter for redesign

### 14.1 Mixed auth systems

There are overlapping auth helpers:

- `includes/persistent_login.php`
- `includes/session_helper.php`
- `libs/auth.php`

This creates ambiguity in:

- redirects
- role checks
- how user data is loaded

### 14.2 Schema drift

Code expects many columns not shown in the original base schema file.

This affects redesign of:

- forms
- profile fields
- admin controls
- filters
- booking/payment states

### 14.3 View logic is tightly coupled

Many files contain:

- DB queries
- request handling
- HTML
- CSS
- JS

all together.

This makes redesign slower because visual changes often require editing business-logic files directly.

### 14.4 Inline CSS is dominant

Many major pages define custom page styles in the PHP file itself.

This means:

- components are hard to reuse
- branding changes are expensive
- consistency drifts quickly

### 14.5 Runtime schema creation exists in UI pages

Examples:

- `public/inbox.php` creates tables if missing
- `public/help.php` creates tables if missing
- `public/settings.php` alters columns if missing

This is important because redesign or cleanup should separate migration/setup concerns from page rendering.

---

## 15. Biggest UX/design problems visible in the current implementation

### Problem 1: No single design system

The app looks like multiple unrelated products stitched together.

### Problem 2: Role areas are not clearly related

Renter, owner, driver, and admin use different UI logic and visual identity.

### Problem 3: Navigation is fragmented

- renter uses fixed mobile bottom nav
- owner/admin use sidebars
- some shared pages use legacy auth flow and their own shells

### Problem 4: Forms and data fields are inconsistent

Registration, profile, vehicle, and booking fields are spread across different implementations.

### Problem 5: Mobile-first public UI is not matched by a strong desktop strategy

Several public pages feel designed primarily for small screens and only passably stretch to desktop.

---

## 16. Recommended redesign strategy

### Phase 1: Define product architecture

Decide the future structure:

- Public renter web/PWA
- Owner/Driver/Admin operations console

Treat these as two intentional experience layers under one brand.

### Phase 2: Create a design system

Define:

- color tokens
- typography scale
- spacing system
- card, form, table, button, badge, modal, nav components
- page templates

### Phase 3: Unify navigation

Recommended split:

- renter/public: app-like bottom nav + cleaner top nav
- owner/driver/admin: one shared dashboard shell with role-based menu items

### Phase 4: Consolidate auth/account flows

Unify:

- login
- registration
- OTP verification
- Google sign-in
- account settings/profile

### Phase 5: Consolidate schema and CRUD patterns

Before deep redesign implementation:

- document actual DB schema
- remove runtime table/column creation from page files
- standardize data loading and save patterns

---

## 17. Suggested redesign sitemap

### Public / renter

- Home
- Search / Explore Equipment
- Equipment Details
- Booking Checkout
- My Bookings
- Live Tracking
- Inbox
- Help & Support
- Account
- Settings

### Owner console

- Dashboard
- Vehicles
- Add / Edit Vehicle
- Rentals
- Rental Detail
- Driver Assignments
- Driver Earnings
- Profile
- Settings

### Driver console

- Dashboard
- My Trips
- Trip Detail
- Earnings
- Help
- Profile

### Admin console

- Dashboard
- Users
- Owners
- Drivers
- Rentals
- Pricing
- User Detail

---

## 18. Important files to open first during redesign work

If redesign starts immediately, these are the best first files to study:

- `public/index.php`
- `public/equipment.php`
- `public/equipment_details.php`
- `public/book_vehicle.php`
- `public/bookings.php`
- `public/profile.php`
- `public/settings.php`
- `public/inbox.php`
- `public/help.php`
- `public/login.php`
- `public/register.php`
- `public/registration.php`
- `public/header.php`
- `public/bottom-nav.php`
- `owner/dashboard.php`
- `owner/add_vehicle.php`
- `owner/my_vehicles.php`
- `driver/dashboard.php`
- `driver/my_trips.php`
- `admin/dashboard.php`
- `admin/manage_users.php`
- `config/config.php`
- `includes/persistent_login.php`
- `libs/auth.php`
- `sql/schema.sql`

---

## 19. Final redesign takeaway

The current GearRent codebase already contains most of the product features needed for a serious rental platform:

- browsing
- booking
- tracking
- multi-role dashboards
- OTP auth
- Google auth
- help/inbox
- push/PWA groundwork

The main redesign challenge is not missing functionality.

The main redesign challenge is coherence:

- coherent information architecture
- coherent navigation
- coherent design language
- coherent auth/account model
- coherent shared component system

If those are unified first, the product will feel dramatically more professional even before any deep backend refactor.

