//express for modulus.io
var express = require('express');
var cors = require('cors')
var app = express();

app.use(express.static(__dirname));

app.listen(process.env.PORT || 3000);

var corsOptions = {
  origin: 'http://example.com'
};

app.get('https://blobvault.ripple.com/v1/user/rhtk5T8AMHELGhn16hHVtLWK3Cit1owHqW', cors(), function(req, res, next){
  res.json({msg: 'This is CORS-enabled for only example.com.'});
  console.log(res)
});