REVX SYSTEMS — V3 + PAGE CONTACT
================================

DOSSIER PRÊT À OUVRIR DANS VS CODE
---------------------------------
- index.html           : landing page V3, avec les liens Contact mis à jour
- contact.html         : nouvelle page Contact raccord avec la V3
- style.css            : styles communs de la V3
- contact.css          : styles propres à la page Contact
- script.js            : navigation et menu mobile (V3)
- contact.js           : présélection du sujet + retour d'état du formulaire
- envoyer-contact.php : ancien traitement désactivé (aucun envoi)
- assets/              : logo original et images
- confidentialite.html / mentions-legales.html : modèles à compléter

MODIFICATIONS APPORTÉES À LA LANDING PAGE
----------------------------------------
Seuls les liens de contact ont été adaptés :
- barre de navigation et menu mobile : contact.html
- bouton de bas de page : contact.html
- demande de prestation : contact.html?objet=prestation
- bouton solution REVX : contact.html?objet=solution
Le design de la V3 reste inchangé.

PRÉVISUALISATION LOCALE
-----------------------
Dans VS Code, ouvre ce dossier.
L'extension « Live Server » est suffisante pour VISUALISER les pages statiques.
Ouvre index.html puis clique sur Contact, ou ouvre directement contact.html.

Le script désactive volontairement les envois depuis localhost, 127.0.0.1,
[::1] et les fichiers HTML locaux. Tu peux tester la présentation et la
validation des champs, pas l'envoi.

FORMULAIRE FORMSUBMIT AJAX
-------------------------
Le site est statique. contact.html envoie directement à l'URL FormSubmit AJAX
définie dans l'attribut action ; envoyer-contact.php n'intervient pas.
Le destinataire associé à l'identifiant FormSubmit se vérifie chez ce prestataire.

Déployer ensemble contact.html et contact.js. Le paramètre de version du script
dans contact.html permet d'éviter une ancienne copie en cache après publication.
La page merci.html n'est affichée qu'après une réponse HTTP valide, JSON, avec
success égal à true (booléen ou chaîne) et sans indicateur d'erreur.

Après 15 secondes, le visiteur est invité à patienter ; après 60 secondes,
l'attente est interrompue et l'absence de confirmation est signalée. Une coupure
réseau, une réponse illisible ou une erreur HTTP (y compris 522/524) ne permet
pas de savoir si un e-mail a déjà été envoyé. Aucun renvoi automatique n'a lieu.
La saisie est conservée et les doubles clics sont bloqués pendant la requête.

VÉRIFICATIONS
-------------
node --test tests/contact.test.cjs
Ces tests simulent le service et ne transmettent aucune donnée à FormSubmit.
Pour vérifier la réception réelle, faire ensuite un essai identifié depuis le
site publié et contrôler la boîte de réception, les indésirables et, si besoin,
les journaux de la messagerie. Une réponse de succès du service ne constitue
pas une preuve de livraison finale dans la boîte de réception.

DIAGNOSTIC DU 20 OCTOBRE 2026
---------------------------
Le script lu sur https://www.revx-systems.fr/contact.js interrompait l'attente
au bout de 20 secondes et affichait systématiquement un échec en cas d'absence
de confirmation. Cela peut expliquer un e-mail reçu malgré l'échec affiché.
La modification locale qui redirigeait après 5 secondes ou sur HTTP 522/524
masquait l'incertitude et a été remplacée par le comportement décrit ci-dessus.
La requête OPTIONS de contrôle à FormSubmit autorisait l'origine du site.
Aucun formulaire réel n'a été envoyé pendant ce diagnostic : la cause des
messages non reçus reste à établir côté FormSubmit et messagerie.

POINTS À COMPLÉTER AVANT PUBLICATION
------------------------------------
- Vérifier l'adresse e-mail de réception.
- Compléter mentions légales et politique de confidentialité, notamment les
  durées de conservation et les informations relatives au formulaire.
- Effectuer les tests sur ordinateur et mobile après mise en ligne.
- Les photographies restent des illustrations provisoires, comme sur la V3.

Aucun changement n'a été fait sur www.revx-systems.fr.
