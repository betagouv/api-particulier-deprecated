const express = require('express')
const { ping, injectClient, fetch } = require('api-caf/lib/components')
const { ClientError } = require('api-caf/lib/client')
const Auth = require('../auth/auth')
const fs = require('fs')

module.exports = function (options) {
  const router = express.Router()
  const auth = new Auth(options)

  if (options.cafStub) {
    router.use(function fakeClient (req, res, next) {
      req.client = {
        getAll (codePostal, numeroAllocataire) {
          if (codePostal === '99148' && numeroAllocataire === '0000354') {
            return Promise.resolve({
              'allocataires': [
                {
                  'nomPrenom': 'MARIE DUPONT',
                  'dateDeNaissance': '12111971',
                  'sexe': 'F'
                },
                {
                  'nomPrenom': 'JEAN DUPONT',
                  'dateDeNaissance': '18101969',
                  'sexe': 'M'
                }
              ],
              'enfants': [
                {
                  'nomPrenom': 'LUCIE DUPONT',
                  'dateDeNaissance': '11122016',
                  'sexe': 'F'
                }
              ],
              'adresse': {
                'identite': 'Madame MARIE DUPONT',
                'complementIdentiteGeo': 'ESCALIER B',
                'numeroRue': '123 RUE BIDON',
                'codePostalVille': '12345 CONDAT',
                'pays': 'FRANCE'
              },
              'quotientFamilial': 1754,
              'mois': 4,
              'annee': 2017
            })
          } else {
            return Promise.reject(new ClientError(133))
          }
        }
      }
      return next()
    })
  } else {
    router.use(injectClient({
      host: options.cafHost,
      cert: fs.readFileSync(options.cafSslCertificate),
      key: fs.readFileSync(options.cafSslKey)
    }))
  }

  router.get('/ping', ping(options.cafPingParams))
  router.get('/famille', auth.canAccessApi, fetch())

  return router
}
