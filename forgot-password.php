<?php
require 'config.php';
require 'mailer.php';

$email = trim($_POST['email'] ?? '');
$full_name = trim($_POST['full_name'] ?? '');
$gender = trim($_POST['gender'] ?? '');

if (!$email || !$full_name || !$gender) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM users WHERE email = :email AND gender = :gender");
$stmt->execute([':email' => $email, ':gender' => $gender]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'Email or gender not found.']);
    exit;
}

similar_text(strtolower($user['full_name']), strtolower($full_name), $percent);
if ($percent < 70) {
    echo json_encode(['success' => false, 'message' => 'Name does not match sufficiently.']);
    exit;
}

$token = bin2hex(random_bytes(32));
$expires_at = date('Y-m-d H:i:s', time() + 3600);

$conn->prepare("DELETE FROM password_resets WHERE email = :email")->execute([':email' => $email]);

$conn->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (:email, :token, :expires)")
     ->execute([':email' => $email, ':token' => $token, ':expires' => $expires_at]);

$link = "https://isedep.com/reset-password.php?token=$token";

$mail = sendMail([
    'to' => $email,
    'subject' => "Reset your ISE Account Password",
    'body' => "
        <p>Hi <strong>{$user['full_name']}</strong>,</p>
        <p>We received a request to reset your password.</p>
        <p><a href='$link' style='color:#00bfff;font-weight:bold;'>Click here to reset it</a></p>
        <p>This link will expire in 1 hour.</p>
    "
]);

if ($mail === true) {
    echo json_encode(['success' => true, 'message' => 'Reset link has been sent to your email.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send email.', 'error' => $mail]);
}
?>
