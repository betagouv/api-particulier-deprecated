const sinonChai = require('sinon-chai')
const chai = require('chai')
chai.use(sinonChai)
chai.should()
const expect = chai.expect
const serverTest = require('../test/utils/server')
const nock = require('nock')

describe('Etudiant API', function () {
  const server = serverTest()
  const api = server.api
  const validIne = 'fakeIne'
  const invalidIne = 'invalidIne'
  const apiKey = 'georges-moustaki'
  const fakeResponseData = {
    ine: '0102014544Z',
    nomFamille: 'GARCIA',
    prenom: 'CEDRIC',
    inscriptions: [
      {
        dateDebutInscription: '2019-11-20',
        dateFinInscription: '2020-11-20',
        statut: 'admis',
        etablissement: {
          uai: '0731499H',
          codePostal: '73381',
          codeCommune: '73051',
          codeRegion: '084'
        }
      },
      {
        dateDebutInscription: '2019-11-20',
        dateFinInscription: '2020-08-31',
        statut: 'admis',
        etablissement: {
          uai: '0691774D',
          codePostal: null,
          codeCommune: null,
          codeRegion: null
        }
      }
    ]
  }

  this.beforeEach(() => {
    nock('http://sup.data/api/rest.php')
      .get('/ping')
      .reply(200, 'pong')

    nock('http://sup.data/api/rest.php', {
      reqHeader: {
        'X-API-KEY': apiKey
      }
    })
      .get('/etudiantParIne')
      .query({
        INE: validIne
      })
      .reply(200, fakeResponseData)

    nock('http://sup.data/api/rest.php', {
      reqHeader: {
        'X-API-KEY': apiKey
      }
    })
      .get('/etudiantParIne')
      .query({
        INE: invalidIne
      })
      .reply(404, {
        message: 'rest_student_not_found',
        uid: '5e25cc78797ca_0000',
        details: 'rest_student_not_found'
      })
  })

  describe('Ping', () => {
    it('replies a 200', () => {
      return api()
        .get('/api/etudiant/ping')
        .expect(200)
    })
  })

  describe('Student search endpoint', () => {
    it('replies a 200 for a valid ine', (done) => {
      api()
        .get(`/api/etudiant?ine=${validIne}`)
        .set('Accept', '*/*')
        .set('X-User-Id', 'test')
        .set('X-User-Name', 'test')
        .set('X-User-Scopes', 'mesri_statut_etudiant')
        .expect(200)
        .end((req, res) => {
          expect(res.body).to.deep.equal(fakeResponseData)
          done()
        })
    })

    it('replies a 404 for an invalid ine', () => {
      return api()
        .get(`/api/etudiant?ine=${invalidIne}`)
        .set('Accept', '*/*')
        .set('X-User-Id', 'test')
        .set('X-User-Name', 'test')
        .set('X-User-Scopes', 'mesri_statut_etudiant')
        .expect(404)
    })

    it('hides the out-of-scope data', (done) => {
      api()
        .get(`/api/etudiant?ine=${validIne}`)
        .set('Accept', '*/*')
        .set('X-User-Id', 'test')
        .set('X-User-Name', 'test')
        .set('X-User-Scopes', 'dgfip_avis_imposition')
        .expect(200)
        .end((req, res) => {
          expect(res.body).to.deep.equal({})
          done()
        })
    })
  })
})
