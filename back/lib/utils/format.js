const js2xmlparser = require('js2xmlparser')


module.exports= function(res, data) {
  return res.format({
    'application/json': function(){
       res.json(data)
    },
    'application/xml': function(){
      if(data instanceof String){
        data = {data}
      }
      res.send(js2xmlparser("result", data))
    },
    'default': function() {
      res.status(406).send('Not Acceptable');
    }
  });
}
