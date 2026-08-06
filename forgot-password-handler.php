<?php
require 'config.php';
require 'mailer.php'; // الدالة sendMail()

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $name = trim($_POST['full_name'] ?? '');
    $gender = trim($_POST['gender'] ?? '');

    if (!$email || !$name || !$gender) {
        die("❌ All fields are required.");
    }

    // البحث عن المستخدم
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        die("❌ No user found with this email.");
    }

    // التحقق من الاسم بنسبة 70% على الأقل
    similar_text(strtolower($name), strtolower($user['full_name']), $percent);
    if ($percent < 70) {
        die("❌ Full name doesn't match (similarity: $percent%).");
    }

    // تحقق الجنس 100%
    if (strtolower($user['gender']) !== strtolower($gender)) {
        die("❌ Gender doesn't match.");
    }

    // توليد توكن وتخزينه مع وقت انتهاء (30 دقيقة)
    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', time() + 1800); // 30 دقيقة

    $stmt = $conn->prepare("UPDATE users SET reset_token = ?, token_expires = ? WHERE email = ?");
    $stmt->execute([$token, $expires, $email]);

    // إرسال الإيميل
    $link = "https://isedep.com/reset-password.php?token=$token";
    $mailData = [
        'to' => $email,
        'subject' => "🔐 ISE Password Reset",
        'body' => "
            <h3>Password Reset Request</h3>
            <p>Hi <b>{$user['full_name']}</b>,</p>
            <p>Click the button below to reset your password:</p>
            <a href='$link' style='padding:10px 20px;background:#00ff99;color:black;text-decoration:none;border-radius:6px;'>Reset Password</a>
            <p>This link is valid for 30 minutes only.</p>
        "
    ];

    if (sendMail($mailData) === true) {
        echo "✅ Email sent to $email!";
    } else {
        echo "❌ Failed to send email.";
    }
}
?>
