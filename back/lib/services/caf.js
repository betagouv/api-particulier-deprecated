"use strict";


const request = require('request') ;
const fs = require('fs') ;
const Handlebars = require('handlebars');
const UrlAssembler = require('url-assembler');
const iconv = require('iconv-lite');
const Readable = require('stream').Readable
const parseString = require('xml2js').parseString;
const documentType = require('./caf/typeDocument')
const returnType = require('./caf/typeRetour')
const errors = require('./caf/errors')
const StandardError = require('standard-error')

class CafService {

  constructor(options) {
    this.options = options || {};
    const query = fs.readFileSync( __dirname + '/caf/query.xml', 'utf-8')
    this.queryTemplate = Handlebars.compile(query);
    this.sslCertificate = fs.readFileSync(options.cafSslCertificate);
    this.sslKey = fs.readFileSync(options.cafSslKey)
  }

  getQf(codeOrganisme, numeroAllocataire, callback) {
    this.getData(codeOrganisme, numeroAllocataire, "droits", false, (err, data) => {
      if(err) return callback(err)
      const doc = data["FLUX_TRAFIC"]["DOCUMENT"][0]["CORPS"][0]["ATTPAIDRT"][0]
      const allocataires = doc["IDENTITEPERSONNES"][0]["UNEPERSONNE"].map((item) => {
        return item["NOMPRENOM"][0]
      })
      const quotientData = doc["QUOTIENTS"][0]["QFMOIS"][0]
      const quotientFamilial = Number.parseInt(quotientData["QUOTIENTF"][0])
      const mois = Number.parseInt(quotientData["DUMOIS"][0])
      const annee = Number.parseInt(quotientData["DELANNEE"][0])
      callback(null, {
        allocataires,
        quotientFamilial,
        mois,
        annee
      })
    })
  }

  getAdress(codeOrganisme, numeroAllocataire, callback) {
    this.getData(codeOrganisme, numeroAllocataire, "droits", false, (err, data) => {
      if(err) return callback(err)
      const doc = data["FLUX_TRAFIC"]["DOCUMENT"][0]
      const header = doc["ENTETE"][0]
      const body = doc["CORPS"][0]["ATTPAIDRT"][0]
      const allocataires = body["IDENTITEPERSONNES"][0]["UNEPERSONNE"].map((item) => {
        return item["NOMPRENOM"][0]
      })
      const adress = header["ADRESSE"][0]
      const mois = Number.parseInt(header["DUMOIS"][0])
      const annee = Number.parseInt(header["DELANNEE"][0])
      const adresse = {
        identite: adress["LIBLIG1ADR"][0],
        complementIdentite: adress["LIBLIG2ADR"][0],
        complementIdentiteGeo: adress["LIBLIG3ADR"][0],
        numeroRue: adress["LIBLIG4ADR"][0],
        lieuDit: adress["LIBLIG5ADR"][0],
        codePostalVille: adress["LIBLIG6ADR"][0],
        pays: adress["LIBLIG7ADR"][0]
      }

      callback(null, {
        adresse,
        allocataires,
        mois,
        annee
      })
    })
  }

  getFamily(codeOrganisme, numeroAllocataire, callback) {
    this.getData(codeOrganisme, numeroAllocataire, "droits", false, (err, data) => {
      if(err) return callback(err)
      const doc = data["FLUX_TRAFIC"]["DOCUMENT"][0]
      const body = doc["CORPS"][0]["ATTPAIDRT"][0]
      const allocataires = body["IDENTITEPERSONNES"][0]["UNEPERSONNE"].map((item) => {
          return {
            nomPrenom: item["NOMPRENOM"][0],
            dateDeNaissance: item["DATNAISS"][0],
            sexe: item["SEXE"][0]
          }
        })
      const enfants = body["IDENTITEENFANTS"][0]["UNENFANT"].map((item) => {
          return {
            nomPrenom: item["NOMPRENOM"][0],
            dateDeNaissance: item["DATNAISS"][0],
            sexe: item["SEXE"][0]
          }
        })
        callback(null, {
          enfants,
          allocataires
        })

    })
  }


  getAttestation(codeOrganisme, numeroAllocataire, type, callback) {
    return this.getData(codeOrganisme, numeroAllocataire, type, true, callback)
  }

  getData(codeOrganisme, numeroAllocataire, type, pdfRequired, callback) {
    var self = this;

    const typeEnvoi = pdfRequired == true ? returnType.pdf : returnType.structured
    const typeDocument =  documentType[type]
    const parameters = {
      typeEnvoi,
      codeOrganisme ,
      numeroAllocataire,
      typeDocument
    }
    const queryWithParameters = this.queryTemplate(parameters);
    const url = UrlAssembler(this.options.cafHost)
                  .template('/sgmap/wswdd/v1')
                  .toString();

    const onSuccess = pdfRequired ?
                        this.returnPdf(self, callback) :
                        this.returnStructuredData(self, callback)

    request
        .post({
            url: url,
            body: queryWithParameters,
            headers: { 'Content-Type': 'text/xml; charset=utf-8' },
            gzip: true,
            cert: this.sslCertificate,
            key: this.sslKey,
            rejectUnauthorized: false,
            timeout: 10000,
            encoding: null
        })
        .on('error', err => callback(err))
        .on('response', onSuccess);
  }

  returnPdf(self, callback) {
    return (res) => {
      if (res.statusCode !== 200) return callback(new StandardError('Request error', { code: 500 }));
      res.pipe(iconv.decodeStream('latin1')).collect(function(err, decodedBody) {
        if(err) return callback(err)
        if(self.hasBodyError(decodedBody)) return callback(new StandardError("The service has an error " + res.statusCode, { code: 500 }))
        var pdfText = self.getSecondPart(decodedBody);
        var pdfBuffer = iconv.encode(pdfText, 'latin1');
        callback(null, pdfBuffer);
      });
    }
  }

  returnStructuredData(self, callback) {
    return (res) => {
      if (res.statusCode !== 200) return callback(new StandardError('Request error', { code: 500 }));
      res.pipe(iconv.decodeStream('latin1')).collect(function(err, decodedBody) {
        if(err) callback(err)
        parseString(self.getFirstPart(decodedBody), (err, result) => {
          const returnData = result["soapenv:Envelope"]["soapenv:Body"][0]["ns2:demanderDocumentWebResponse"][0]["return"][0]["beanRetourDemandeDocumentWeb"][0]
          const returnCode = returnData["codeRetour"][0]
          if(returnCode != 0) {
            const error = errors[returnCode]
            return callback(new StandardError(error.msg, { code: error.code }))
          }
          parseString(returnData["fluxRetour"][0], (err, result) => {
            callback(err, result)
          })
        });
      });
    }
  }

  hasBodyError(body){
    return body.indexOf("<codeRetour>0</codeRetour>") < 0
  }

  getSecondPart(body) {
    return this.getPart(2, body)
  }

  getFirstPart(body) {
    return this.getPart(1, body)
  }

  getPart(part, body) {
    var lines = body.split('\n');
    var separatorFound= 0;
    var newBody ='';
    for(var line = 0; line < lines.length; line++){
      if(lines[line].indexOf('--MIMEBoundaryurn_uuid_') === 0) {
        separatorFound++
        line += 2
      } else {
        if(separatorFound === part) {
          newBody += lines[line]+"\n"
        }
      }
    }
    return newBody;
  }
}

module.exports = CafService;
