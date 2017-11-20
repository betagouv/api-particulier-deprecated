require 'csv'
require 'json'

res = []
CSV.foreach('./data/caf-bordeaux.csv') do |row|
  fake = {}
  fake['numeroAllocataire'] = row[10]
  fake['codePostal'] = row[9]
  caf = {}
  caf['allocataires'] = [
    {
      'nomPrenom' => "#{row[2].upcase} #{row[1].upcase}",
      'dateDeNaissance' => row[4].gsub(/\//, ''),
      'sexe' => row[3]
    }, {
      'nomPrenom' => "#{row[14].upcase} #{row[13].upcase}",
      'dateDeNaissance' => row[16].gsub(/\//, ''),
      'sexe' => row[15]
    }
  ]
  caf['enfants'] = [
    {
      'nomPrenom' => "#{row[18].upcase} #{row[17].upcase}",
      'dateDeNaissance' => row[20].gsub(/\//, ''),
      'sexe' => row[19]
    }, {
      'nomPrenom' => "#{row[22].upcase} #{row[21].upcase}",
      'dateDeNaissance' => row[24].gsub(/\//, ''),
      'sexe' => row[23]
    }
  ]
  caf['adresse'] = {
    'identite' => row[5],
    'complementIdentiteGeo' => '',
    'numeroRue' => row[7],
    'codePostalVille' => row[8],
    'pays' => 'FRANCE'
  }
  caf['quotientFamillial'] = row[9]
  caf['mois'] = '11'
  caf['annee'] = '2017'
  fake['response'] = caf
  res << fake
end
File.open('data/caf-bordeaux.json', 'wb') do |f|
  f.write JSON.pretty_generate(res)
end
