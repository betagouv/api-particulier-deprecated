const YAML = require('yamljs');
const fs = require('fs')


const swaggerJson = YAML.load("./api-particulier.yaml");
fs.writeFile('./api-particulier.json', JSON.stringify(swaggerJson), 'utf8')
