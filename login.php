<?php
require 'config.php';
header('Content-Type: application/json');

// إذا ما كانت POST نوقف
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit;
}

// استلام البيانات من FormData
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

// التحقق من الحقول
if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Please fill in both fields."]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        // ✅ تم تسجيل الدخول
        echo json_encode([
            "success" => true,
            "message" => "Welcome back, {$user['full_name']}!",
            "role" => $user['role'],
            "name" => $user['full_name'],
            "department" => $user['department'],
            "gender" => $user['gender']
        ]);
    } else {
        // ❌ بيانات خاطئة
        echo json_encode(["success" => false, "message" => "Incorrect email or password."]);
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>
