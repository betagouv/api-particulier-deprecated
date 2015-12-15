Tracabilité
===========

L'objectif de ce document est de décrire les moyens utilisés pour tracer les
appels HTTP entrants et sortants d'API PARTICULIER.

Acteurs
-------

Il existe différents acteurs au sein d'API PARTICULIER

 * Les fournisseurs de données: ils n'utilisent pas l'application en tant que template
 mais fournissent juste des données
 * Les administrateurs de la platforme: ils supervisent l'application
 * Les consommateurs : il s'agit des organismes (personnes morales) ayant signés
 la charte
 * Les utilisateurs: il s'agit des agents (personnes physiques) des organismes
 consommateurs.

En signant la charte, les consommateurs sont identifiés et authentifiés, alors
que l'identification de l'utilisateur est optionnelle. Néanmoins les
consommateurs certifient pouvoir retrouver l'identité de l'utilisateur en cas de
problème.

Lorsque qu'une requête HTTP arrive :
 1. On attribue un identifiant unique à la requêtable : l'identifiant de corrélation
 2. On log les requetes entrantes avec :
  * l'identifiant de corrélation
  * l'identité de l'utilisateur
  * l'identité du consommateurs
  * la date
  * l'url
 2. On log les requetes sortantes vers les fournisseurs de données avec :
  * l'identifiant de corrélation
  * la date
  * l'url

Toutes ces données sont agrégées dans Elasticsearch et il est possible de les
requêter depuis Kibana.
