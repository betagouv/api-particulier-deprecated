const nock = require('nock');
const serverTest = require('./../../test/utils/server')
const {expect} = require('chai')

describe('CAF API', function () {
  const server = serverTest();
  const api = server.api;

  describe('Ping', () => {
      beforeEach(() => {
      nock('https://pep-test.caf.fr')
        .post('/sgmap/wswdd/v1', fakePepPingRequest)
        .reply(200, fakePepResponse)
      });

    it('replies a 200', () => {
      return api()
        .get('/api/caf/ping')
        .expect(200)
    })
  })

  describe('When getting CAF informations', () => {
    describe('Without query parameters', () => {
      it('replies a 400', () => {
        return api()
          .get('/api/caf/famille')
          .set('Accept', '*/*')
          .expect(400)
      })
    })

    describe('With query parameters', (done) => {
      beforeEach(() => {
      nock('https://pep-test.caf.fr')
        .post('/sgmap/wswdd/v1', fakePepRequest)
        .reply(200, fakePepResponse)
      })

      it("replies 200", () => {
        return api()
          .get('/api/caf/famille')
          .query(fakeQuery)
          .expect(200)
      })

      it("replies the good json response", () => {
        return api()
          .get('/api/caf/famille')
          .query(fakeQuery)
          .then((res) => {
            expect(res.body).to.deep.equal(fakeResponse)
          })
      })
    })
  })
})

const fakePepRequest = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tns=\"http://v1.ws.wsdemandedocumentcafweb.cnaf/\">\n    <soap:Header/>\n    <soap:Body>\n        <tns:demanderDocumentWeb xmlns:tns=\"http://v1.ws.wsdemandedocumentcafweb.cnaf/\">\n            <arg0>\n                <app>WDD</app>\n                <id>?</id>\n                <beanEntreeDemandeDocumentWeb>\n                    <codeAppli>WDD</codeAppli>\n                    <codePostal>75008</codePostal>\n                    <matricule>1235306</matricule>\n                    <typeDocument>4</typeDocument>\n                    <typeEnvoi>5</typeEnvoi>\n                </beanEntreeDemandeDocumentWeb>\n            </arg0>\n        </tns:demanderDocumentWeb>\n    </soap:Body>\n</soap:Envelope>"
const fakePepPingRequest = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tns=\"http://v1.ws.wsdemandedocumentcafweb.cnaf/\">\n    <soap:Header/>\n    <soap:Body>\n        <tns:demanderDocumentWeb xmlns:tns=\"http://v1.ws.wsdemandedocumentcafweb.cnaf/\">\n            <arg0>\n                <app>WDD</app>\n                <id>?</id>\n                <beanEntreeDemandeDocumentWeb>\n                    <codeAppli>WDD</codeAppli>\n                    <codePostal>00000</codePostal>\n                    <matricule>0000000</matricule>\n                    <typeDocument>4</typeDocument>\n                    <typeEnvoi>5</typeEnvoi>\n                </beanEntreeDemandeDocumentWeb>\n            </arg0>\n        </tns:demanderDocumentWeb>\n    </soap:Body>\n</soap:Envelope>"

const fakePepResponse = "--MIMEBoundaryurn_uuid_D555A7429610CCCBBB1493716971820\r\nContent-Type: application/xop+xml; charset=utf-8; type=\"text/xml\"\r\nContent-Transfer-Encoding: binary\r\nContent-ID: <0.urn:uuid:9BA817A2C44B237B741493717501717@apache.org>\r\n\r\n<?xml version='1.0' encoding='utf-8'?><soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"><soapenv:Body><ns2:demanderDocumentWebResponse xmlns:ns2=\"http://v1.ws.wsdemandedocumentcafweb.cnaf/\"><return><beanRetourDemandeDocumentWeb><codeRetour>0</codeRetour><fluxRetour>&lt;?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n&lt;drtData>\n    &lt;adresse>\n        &lt;LIBLIG1ADR>Madame MARIE DUPONT&lt;/LIBLIG1ADR>\n        &lt;LIBLIG2ADR>&lt;/LIBLIG2ADR>\n        &lt;LIBLIG3ADR>ESCALIER B&lt;/LIBLIG3ADR>\n        &lt;LIBLIG4ADR>123 RUE BIDON&lt;/LIBLIG4ADR>\n        &lt;LIBLIG5ADR>&lt;/LIBLIG5ADR>\n        &lt;LIBLIG6ADR>12345 CONDAT&lt;/LIBLIG6ADR>\n        &lt;LIBLIG7ADR>FRANCE&lt;/LIBLIG7ADR>\n    &lt;/adresse>\n    &lt;identeEnfants>\n        &lt;UNENFANT>\n            &lt;NOMPRENOM>BENJAMINE DUPONT&lt;/NOMPRENOM>\n            &lt;DATNAISS>10082016&lt;/DATNAISS>\n            &lt;SEXE>M&lt;/SEXE>\n        &lt;/UNENFANT>\n    &lt;/identeEnfants>\n    &lt;identePersonnes>\n        &lt;UNEPERSONNE>\n            &lt;QUAL>Madame&lt;/QUAL>\n            &lt;NOMPRENOM>MARIE DUPONT&lt;/NOMPRENOM>\n            &lt;DATNAISS>12111988&lt;/DATNAISS>\n            &lt;SEXE>F&lt;/SEXE>\n        &lt;/UNEPERSONNE>\n        &lt;UNEPERSONNE>\n            &lt;QUAL>Monsieur&lt;/QUAL>\n            &lt;NOMPRENOM>JEAN DUPONT&lt;/NOMPRENOM>\n            &lt;DATNAISS>18101988&lt;/DATNAISS>\n            &lt;SEXE>M&lt;/SEXE>\n        &lt;/UNEPERSONNE>\n    &lt;/identePersonnes>\n    &lt;quotients>\n        &lt;QFMOIS>\n            &lt;DUMOIS>4&lt;/DUMOIS>\n            &lt;DELANNEE>2017&lt;/DELANNEE>\n            &lt;QUOTIENTF>1998&lt;/QUOTIENTF>\n        &lt;/QFMOIS>\n    &lt;/quotients>\n&lt;/drtData>\n</fluxRetour><libelleRetour>Votre demande est bien enregistrée. Un document vous sera adressé à votre domicile dans les prochains jours.</libelleRetour></beanRetourDemandeDocumentWeb></return></ns2:demanderDocumentWebResponse></soapenv:Body></soapenv:Envelope>\r\n--MIMEBoundaryurn_uuid_D555A7429610CCCBBB1493716971820--"

const fakeQuery = {codePostal: '75008', numeroAllocataire: '1235306'}
const fakeResponse = { allocataires:
   [ { nomPrenom: 'MARIE DUPONT',
       dateDeNaissance: '12111988',
       sexe: 'F' },
     { nomPrenom: 'JEAN DUPONT',
       dateDeNaissance: '18101988',
       sexe: 'M' } ],
  enfants:
   [ { nomPrenom: 'BENJAMINE DUPONT',
       dateDeNaissance: '10082016',
       sexe: 'M' } ],
  adresse:
   { identite: 'Madame MARIE DUPONT',
     complementIdentiteGeo: 'ESCALIER B',
     numeroRue: '123 RUE BIDON',
     codePostalVille: '12345 CONDAT',
     pays: 'FRANCE' },
  quotientFamilial: 1998,
  mois: 4,
  annee: 2017 }
