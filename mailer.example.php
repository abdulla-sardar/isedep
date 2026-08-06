<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // load PHPMailer via Composer

function sendMail($data) {
    $mail = new PHPMailer(true);

    try {
        // Gmail SMTP settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'your_email@gmail.com';
        $mail->Password = 'your_gmail_app_password';   // Gmail App Password, not your login password
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('your_email@gmail.com', 'ISE Recovery System');
        $mail->addAddress($data['to']);

        $mail->isHTML(true);
        $mail->Subject = $data['subject'];
        $mail->Body    = $data['body'];

        $mail->send();
        return true;

    } catch (Exception $e) {
        return $mail->ErrorInfo;
    }
}
