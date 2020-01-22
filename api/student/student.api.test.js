const serverTest = require('../test/utils/server')
const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')

describe('Etudiant API', function () {
  let mock
  const server = serverTest()
  const api = server.api
  const validIne = 'fakeIne'
  const invalidIne = 'invalidIne'
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

  beforeEach(() => {
    mock = new MockAdapter(axios)
  })

  afterEach(() => {
    mock.reset()
  })

  describe('Ping', () => {
    it('replies a 200', () => {
      mock.onGet('http://sup.data/api/rest.php/ping').reply(200, 'pong')
      return api()
        .get('/api/etudiant/ping')
        .expect(200)
    })

    it('replies a 503 when supdata cannot be reached', () => {
      mock.onGet().networkError()
      return api()
        .get('/api/etudiant/ping')
        .expect(503)
    })

    it('returns a 503 on timeout', () => {
      mock.onGet().timeout()
      return api()
        .get('/api/etudiant/ping')
        .expect(503)
        .expect({
          error: 'service_unavailable',
          message: 'timeout of 3000ms exceeded',
          reason: 'timeout of 3000ms exceeded'
        })
    })
  })

  describe('Student search endpoint', () => {
    it('replies a 200 for a valid ine', () => {
      mock
        .onGet('http://sup.data/api/rest.php/etudiantParIne')
        .reply(200, fakeResponseData)
      return api()
        .get(`/api/etudiant?ine=${validIne}`)
        .set('Accept', '*/*')
        .set('X-User-Id', 'test')
        .set('X-User-Name', 'test')
        .set('X-User-Scopes', 'mesri_statut_etudiant')
        .expect(200)
        .expect(fakeResponseData)
    })

    it('replies a 404 for an invalid ine', () => {
      mock.onGet('http://sup.data/api/rest.php/etudiantParIne').reply(404)
      return api()
        .get(`/api/etudiant?ine=${invalidIne}`)
        .set('Accept', '*/*')
        .set('X-User-Id', 'test')
        .set('X-User-Name', 'test')
        .set('X-User-Scopes', 'mesri_statut_etudiant')
        .expect(404)
    })

    it('hides the out-of-scope data', () => {
      mock
        .onGet('http://sup.data/api/rest.php/etudiantParIne')
        .reply(200, fakeResponseData)
      return api()
        .get(`/api/etudiant?ine=${validIne}`)
        .set('Accept', '*/*')
        .set('X-User-Id', 'test')
        .set('X-User-Name', 'test')
        .set('X-User-Scopes', 'dgfip_avis_imposition')
        .expect(200)
        .expect({})
    })

    it('returns a 503 on network error', () => {
      mock.onGet('http://sup.data/api/rest.php/etudiantParIne').networkError()
      return api()
        .get(`/api/etudiant?ine=${invalidIne}`)
        .set('Accept', '*/*')
        .set('X-User-Id', 'test')
        .set('X-User-Name', 'test')
        .set('X-User-Scopes', 'mesri_statut_etudiant')
        .expect(503)
    })

    it('returns a 503 on timeout', () => {
      mock.onGet().timeout()
      return api()
        .get(`/api/etudiant?ine=${invalidIne}`)
        .set('Accept', '*/*')
        .set('X-User-Id', 'test')
        .set('X-User-Name', 'test')
        .set('X-User-Scopes', 'mesri_statut_etudiant')
        .expect(503)
        .expect({
          error: 'service_unavailable',
          message: 'timeout of 3000ms exceeded',
          reason: 'timeout of 3000ms exceeded'
        })
    })
  })
})
