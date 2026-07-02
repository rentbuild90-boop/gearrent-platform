import os
import re

model_dir = r"d:\gear\backend\app\database\models"
existing_tables = set()

for filename in os.listdir(model_dir):
    if filename.endswith(".py"):
        with open(os.path.join(model_dir, filename), "r", encoding="utf-8") as f:
            content = f.read()
            matches = re.findall(r'__tablename__\s*=\s*["\']([^"\']+)["\']', content)
            existing_tables.update(matches)

requested_tables = """
permissions
role_permissions
refresh_tokens
otp_codes
login_history
devices
api_keys
sessions
addresses
saved_locations
contacts
preferences
bank_accounts
documents
document_types
equipment_images
equipment_documents
equipment_maintenance
equipment_service_history
equipment_damage_reports
equipment_insurance
equipment_availability
equipment_status_history
equipment_location_history
equipment_features
booking_status_history
booking_extensions
booking_delivery
booking_return
booking_inspection
booking_documents
booking_logs
booking_cancellation
booking_events
wallet_ledger
withdraw_requests
withdraw_accounts
withdraw_history
commission_rules
refunds
refund_requests
payment_methods
payment_gateway_logs
payment_webhooks
razorpay_transactions
coupon_usage
promotions
gps_history
delivery_routes
route_points
geofences
conversation_members
message_status
message_attachments
message_reactions
notification_templates
notification_logs
push_tokens
email_logs
sms_logs
review_images
review_votes
server_logs
deployment_history
database_backups
queue_jobs
queue_history
environment_variables
service_status
system_health
audit_logs
activity_logs
feature_flags
system_settings
districts
areas
pincodes
currencies
languages
vehicle_brands
equipment_models
""".split()

requested_set = set(requested_tables)
missing = requested_set - existing_tables

print("Tables to add:")
for m in sorted(missing):
    print("- " + m)
