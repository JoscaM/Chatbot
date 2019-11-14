const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');


require('dotenv').config()
const PORT = process.env.PORT_ELASTIC;
// Use middlewares to set view engine and post json data to the server
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// method.createIndex(client);
// method.deleteIndex(client);
const botRouter = require('./srcElt/route/trainingRoute');
app.use('/index',botRouter)

app.listen(PORT, function(){
  console.log('Server is running on Port: ',PORT);
});

// curl -X GET "localhost:9200/_all/_search?q=tag:wow"
