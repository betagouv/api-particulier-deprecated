# Impots


## Récupérer les données fiscales d'un citoyen

```shell
curl "https://particulier-test.api.gouv.fr/api/impots/svair?numeroFiscal=12&referenceAvis=15" \
  -H "X-API-KEY: test-token" \
  -H "accept: application/json" \
  -H "X-User: demo"
```

> Cette commande retournera du json

Cette URL permet de récupérer les données présentes sur un avis d'imposition

### HTTP Request

`GET https://particulier.api.gouv.fr/api/impots/svair`

### Query Parameters

Paramètre | Défault | Obligatoire | Description
--------- | ------- | ----------|------
numeroFiscal | Non | Oui | Numéro fiscal propre à chaque citoyen (identifiant numérique de 13 chiffres)
referenceAvis | Non | Oui | Référence de l'avis fiscal correspond à l'année de l'avis (identifiant alpha-numérique de 13 chiffres)

<aside class="warning">
Attention, il est possible que l'utilisateur ajoute une quatorzième lettre à la
fin de sa référence d'avis, il est nécessaire de l'enlever avant de l'envoyer
sur l'API Particulier
</aside>

## Récupérer l'adresse fiscale

```shell
curl "https://particulier-test.api.gouv.fr/api/impots/adress?numeroFiscal=12&referenceAvis=15" \
  -H "X-API-KEY: test-token" \
  -H "Accept: application/xml" \
  -H "X-User: demo"
```
> Cette commande retournera du xml


Cette URL permet de géolocaliser l'adresse du foyer fiscale

### HTTP Request

`GET https://particulier.api.gouv.fr/api/impots/adress`

### Query Parameters

Paramètre | Défault | Obligatoire | Description
--------- | ------- | ----------|------
numeroFiscal | Non | Oui | Numéro fiscal propre à chaque citoyen (identifiant numérique de 13 chiffres)
referenceAvis | Non | Oui | Référence de l'avis fiscal correspond à l'année de l'avis (identifiant alpha-numérique de 13 chiffres)


<aside class="warning">
Attention, il est possible que l'utilisateur ajoute une quatorzième lettre à la
fin de sa référence d'avis, il est nécessaire de l'enlever avant de l'envoyer
sur l'API Particulier
</aside>
