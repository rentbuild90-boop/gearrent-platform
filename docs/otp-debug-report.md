# OTP Debug Report

## Complete Execution Flow
1. User enters Full Name, Phone Number, and Password on the Register page (`frontend/src/app/auth/register/page.jsx`).
2. User clicks the "Verify Phone Number" button.
3. The `<form>` triggers `onSubmit={handleNextStep1}`.
4. `handleNextStep1` generates a random 6-digit OTP.
5. The OTP is saved in `sessionStorage` as `expectedOTP`.
6. A frontend `fetch` request is made directly to `https://sms.renflair.in/V1.php` with `mode: 'no-cors'`.
7. Execution moves to Step 2 (the OTP input screen), and the timer starts.
8. The SMS is expected to be delivered but never arrives.

## Files Inspected
- `d:/gear/frontend/src/app/auth/register/page.jsx`: Contains the frontend UI, form logic, and direct API call to Renflair.
- `d:/gear/renflair.md`: Documentation for the Renflair SMS Gateway.
- `d:/gear/backend/app/routers/auth.py`: Backend router containing the `/auth/send-otp` and `/auth/verify-otp` endpoints.
- `d:/gear/backend/app/services/auth_service.py`: Backend service containing OTP generation, database saving, and external SMS service calling.
- `d:/gear/backend/app/services/sms_service.py`: Backend service responsible for the server-to-server HTTP request to Renflair.

## Network Requests
- When clicking "Verify Phone Number", a `GET` request is dispatched to `https://sms.renflair.in/V1.php?API=...&PHONE=...&OTP=...`.
- Because the fetch is configured with `mode: 'no-cors'`, the browser sends the request but blocks the frontend from reading the response (making it an "opaque" response). 

## Console Errors
- There are no unhandled promise rejections or visible JavaScript crashes in the console because `no-cors` swallows HTTP response errors (the response is opaque, so `fetch` does not throw an exception on HTTP 4xx or 5xx status codes).

## Root Cause
The root cause is that the Renflair API Gateway's Web Application Firewall (WAF) or security policy blocks cross-origin requests originating from unauthorized web applications (like `http://localhost:3000`). 
When `fetch` is used in a browser, it automatically attaches the `Origin` and `Referer` headers to the HTTP request. The Renflair server detects these headers, identifies the request as an unauthorized cross-origin request, and drops or rejects it (likely returning a 403 Forbidden). However, because `mode: 'no-cors'` is used, the browser hides this HTTP error from the frontend code, giving the false impression that the request succeeded.

Additionally, exposing the `API` key directly in the frontend source code is a critical security vulnerability. 

## Why Manual URL Worked
When the Renflair URL is opened directly in the browser's address bar, the browser performs a direct, top-level navigation. During this navigation, it does **not** send an `Origin` header. Similarly, server-side tools like PHP cURL or Python's `httpx` do not automatically attach `Origin` or browser-specific tracking headers. Because these headers are absent, the Renflair API assumes it is a standard server-to-server or direct request and processes it successfully.

## Exact Fix
The fix is to completely eliminate the frontend-to-Renflair direct connection and route the OTP flow through the secure backend API. 
1. **Frontend**: Update `handleNextStep1` in `frontend/src/app/auth/register/page.jsx` to call `POST http://localhost:8000/auth/send-otp` with the payload `{ "phone": phone, "purpose": "REGISTER" }`.
2. **Frontend**: Update `verifyOTP` to call `POST http://localhost:8000/auth/verify-otp` with the payload `{ "phone": phone, "code": code, "purpose": "REGISTER" }` instead of checking `sessionStorage`.
3. **Frontend**: Remove the hardcoded `API` key and `sessionStorage` logic.
4. **Backend**: Ensure the backend's `.env` is configured with the `RENFLAIR_API_KEY`, allowing `sms_service.py` to make a secure server-to-server request to Renflair without `Origin` headers.
