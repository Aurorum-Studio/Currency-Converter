<?php
// getRates.php
$apiBaseUrl = 'https://exchange-rate.aurorum.co/API/CurrentRatesAPI.php';
$token = '[get your token from https://exchange-rate.aurorum.co/]';
$fromCurrency = $_GET['from'] ?? 'USD';
$toCurrency = $_GET['to'] ?? 'CNY';

// 构建API URL
$apiUrl = "$apiBaseUrl?token=$token&&from=$fromCurrency&&to=$toCurrency";

// 通过 file_get_contents 调用API
$response = @file_get_contents($apiUrl);

if ($response !== false) {
    header('Content-Type: application/json');
    echo $response;
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Unable to fetch exchange rates']);
}
?>
