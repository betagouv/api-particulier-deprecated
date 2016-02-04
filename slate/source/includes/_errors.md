# Errors

L'API PARTICULIER utilise les codes retour suivants


Code Erreur | Signification
---------- | -------
400 | Bad Request -- Votre requête est mal formatée
401 | Unauthorized -- Votre jeton d'API n'est pas correct
403 | Forbidden -- Vous n'avez pas accès à cette API
404 | Not Found -- Les données demandées n'existe pas
405 | Method Not Allowed -- Vous n'avez pas utilisé la bonne méthode HTTP
406 | Not Acceptable -- Vous avez demandé un format qui n'est pas supporté
418 | I'm a teapot
429 | Too Many Requests -- Le serveur ne tient pas la charge
500 | Internal Server Error -- Nous, ou un de nos fournisseurs, rencontrons un problème interne, merci de réessayer plus tard
503 | Service Unavailable -- Nous sommes en maintenance, merci de réessayer plus tard
