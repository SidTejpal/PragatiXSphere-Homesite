<?php
header('Content-Type: application/json');
// error_reporting(E_ALL);
// ini_set('display_errors', 1);
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    function clean($value) {
        return trim(htmlspecialchars($value, ENT_QUOTES, 'UTF-8'));
    }
    $data = json_decode(file_get_contents("php://input"), true);

    $name    = clean($data['name'] ?? '');
    $email   = clean($data['email'] ?? '');
    $phone   = clean($data['phone'] ?? '');
    $service = clean($data['service'] ?? '');
    $budget  = clean($data['budget'] ?? '');
    $company = clean($data['company'] ?? '');
    $message = clean($data['message'] ?? '');

    $errors = [];
    if (empty($name) || strlen($name) < 2) {
        $errors['name'] = "Name must be at least 2 characters.";
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = "Invalid email format.";
    }
    if (!empty($phone) && !preg_match("/^[0-9+\-\s]{6,20}$/", $phone)) {
        $errors['phone'] = "Invalid phone number.";
    }
    if (empty($message) || strlen($message) < 10) {
        $errors['message'] = "Message must be at least 10 characters.";
    }
    
    if (!empty($errors)) {
        echo json_encode([
            "status" => "error",
            "errors" => $errors
        ]);
        exit;
    }
    $folder = "mail";
    if (!is_dir($folder)) {
        mkdir($folder, 0777, true);
    }
    $safeName  = preg_replace("/[^A-Za-z0-9\- ]/", "", $name);
    $safePhone = preg_replace("/[^0-9]/", "", $phone);
    $filename = $folder . "/" . $safeName . "-" . $safePhone . "-" . date('Y-m-d_H-i-s') . ".txt";
    $content  = "Name: $name\n";
    $content .= "Email: $email\n";
    $content .= "Phone: $phone\n";
    $content .= "Company: $company\n";
    $content .= "Service: $service\n";
    $content .= "Budget: $budget\n";
    $content .= "Message:\n$message\n";

    //Send email to admin
    $res = sendMailUsingBrevo(['contact@pragativerse.com', 'stejpal@pragativerse.com'], [], 'New Contact Enquiry - '.$name, nl2br($content));

    //Send auto reply to user
    $body = "<p>Hello {$name},</p>
        <p>Thank you for reaching out to <strong>PragatiVerse</strong>.</p>
        <p>We’ve received your enquiry and our team will contact you shortly.</p>
        <p>If your request is urgent, feel free to reply to this email.<br><br></p>
        <p>Warm regards,<br>
        Team PragatiVerse<br>
        🌐 https://pragativerse.com<br>
        📧 info@pragativerse.com</p>";
    sendMailUsingBrevo(["$email"], [], 'Thank you for contacting PragatiVerse', $body);

    if (file_put_contents($filename, $content)) {
        echo json_encode([
            "status" => "success",
            "message" => "Message saved successfully."
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Error saving message."
        ]);
    }

} else {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request."
    ]);
}

function sendMailUsingBrevo($toEmails, $ccEmails, $subject, $body)
{
    $apiResponseText = null;

    $sender = [
        'email' => 'contact@pragativerse.com',
        'name'  => 'PragatiVerse'
    ];

    $to = [];
    if (is_array($toEmails)) {
        foreach ($toEmails as $item) {
            foreach (explode(',', $item) as $email) {
                $to[] = ['email' => trim($email)];
            }
        }
    } else {
        foreach (explode(',', $toEmails) as $email) {
            $to[] = ['email' => trim($email)];
        }
    }

    $cc = [];
    if (!empty($ccEmails)) {
        $arrCc = explode(',', $ccEmails);
        foreach ($arrCc as $ccEmail) {
            $cc[] = ['email' => trim($ccEmail)];
        }
    }

    // $brevoAttachments = [];
    // if ($attachments) {
    //     foreach ($attachments as $attachment) {
    //         if ($attachment['filename'] != "") {
    //             $brevoAttachments[] = [
    //                 'content' => $attachment['content'],
    //                 'name' => $attachment['filename']
    //             ];
    //         }
    //     }
    // }

    $data = [
        'sender' => $sender,
        'to' => $to,
        'cc' => $cc ?: null,
        'subject' => $subject,
        'htmlContent' => $body
    ];

    $ch = curl_init();

    $apiKey = 'xxxx';
    $endpoint = 'https://api.brevo.com/v3/smtp/email';
    // Set cURL options
    curl_setopt($ch, CURLOPT_URL, $endpoint);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'accept: application/json',
        'api-key: ' . $apiKey,
        'content-type: application/json'
    ));


    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        $apiResponseText = [
            'success' => false,
            'status' => $httpCode,
            'error' => $error
        ];
    }
    if ($httpCode >= 200 && $httpCode < 300) {
        $apiResponseText = [
            'success' => true,
            'status' => $httpCode,
            'response' => json_decode($response, true)
        ];
    }

    return $apiResponseText;
}

?>