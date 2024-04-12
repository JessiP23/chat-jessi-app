<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $subject = $_POST["subject"];
    $message = $_POST["message"];
    
    // Change the recipient email address as needed
    $recipient = "your_email@example.com";
    
    // Build the email message
    $mailBody = "Name: $name\n";
    $mailBody .= "Email: $email\n";
    $mailBody .= "Subject: $subject\n";
    $mailBody .= "Message:\n$message\n";
    
    // Send the email
    if (mail($recipient, "Contact Form Submission", $mailBody)) {
        echo "Thank you for your message. We will get back to you soon!";
    } else {
        echo "Error sending your message. Please try again later.";
    }
} else {
    echo "Invalid request";
}
?>
