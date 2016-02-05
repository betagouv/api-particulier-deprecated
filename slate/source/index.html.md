---
title: API PARTICULIER

language_tabs:
  - shell

toc_footers:
  - <a href='mailto:apiparticulier@sgmap.fr'>Demander un jeton d'accès</a>

includes:
  - impots
  - caf
  - errors

search: true
---

# Introduction

Bienvenue sur API PARTICULIER ! Cette API vous permet de simplifier les démarches
administratives. Il est maintenant possible d'ajouter les informations à la
source et donc de limiter les demandes de pièces justificatives

Nous fournissons des exemples de l'utilisation de l'API avec des commandes cURL.
N'hésitez pas à contribuer pour ajouter des exemples dans les langages que vous
utilisez. Il existe aussi une documentation très complète sur les données de
retour&#8239;: [apiparticulier.sgmap.fr/docs](https://apiparticulier.sgmap.fr/docs/)

API PARTICULIER utilise les principes des
[API REST](http://blog.octo.com/designer-une-api-rest/) pour exposer ses données

# Environnements

Il existe plusieurs environnements:


|             | Domain                       | Documentation                                     | Authentifié |
|-------------|------------------------------|---------------------------------------------------|-------------|
| Production  | apiparticulier.sgmap.fr      |[Lien](https://apiparticulier.sgmap.fr/docs/)      | Oui         |
| Mocks       | apiparticulier-mock.sgmap.fr |[Lien](https://apiparticulier-mock.sgmap.fr/docs/) | Non         |

# Présentation

## Acteurs

Il existe différents acteurs au sein d'API PARTICULIER

 * Les fournisseurs de données : ils n'utilisent pas l'application en tant que tel
 mais fournissent simplement des données
 * Les administrateurs de la plateforme: ils supervisent l'application
 * Les fournisseurs de service : il s'agit des organismes (personnes morales)
 ayant signées la charte et qui souhaite simplifier une démarche administrative
 * Les citoyens français : utilisateur finaux des services
 * Les agents : il s'agit des personnes physiques des fournisseurs de données

API PARTICULIER permet de facilité la récupération d'information aurpès des
fournisseurs de données. Ces informations appartiennent à des citoyens
français qui utilisent un téléservice des fournisseurs de données. Une fois les
informations récupérées, elles sont affichées aux agents assermentés des
fournisseurs de service.

# Autorisations

## Fournisseurs de service
> Pour vérifier votre jeton, vous pouvez utiliser ce code.

```shell
# Avec Curl, il suffit de passer le header HTTP: X-API-KEY
curl https://apiparticulier.sgmap.fr/api/impots/svair \
  -H "X-API-KEY: myKey"
```

> N'oubliez pas de remplacer `myKey` avec votre clé, `1` et `2` par les bons
identifiants.

API PARTICULIER utilise un système de jeton pour **identifier** et **authentifier** les fournisseurs de service. Vous pouvez
demander votre jeton d'authentification en envoyant un mail à
[apiparticulier@sgmap.fr](mailto:apiparticulier@sgmap.fr) en précisant dans quel
projet vous souhaitez intégrer l'API.


Il est nécessaire de s'identifier auprès de l'API avec le jeton lors de chaque
requête HTTP en incluant le jeton dans les headers HTTP comme ceci:

`X-API-KEY: myKey`

<aside class="notice">
Vous devez remplacer <code>myKey</code> avec le jeton d'API de votre collectivité
</aside>

## Le citoyen ou l'agent

```shell
# Avec Curl, il suffit de passer le header HTTP: X-User
curl https://apiparticulier.sgmap.fr/api/impots/svair \
  -H "X-API-KEY: myKey" \
  -H "X-User: myUser"
```

Il est aussi possible d'identifier (sans authentifier) les citoyens ou les
agents ayant déclenchés un appel donné. En effet, en cas de problème ou de
fraude, les fournisseurs de données doivent être en mesure de dire quels étaient
les utilisateurs de l'API PARTICULIER.
C'est pourquoi il existe un header HTTP facultatif `X-User` qui permet
d'identifier l'utilisateur : celui-ci peut être un identifiant interne du
fournisseur de service.


# Format

```shell
# Avec Curl, il suffit de passer le header HTTP: Accept
curl https://apiparticulier.sgmap.fr/api/ping \
  -H "Accept: application/json"
```

> La commande précédente retourne du JSON&#8239;:

```json
"pong"
```

```shell
# Avec Curl, il suffit de passer le header HTTP: Accept
curl https://apiparticulier.sgmap.fr/api/ping \
  -H "Accept: application/xml"
```

> La commande précédante retourne du XML :

```xml
<result>
	<data>pong</data>
</result>
```

L'API propose plusieurs types de données&#8239;:

  * Des données structurées sous format&#8239;:
    * [JSON](https://fr.wikipedia.org/wiki/JavaScript_Object_Notation)
    * [XML](https://fr.wikipedia.org/wiki/Extensible_Markup_Language)
  * Des données non structurées sous format&#8239;:
    * [PDF](https://fr.wikipedia.org/wiki/Portable_Document_Format)
