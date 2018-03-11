const express = require('express');
const hbs = require('hbs');
const request = require('request');
const bodyParser = require('body-parser');
const port=process.env.PORT || 3000;
var app=express();
hbs.registerPartials(__dirname+'/views')
app.set('view engine','hbs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/',(req,response)=>{
  response.render('index2.hbs',{
    weather:null,
    error:null
  });
});
 app.post('/',(request1,response1)=>{
   var place = request1.body.place;
   var addEncode=encodeURIComponent(place);
 request({
   url:'https://maps.googleapis.com/maps/api/geocode/json?address='+addEncode+'&key=AIzaSyCaP0FY6maFFIqSqjpG_krgp2bhETZpgiM',
  json:true
},(error,response2,body)=>{
   if(error){
    response1.render('index2.hbs',{
      weather:null,
      error:'Unable to connect to Google Servers'
    });
  }
  else if(body.status==='ZERO_RESULTS'){
    response1.render('index2.hbs',{
      weather:null,
      error:'Unable to find the address'
    });
  }
  else if(body.status==='OK'){
     address=body.results[0].formatted_address,
     latitude=body.results[0].geometry.location.lat,
     longitude=body.results[0].geometry.location.lng
    request({
  url:'https://api.darksky.net/forecast/9927e38304a4b7e863a3b8cf53ab7494/'+latitude+','+longitude,
  json:true
},(error1,response3,body1)=>{
  if(error1){
    response1.render('index2.hbs',{
      weather:null,
      error:'Unable to connect to Forecast.io server'
    });
  }
  else if(!error1&&response3.statusCode===200){
     temperature=(body1.currently.temperature-32)*(5/9),
   apparentTemperature=(body1.currently.apparentTemperature-32)*(5/9)
   summary=body1.currently.summary
     weatherText = "It's "+ temperature +". But it's looking like "+apparentTemperature+"!";
     summ="The sky is "+summary+"!";
    response1.render('index2.hbs',{
      summ,
      address,
      weather:weatherText,
      error:null
    });
  }
  else{
    response1.render('index2.hbs',{
      weather:null,
      error:'Unable to fetch weather'
    });
  }
});
  }
});
});
app.listen(port,()=>{
  console.log('Server is up on port'+port);
});
