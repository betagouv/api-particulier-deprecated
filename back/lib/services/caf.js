"use strict";


const request = require('request') ;
const fs = require('fs') ;
const Handlebars = require('handlebars');
const UrlAssembler = require('url-assembler');
const iconv = require('iconv-lite');
const Readable = require('stream').Readable
const parseString = require('xml2js').parseString;

// L'ordre des paramètres de la requêtes est important
const query =`<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://v1.ws.wsdemandedocumentweb.cnaf/">
    <soap:Header/>
    <soap:Body>
        <tns:demanderDocumentWeb xmlns:tns="http://v1.ws.wsdemandedocumentweb.cnaf/">
            <arg0>
                <app>WAT</app>
                <id>?</id>
                <beanEntreeDemandeDocumentWeb>
                    <codeAppli>WAT</codeAppli>
                    <codeOrganisme>{{ codeOrganisme }}</codeOrganisme>
                    <codePrestation>AF</codePrestation>
                    <codeSituation>1</codeSituation>
                    <matricule>{{numeroAllocataire}}</matricule>
                    <typeDocument>{{ typeDocument }}</typeDocument>
                    <typeEnvoi>{{ typeEnvoi }}</typeEnvoi>
                </beanEntreeDemandeDocumentWeb>
            </arg0>
        </tns:demanderDocumentWeb>
    </soap:Body>
</soap:Envelope>`;


const documentType = {
  paiement: 0,
  qf: 2,
  allocataire: 3,
  droits: 4
}

const returnType = {
  pdf: 3,
  structured: 4
}

class CafService {

  constructor(options) {
    this.options = options || {};
    this.queryTemplate = Handlebars.compile(query);
    this.sslCertificate = fs.readFileSync(options.cafSslCertificate);
    this.sslKey = fs.readFileSync(options.cafSslKey);
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
      if (res.statusCode !== 200) return callback(new Error('Request error'));
      res.pipe(iconv.decodeStream('latin1')).collect(function(err, decodedBody) {
        if(err) return callback(err)
        if(self.hasBodyError(decodedBody)) return callback(new Error("The service has an error " + res.statusCode))
        var pdfText = self.getSecondPart(decodedBody);
        var pdfBuffer = iconv.encode(pdfText, 'latin1');
        callback(null, pdfBuffer);
      });
    }
  }

  returnStructuredData(self, callback) {
    return (res) => {
      if (res.statusCode !== 200) return callback(new Error('Request error'));
      res.pipe(iconv.decodeStream('latin1')).collect(function(err, decodedBody) {
        if(err) callback(err)
        parseString(self.getFirstPart(decodedBody), (err, result) => {
          const returnData = result["soapenv:Envelope"]["soapenv:Body"][0]["ns2:demanderDocumentWebResponse"][0]["return"][0]["beanRetourDemandeDocumentWeb"][0]
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
