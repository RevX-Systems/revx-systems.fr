<?php
declare(strict_types=1);

// Ancien traitement désactivé : le formulaire utilise désormais FormSubmit AJAX.
// Aucun envoi de courriel ni traitement des données reçues sur cette URL.
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
if (in_array($_SERVER['REQUEST_METHOD'], ['GET', 'HEAD'], true)) {
    header('Location: contact.html', true, 303);
    exit;
}
http_response_code(410);
header('Content-Type: text/plain; charset=utf-8');
echo 'Ce traitement est désactivé. Veuillez utiliser la page contact.';
