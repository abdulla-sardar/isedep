<?php
require 'config.php';

$token = $_GET['token'] ?? '';

if (!$token) {
    die("Invalid reset link.");
}

$stmt = $conn->prepare("SELECT * FROM users WHERE reset_token = ? AND token_expires >= NOW()");
$stmt->execute([$token]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    die("Link expired or invalid.");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $newPassword = $_POST['password'] ?? '';
    $confirm = $_POST['confirm'] ?? '';

    if (strlen($newPassword) < 8 || !preg_match('/[0-9]/', $newPassword)) {
        echo "<p style='color:red'>Password must be at least 8 characters and contain a number.</p>";
    } elseif ($newPassword !== $confirm) {
        echo "<p style='color:red'>Passwords do not match.</p>";
    } else {
        $hashed = password_hash($newPassword, PASSWORD_BCRYPT);

        $stmt = $conn->prepare("UPDATE users SET password = ?, reset_token = NULL, token_expires = NULL WHERE id = ?");
        $stmt->execute([$hashed, $user['id']]);

        echo "<p style='color:lime'>Password has been reset successfully.</p>";
        echo "<script>setTimeout(() => window.location.href='login.html', 3000);</script>";
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Reset Password</title>
  <style>
    body {
      background: black;
      font-family: 'Fira Code', monospace;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      color: #00ff99;
    }

    .card {
      background: rgba(0, 0, 0, 0.4);
      padding: 30px;
      border: 1px solid #00ff99;
      border-radius: 12px;
      box-shadow: 0 0 20px #00ff9980;
    }

    input {
      display: block;
      margin: 10px 0;
      padding: 10px;
      border: 1px solid #00ff99;
      background: black;
      color: #00ff99;
      width: 100%;
      font-family: inherit;
    }

    button {
      background: #00ff99;
      border: none;
      padding: 10px 20px;
      color: black;
      cursor: pointer;
      font-weight: bold;
    }

    h2 {
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>Reset Your Password</h2>
    <form method="POST">
      <input type="password" name="password" placeholder="New Password" required />
      <input type="password" name="confirm" placeholder="Confirm Password" required />
      <button type="submit">Reset Password</button>
    </form>
  </div>
</body>
</html>
