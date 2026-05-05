<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Only POST requests are supported.'
    ]);
    exit;
}

function clean_input($value) {
    return htmlspecialchars(trim((string) $value), ENT_QUOTES, 'UTF-8');
}

$configuration = [
    'product' => clean_input($_POST['product'] ?? ''),
    'size' => clean_input($_POST['size'] ?? ''),
    'quantity' => clean_input($_POST['quantity'] ?? ''),
    'printColors' => clean_input($_POST['printColors'] ?? ''),
    'deliveryCountry' => clean_input($_POST['deliveryCountry'] ?? ''),
    'email' => clean_input($_POST['email'] ?? ''),
    'notes' => clean_input($_POST['notes'] ?? ''),
];

if (!filter_var($configuration['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Please provide a valid email address.'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Mock packaging configuration received. In production, this would continue to cart, checkout, and payment.',
    'data' => $configuration
]);
