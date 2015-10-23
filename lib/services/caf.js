var request = require('request') ;
var fs = require('fs') ;

// L'ordre des paramètres de la requêtes est important
var query =`<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://v1.ws.wsdemandedocumentweb.cnaf/">
    <soap:Header/>
    <soap:Body>
        <tns:demanderDocumentWeb xmlns:tns="http://v1.ws.wsdemandedocumentweb.cnaf/">
            <arg0>
                <app>WAT</app>
                <id>?</id>
                <beanEntreeDemandeDocumentWeb>
                    <codeAppli>WAT</codeAppli>
                    <codeOrganisme>148</codeOrganisme>
                    <codePrestation>AF</codePrestation>
                    <codeSituation>1</codeSituation>
                    <dateDebutPeriode>01072015</dateDebutPeriode>
                    <dateEnvironement>01082015</dateEnvironement>
                    <dateFinPeriode>31072015</dateFinPeriode>
                    <matricule>354</matricule>
                    <typeDocument>0</typeDocument>
                    <typeEnvoi>3</typeEnvoi>
                </beanEntreeDemandeDocumentWeb>
            </arg0>
        </tns:demanderDocumentWeb>
    </soap:Body>
</soap:Envelope>`;

//matricule : numéro d'allocataire CAF
//codeOrganisme : identifiant caisse CAF (récupération à partir du Code postal
//   ou Code insee (table de mapping)) fichier détenu par florian mais faux !


module.exports = CafService;



function CafService(options) {
  options = options || {};

  this.attestation = function(callback) {
    var self = this;

    function hasBodyError(body){
      return body.indexOf("<codeRetour>0</codeRetour>") < 0
    }
    request
        .post({
            url: 'https://pep-test.caf.fr/sgmap/wswdd/v1',
            body: query,
            headers: { 'Content-Type': 'text/xml; charset=utf-8' },
            gzip: true,
            cert: fs.readFileSync(__dirname + '/../../cert/bourse.sgmap.fr.bundle.crt'),
            key: fs.readFileSync(__dirname + '/../../cert/bourse.sgmap.fr.key'),
            rejectUnauthorized: false,
            timeout: 10000
        }, function(err, res, body) {
          if(err) return callback(err);
          if(res.statusCode !== 200) return callback(new Error("return code is " + res.statusCode))
          if(hasBodyError(body)) return callback(new Error("The service has an error "))
          callback(null, self.getSecondPart(body))
        })
  }


  //ARCHI SALE ==> REFACTOR
  this.getSecondPart = function getSecondPart(body) {
    var lines = body.split('\n');
    var separatorFound= 0;
    var newBody ='';
    for(var line = 0; line < lines.length; line++){
      if(lines[line].indexOf('--MIMEBoundaryurn_uuid_') === 0) {
        separatorFound++
        line += 2
      } else {
        if(separatorFound === 2) {
          newBody += lines[line]+"\n"
        }
      }
    }
    return newBody;
  }

}
