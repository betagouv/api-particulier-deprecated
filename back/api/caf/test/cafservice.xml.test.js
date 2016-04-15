'use strict';

const expect = require('chai').expect;
const CafService = require('./../caf.service')
const fs = require('fs');
const nock = require('nock');
const httpJson = require('./../../test/resources/caf/xml/response.json')
const StandardError = require('standard-error')



describe('Caf Service', () => {
  const resourcePath = __dirname + '/../../test/resources'

  var cafService = new CafService({
    cafHost: 'https://pep-test.caf.fr',
    cafSslCertificate: resourcePath + '/server.csr',
    cafSslKey: resourcePath + '/server.key'
  });

  const httpResponse = fs.readFileSync(resourcePath + '/caf/xml/httpResponse.txt','utf-8');
  const xml = fs.readFileSync(resourcePath + '/caf/xml/httpResponse.xml','utf-8');
  const xmlHttpFunctionnalError = fs.readFileSync(resourcePath + '/caf/xml/httpFunctionnalError.txt','utf-8');
  const xmlHttpTechError = fs.readFileSync(resourcePath + '/caf/xml/httpTechError.txt','utf-8');


  describe("get first part of body", () => {
    it('the first xml', () => {
      var actual = cafService.getFirstPart(httpResponse);
      expect(actual).to.be.equal(xml)
    });
  });

  describe("when requesting the droits xml", () => {
    let cafCall
    describe("when the WS return the correct data", () => {
      beforeEach(() => {
        cafCall = nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1', function(body){
             return body.indexOf("<codePostal>toto</codePostal>") >= 0 &&
             body.indexOf("<matricule>tutu</matricule>") >= 0 &&
             body.indexOf("<typeEnvoi>4</typeEnvoi>") >= 0 &&
              body.indexOf("<typeDocument>4</typeDocument>") >= 0
          })
          .reply(200, httpResponse);
      })

      it("return the data",(done) => {
        cafService.getData("toto", "tutu", "droits", false, (err, data) => {
          if(err) return done(err)
          cafCall.done();
          expect(data).to.deep.equal(httpJson);
          nock.cleanAll();
          done()
        });
      })

      describe("when getting the quotient familial data", () => {
        it("return the quotient familiale with the user and the date", (done) => {
          cafService.getQf("toto", "tutu", (err, data) => {
            if(err) return done(err)
            expect(data).to.deep.equal({
              quotientFamilial: 345,
              mois: 12,
              annee: 2015,
              allocataires: ["Marine Martin", "Jean Martin"]
            });
            nock.cleanAll();
            done()
          });
        })
      })

      describe("when getting the adress data", () => {
        it("return the adress", (done) => {
          cafService.getAdress("toto", "tutu", (err, data) => {
            if(err) return done(err)
            expect(data).to.deep.equal({
              adresse: {
                identite: "Madame Marine Martin",
                complementIdentite: "",
                complementIdentiteGeo: "",
                numeroRue: "26 Rue Pasteur",
                lieuDit: "",
                codePostalVille: "14360 TROUVILLE SUR MER",
                pays: "FRANCE"
              },
              mois: 12,
              annee: 2015,
              allocataires: ["Marine Martin", "Jean Martin"]
            });
            nock.cleanAll();
            done()
          });
        })
      })

      describe("when getting the family data", () => {
        it("return the family with the parents and the children", (done) => {
          cafService.getFamily("toto", "tutu", (err, data) => {
            if(err) return done(err)
            expect(data).to.deep.equal({
              allocataires: [
                {
                  nomPrenom: "Marine Martin",
                  dateDeNaissance: "17111961",
                  sexe: 'F'
                },
                {
                  nomPrenom: "Jean Martin",
                  dateDeNaissance: "17071959",
                  sexe: 'M'
                }],
              enfants: [
                {
                  nomPrenom: "Marie Martin",
                  dateDeNaissance: "18061996",
                  sexe: 'F'
                },
                {
                  nomPrenom: "Pierre Martin",
                  dateDeNaissance: "23092000",
                  sexe: 'M'
                }
              ]
            });
            nock.cleanAll();
            done()
          });
        })
      })
    })

    describe("when the WS return an http error", () => {
      beforeEach(() => {
        cafCall = nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(500, httpResponse);
      })

      it("return an error",(done) => {
        cafService.getData("toto", "tutu", "droits", false, (err, data) => {
          cafCall.done();
          expect(err).to.deep.equal(new StandardError("Request error", {code: 500}));
          expect(data).to.deep.equal(undefined);
          nock.cleanAll();
          done()
        });
      })

      describe("when getting the quotient familial data", () => {
        it("return the quotient familiale with the user and the date", (done) => {
          cafService.getQf("toto", "tutu", (err, data) => {
            expect(err).to.deep.equal(new StandardError("Request error", {code: 500}));
            expect(data).to.deep.equal(undefined);
            nock.cleanAll();
            done()
          });
        })
      })

      describe("when getting the adress data", () => {
        it("return an error", (done) => {
          cafService.getAdress("toto", "tutu", (err, data) => {
            expect(err).to.deep.equal(new StandardError("Request error", {code: 500}));
            expect(data).to.deep.equal(undefined);
            nock.cleanAll();
            done()
          });
        })
      })

      describe("when getting the family data", () => {
        it("return an error", (done) => {
          cafService.getFamily("toto", "tutu", (err, data) => {
            expect(err).to.deep.equal(new StandardError("Request error", {code: 500}));
            expect(err.message).to.deep.equal("Request error");
            expect(data).to.deep.equal(undefined);
            nock.cleanAll();
            done()
          });
        })
      })
    })

    describe("when the WS return an functional error", () => {
      beforeEach(() => {
        cafCall = nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(200, xmlHttpFunctionnalError);
      })

      it("return an StandardError",(done) => {
        cafService.getData("toto", "tutu", "droits", false, (err, data) => {
          cafCall.done();
          expect(err).to.deep.equal(new StandardError("Il existe au moins un enfant pour lequel il existe un droit sur le dossier et/ou après la date de situation demandée", {code: 400}));
          expect(data).to.deep.equal(undefined);
          nock.cleanAll();
          done()
        });
      })
    })

    describe("when the WS return an tech error", () => {
      beforeEach(() => {
        cafCall = nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(200, xmlHttpTechError);
      })

      it("return an StandardError",(done) => {
        cafService.getData("toto", "tutu", "droits", false, (err, data) => {
          cafCall.done();
          expect(err).to.deep.equal(new StandardError("Votre demande n'a pu aboutir en raison d'un incident technique lié à l'appel au service IMC. Des paramètres manquent.", {code: 500}));
          expect(data).to.deep.equal(undefined);
          nock.cleanAll();
          done()
        });
      })
    })

  })


});
