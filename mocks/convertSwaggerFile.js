const yaml2json = require('yaml-to-json');
const fs = require('fs')


const swaggerYaml = fs.readFileSync("./api-particulier.yaml")
const swaggerJson = yaml2json(swaggerYaml);
fs.writeFile('./api-particulier.json', JSON.stringify(swaggerJson), 'utf8')
