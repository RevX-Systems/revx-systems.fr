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
- envoyer-contact.php : traitement du formulaire sur hébergement PHP
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

IMPORTANT : « Live Server » ne traite pas le PHP. Le formulaire ne peut pas
réellement envoyer d'e-mail via Live Server ou un simple fichier HTML local.
Tu peux tester la présentation et la validation des champs, pas l'envoi.

FORMULAIRE SUR INFOMANIAK / HÉBERGEMENT PHP
-------------------------------------------
1. Déploie tous les fichiers, y compris envoyer-contact.php, sur un hébergement
   PHP actif. Ne publie pas uniquement contact.html.
2. Le script adresse les demandes à contact@revx-systems.fr, actuellement défini
   dans les constantes REVX_DESTINATION et REVX_SENDER au début du fichier PHP.
3. Fais un VRAI essai depuis le site déployé, puis vérifie la boîte de réception
   et le dossier Indésirables. La disponibilité et la délivrabilité de mail()
   dépendent de la configuration de l'hébergement.
4. Si PHP mail() n'est pas autorisé ou ne remet pas les messages, il faudra
   adapter l'envoi au SMTP de l'hébergeur (authentification + bibliothèque mail).
5. Un piège anti-robot et un contrôle basique du délai de saisie sont inclus,
   mais ils ne remplacent pas une protection antispam plus forte si nécessaire.

POINTS À COMPLÉTER AVANT PUBLICATION
------------------------------------
- Vérifier l'adresse e-mail de réception.
- Compléter mentions légales et politique de confidentialité, notamment les
  durées de conservation et les informations relatives au formulaire.
- Effectuer les tests sur ordinateur et mobile après mise en ligne.
- Les photographies restent des illustrations provisoires, comme sur la V3.

Aucun changement n'a été fait sur www.revx-systems.fr.
