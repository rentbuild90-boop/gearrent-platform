## Code for Sending Text OTP
Message: 1234 is your verification code for domain.com
(Your domain name or app name will appear here)

$API="xxxxxxxxxxxxxxxxx";
$PHONE="9876543210";
$OTP=1234;
$URL="https://sms.renflair.in/V1.php?API=$API&PHONE=$PHONE&OTP=$OTP";
$curl=curl_init($URL);
curl_setopt($curl, CURLOPT_URL, $URL);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$resp = curl_exec($curl);
curl_close($curl);
$data = json_decode($resp);
            


## Order Successful SMS
Message: Hi, Rakesh, Your order ID 1234 has been placed Successfully. It will be delivered soon.
From: Your Domain name

$API="xxxxxxxxxxxxxxxxx";
$PHONE="9876543210";
$CNAME="RAKESH"; // CUSTOMER'S NAME
$OID=1234; // ORDER ID
$URL="https://sms.renflair.in/V3.php?API=$API&PHONE=$PHONE&OID=$OID&CNAME=$CNAME";
$curl=curl_init($URL);
curl_setopt($curl, CURLOPT_URL, $URL);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$resp = curl_exec($curl);
curl_close($curl);
$data = json_decode($resp);
            



## Received New Order for Partner SMS
Message: Received a new order with ID 1234, please check and proceed with the order.
From: Your Domain name

$API="xxxxxxxxxxxxxxxxx";
$PHONE="9876543210";
$OID=1234; // ORDER ID
$URL="https://sms.renflair.in/V4.php?API=$API&PHONE=$PHONE&OID=$OID";
$curl=curl_init($URL);
curl_setopt($curl, CURLOPT_URL, $URL);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$resp = curl_exec($curl);
curl_close($curl);
$data = json_decode($resp);




## Service Booking Successful SMS
Message: Your Service Request has been Booked Successfully. It will be processed within 2 hours. Order ID: 1234
Thank you for using: Your Domain name

$API="xxxxxxxxxxxxxxxxx";
$PHONE="9876543210";
$OID=1234; // ORDER ID
$HOUR=2; // Hour
$URL="https://sms.renflair.in/V7.php?API=$API&PHONE=$PHONE&OID=$OID&HOUR=$HOUR";
$curl=curl_init($URL);
curl_setopt($curl, CURLOPT_URL, $URL);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$resp = curl_exec($curl);
curl_close($curl);
$data = json_decode($resp);




## Code for Sending Text OTP
Message: 1234 is your verification code for domain.com
(Your domain name or app name will appear here)

$API="xxxxxxxxxxxxxxxxx";
$PHONE="9876543210";
$OTP=1234;
$URL="https://sms.renflair.in/V1.php?API=$API&PHONE=$PHONE&OTP=$OTP";
$curl=curl_init($URL);
curl_setopt($curl, CURLOPT_URL, $URL);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$resp = curl_exec($curl);
curl_close($curl);
$data = json_decode($resp);



## Recharge Confirmation SMS
Message: Your Wallet has been Recharged Successfully with Rs.500.
From: Your Domain name

$API="xxxxxxxxxxxxxxxxx";
$PHONE="9876543210";
$AMT="Rs.500"; // Amount
$URL="https://sms.renflair.in/V6.php?API=$API&PHONE=$PHONE&AMT=$AMT";
$curl=curl_init($URL);
curl_setopt($curl, CURLOPT_URL, $URL);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$resp = curl_exec($curl);
curl_close($curl);
$data = json_decode($resp);
            