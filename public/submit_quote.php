<?php
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $name = $_POST["name"];
    $email = $_POST["email"];

    $to = "jessi316866@gmail.com";
    $subject = "Quote Request";
    $message = "Name: $name\n";
    $message = "Email: $email\n";

    mail($to, $subject, $message);

    header("Location: forum.html");
    exit;
} else{
    echo "Invalid Request";
}
?>