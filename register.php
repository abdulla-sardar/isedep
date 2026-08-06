<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['full_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $role = $_POST['role'] ?? '';
    $department = trim($_POST['department'] ?? '');
    $gender = $_POST['gender'] ?? '';

    // حماية: تحقق من القيم الأساسية
    if (empty($name) || empty($email) || empty($password) || empty($role) || empty($department) || empty($gender)) {
        die("❌ Please fill in all required fields.");
    }

    // حماية: التحقق من الإيميل
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("❌ Invalid email format.");
    }

    // حماية: التحقق من قوة الباسورد
    if (strlen($password) < 8 || !preg_match('/[0-9]/', $password)) {
        die("❌ Password too weak. Must be at least 8 characters and include a number.");
    }

    // حماية: السماح فقط بالقيم المعروفة
    if (!in_array($role, ['student', 'teacher', 'guest'])) {
        die("❌ Invalid role selected.");
    }

    if (!in_array($gender, ['male', 'female'])) {
        die("❌ Invalid gender selected.");
    }

    // حماية: تشفير الباسورد
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);

    try {
        $stmt = $conn->prepare("INSERT INTO users (full_name, email, password, role, department, gender) 
                                VALUES (:name, :email, :password, :role, :department, :gender)");
        $stmt->execute([
            ':name' => htmlspecialchars($name),
            ':email' => htmlspecialchars($email),
            ':password' => $hashed_password,
            ':role' => $role,
            ':department' => htmlspecialchars($department),
            ':gender' => $gender
        ]);

        echo "✅ Registered successfully!";

    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            echo "⚠️ Email already exists.";
        } else {
            echo "❌ Error: " . $e->getMessage();
        }
    }
}
?>