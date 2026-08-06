<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = strip_tags(trim($_POST["message"]));

    // التحقق من وجود بيانات في الحقول المطلوبة
    if (empty($name) OR empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // يمكنك هنا إرجاع رسالة خطأ إذا كانت البيانات غير صحيحة
        echo "Oops! There was a problem with your submission. Please complete the form and try again.";
        exit;
    }

    // مكان تعيين المتغيرات الخاصة بالإرسال
    $recipient = "cihanchat@gmail.com"; // ضع البريد الإلكتروني الخاص بك هنا
    $subject = "New massage from $name";

    // بناء الرسالة البريدية
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";

    // إرسال الرسالة
    $success = mail($recipient, $subject, $email_content, "From: $name <$email>");

    if ($success) {
        // يمكنك إرجاع رسالة نجاح أو إعادة توجيه المستخدم
        echo "Thank You! Your message has been sent.";
    } else {
        echo "Oops! Something went wrong and we couldn't send your message.";
    }
} else {
    // ليس POST request
    echo "There was a problem with your submission, please try again.";
}
?>
