REVX — V5 navigation magnétique par panneaux
============================================

index.html: nouvelle zone de navigation immersive (Prestations / Solution REVX / Fonctionnement)
magnet.css: traitement photographique, profondeur, réduction/flou des panneaux voisins et magnétisme de défilement
magnet.js: détection du panneau central, animation de profondeur, navigation vers les panneaux et liens ancrés

Le bandeau de navigation principal reste visible. Le menu flottant de droite de V4 a été supprimé.
L’ouverture ECU, le visuel montagne/SSV, les arguments REVX, la page Contact et le formulaire restent disponibles.

Le défilement reste NATIF (pas d’interception des événements de molette). CSS scroll-snap-type: y proximity ajoute un aimant doux.
Sur écrans étroits ou si l’utilisateur demande une réduction des animations, les panneaux reprennent une présentation simple.

Pour ouvrir: index.html dans un navigateur, ou VS Code / Live Server.
Le formulaire contact en PHP doit être testé sur l’hébergement réel avant publication.
Les pages légales restent à compléter.
