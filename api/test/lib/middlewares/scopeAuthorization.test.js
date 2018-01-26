const expect = require('chai').expect
const middleware = require('../../../lib/middlewares/scopeAuthorization')
const sinon = require('sinon')

const impotsSvairResponse = {
  'declarant1': {
    'nom': 'Beausoleil',
    'nomNaissance': 'Beausoleil',
    'prenoms': 'Henri',
    'dateNaissance': '13/08/1967'
  },
  'declarant2': {
    'nom': 'Beausoleil',
    'nomNaissance': 'Cervántez',
    'prenoms': 'Armina',
    'dateNaissance': '01/08/1947'
  },
  'dateRecouvrement': '10/10/2017',
  'dateEtablissement': '08/07/2017',
  'nombreParts': 2,
  'situationFamille': 'Marié(e)s',
  'nombrePersonnesCharge': 2,
  'revenuBrutGlobal': 26922,
  'revenuImposable': 26922,
  'impotRevenuNetAvantCorrections': 2165,
  'montantImpot': 2165,
  'revenuFiscalReference': 26922,
  'foyerFiscal': {
    'annee': 2017,
    'adresse': '34 Rue du Petit Chenois 25200 Montbéliard'
  },
  'anneeImpots': '2017',
  'anneeRevenus': '2016'
}

const impotsAdresseResponse = {
  'adresses': [
    {
      'adresse': {
        'postcode': '07700',
        'x': 822243,
        'citycode': '07034',
        'context': '07, Ardèche, Auvergne-Rhône-Alpes (Rhône-Alpes)',
        'type': 'street',
        'city': 'Bidon',
        'label': 'Grand\'Rue 07700 Bidon',
        'y': 6364234.5,
        'importance': 0.0028,
        'name': 'Grand\'Rue',
        'score': 0.2823862068965517
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [
          4.534067,
          44.366457
        ]
      }
    },
    {
      'adresse': {
        'postcode': '74110',
        'x': 986005.4,
        'citycode': '74191',
        'context': '74, Haute-Savoie, Auvergne-Rhône-Alpes (Rhône-Alpes)',
        'type': 'street',
        'city': 'Morzine',
        'label': 'Rue Bidon 74110 Morzine',
        'y': 6570935.7,
        'importance': 0.0318,
        'name': 'Rue Bidon',
        'score': 0.26470909090909095
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [
          6.708774,
          46.177867
        ]
      }
    },
    {
      'adresse': {
        'postcode': '84530',
        'x': 895936.2,
        'citycode': '84147',
        'context': '84, Vaucluse, Provence-Alpes-Côte d\'Azur',
        'type': 'street',
        'city': 'Villelaure',
        'label': 'Rue du Bidon 84530 Villelaure',
        'y': 6293455.2,
        'importance': 0.0247,
        'name': 'Rue du Bidon',
        'score': 0.25792727272727267
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [
          5.431049,
          43.712978
        ]
      }
    },
    {
      'adresse': {
        'postcode': '63700',
        'x': 684701.2,
        'citycode': '63233',
        'context': '63, Puy-de-Dôme, Auvergne-Rhône-Alpes (Auvergne)',
        'type': 'street',
        'city': 'Montaigut',
        'label': 'La Côte Bidon 63700 Montaigut',
        'y': 6565561.4,
        'importance': 0.1069,
        'name': 'La Côte Bidon',
        'score': 0.2354235109717868
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [
          2.801639,
          46.189718
        ]
      }
    },
    {
      'adresse': {
        'postcode': '07700',
        'x': 828965.9,
        'citycode': '07264',
        'context': '07, Ardèche, Auvergne-Rhône-Alpes (Rhône-Alpes)',
        'type': 'street',
        'city': 'Saint-Marcel-d\'Ardèche',
        'label': 'Rue de Bidon 07700 Saint-Marcel-d\'Ardèche',
        'y': 6360072.7,
        'importance': 0.0177,
        'name': 'Rue de Bidon',
        'score': 0.23537532467532463
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [
          4.617342,
          44.327794
        ]
      }
    }
  ],
  'declarant1': {
    'nom': 'Maigret',
    'nomNaissance': 'Maigret',
    'prenoms': 'Jules',
    'dateNaissance': '01/01/1970'
  },
  'declarant2': {
    'nom': 'Maigret',
    'nomNaissance': 'Maigrette',
    'prenoms': 'Juliette',
    'dateNaissance': '01/01/1970'
  },
  'foyerFiscal': {
    'annee': 2020,
    'adresse': '123 Rue Bidon 12345 Condat'
  }
}
const cafFamilleResponse = {
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
}

describe('Middleware : scopeAuthorization', () => {
  describe('the user requests the impots/svair endpoint', () => {
    const res = {
      data: impotsSvairResponse
    }

    it('should let pass dgfip svair data', () => {
      const consumer = {
        _id: 'test',
        name: 'test',
        email: 'test@test.test',
        scopes: ['dgfip']
      }
      const req = {
        consumer: consumer
      }
      const next = sinon.spy()

      middleware(req, res, next)

      expect(next.getCall(0).args.length).to.equal(0)
      expect(res.data).to.equal(impotsSvairResponse)
    })

    it('should not let pass dgfip svair request if there is no scope "dgfip"', () => {
      const req = {
        consumer: {
          scopes: []
        }
      }
      const next = sinon.spy()

      middleware(req, res, next)

      expect(next.getCall(0).args[0].code).to.eq(403)
    })
  })

  describe('the user requests the impots/adresse endpoint', () => {
    const res = {
      data: impotsAdresseResponse
    }

    it('should let pass dgfip adresse data', () => {
      const consumer = {
        _id: 'test',
        name: 'test',
        email: 'test@test.test',
        scopes: ['dgfip']
      }
      const req = {
        consumer: consumer
      }
      const next = sinon.spy()

      middleware(req, res, next)

      expect(next.getCall(0).args.length).to.equal(0)
      expect(res.data).to.equal(impotsAdresseResponse)
    })

    it('should not let pass dgfip svair request if there is no scope "dgfip"', () => {
      const req = {
        consumer: {
          scopes: []
        }
      }
      const next = sinon.spy()

      middleware(req, res, next)

      expect(next.getCall(0).args[0].code).to.eq(403)
    })
  })

  describe('the user requests the caf/famille endpoint', () => {
    const res = {
      data: cafFamilleResponse
    }

    it('should let pass caf famille request', () => {
      const consumer = {
        _id: 'test',
        name: 'test',
        email: 'test@test.test',
        scopes: ['caf']
      }
      const req = {
        consumer: consumer
      }
      const next = sinon.spy()

      middleware(req, res, next)

      expect(next.getCall(0).args.length).to.equal(0)
      expect(res.data).to.equal(cafFamilleResponse)
    })

    it('should not let pass caf famille request if there is no scope "caf"', () => {
      const req = {
        consumer: {
          scopes: []
        }
      }
      const next = sinon.spy()

      middleware(req, res, next)

      expect(next.getCall(0).args[0].code).to.eq(403)
    })
  })
})
