const express = require('express');
const botRouter = express.Router();
const method = require('../../src/method/trainingMethod');
const elasticMethod = require('../method/elasticAPI')
const Wit = require('../../src/method/witAPI')
const witMethod = new Wit();
const elasticsearch = require('elasticsearch');

require('dotenv').config()


const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});
client.ping({
  requestTimeout: 30000,
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

botRouter.route('/post').post(async function(req,res){
  let training = req.body;
  // res.json(training);
  let witData = await method.converseToWit(training);
  // console.log(witData);
  let elasticData = await method.converseToElastic(training);
  // console.log(elasticData);
  let getEntities = await witMethod.getEntities();
  // console.log(getEntities);
  for (let x in witData[0].entities){
      if (!getEntities.includes(witData[0].entities[x].entity) ){
        let postEntityRes = await witMethod.postEntity(witData[0].entities[x].entity);
        // console.log(postEntityRes);
    }
  }
  witMethod.postSample(witData)
  .then(async (res) =>{
    let resElastic = await  elasticMethod.indexData(client,elasticData)
    if ( !resElastic.error){
      res.json({
        status : true,
        message : 'Training success!'
      })
    }
    else{
      res.status(500).send(resElastic.error)
    }
  }).catch(err =>
      res.status(500).send(err))
  })

botRouter.route('/searchQuestion').post(async function(req,res){
  let text = req.body.message
  console.log(text);
  let resMes = await witMethod.getMessage(text)
  console.log(JSON.stringify(resMes));
  let entities = []
  for (let x in resMes.entities){
    if(x!== 'intent'){
      for( let i in resMes.entities[x]){
        entities = [...entities,{ [x] : resMes.entities[x][i].value }]
      }
    }
  }
  let intent = resMes.entities.intent[0].value;

  let data =  { intent , entities}
  //   console.log(data);
  // console.log(JSON.stringify(entities));
  let searchRes = await elasticMethod.searchData(client,data)
  let source = '_source';
  let score = '_score';
  console.log(searchRes.body[0][source]);
  let maxScore = searchRes.max_score;
  if(searchRes.length === 0){
    res.json({
      status : true,
      message : 'I dont have answer for this question!'
    })
  }
  else{
    // console.log('here');
    if(maxScore >= 0.8){
      for(let x  in searchRes.body){
        if(searchRes.body[x][score] === maxScore){
          let answer = searchRes.body[0][source].answer;
          res.json({
            status : true,
            message : answer
          })
        }

      }
    }
    else {
      let  answer = searchRes.body[0][source].default_answer;
      res.json({
        status : true,
        message : answer
      })
    }
  }
})

botRouter.route('/checkValid').post(async function(req,res){
  let text = req.body.message
  console.log(text);
  let resMes = await witMethod.getMessage(text)
  console.log(JSON.stringify(resMes));
  let entities = []
  for (let x in resMes.entities){
    if(x!== 'intent'){
      for( let i in resMes.entities[x]){
        entities = [...entities,{ [x] : resMes.entities[x][i].value }]
      }
    }
  }
  let intent = resMes.entities.intent[0].value;

  let data =  { intent , entities }
  //   console.log(data);
  // console.log(JSON.stringify(entities));
  let searchRes = await elasticMethod.searchData(client,data)
  // console.log(searchRes);
  let source = '_source';
  let score = '_score';
  let maxScore = searchRes.max_score;
  if (searchRes.length !== 0){
    for(let x  in searchRes.body){
      if(searchRes.body[x][score] === maxScore){
        let answer = searchRes.body[0][source].answer;
        let default_answer = searchRes.body[0][source].default_answer;
        resMes.answer =answer;
        resMes.default_answer =default_answer;
        console.log(resMes);
        res.json({
          status : true,
          message : resMes
        })
}}}
    else{
      res.json({
      status : false,
      message :{}
    })
    }
})
botRouter.route('/entities').get(async function (req, res) {
  // let entities = await method.getIntents();
  // let current = [];
  // for (let x in entities.values){
  //   current =[...current,entities.values[x].value]
  // }
  // //console.log(entities);

  let entitiesRes = await witMethod.getEntities()
  let entities = entitiesRes.filter(item=> !item.toString().includes('wit'))

  //  console.log(entities);
  if (entities.error){
    res.json({
      status : false,
      message : '..Opps, Something goes wrong!'
    })
  }
  else{
    let current = [];
    entities.forEach(element =>{
      current = [...current,{'value' : element}]
    })
    res.json({
      status : true,
      message : current});
    }
})

botRouter.route('/intent').get(async function (req, res) {

  let intentsRes = await witMethod.getEntitiesValue('intent')
  //  console.log(JSON.stringify(intentsRes));
  let intents = [];
  if (intentsRes.error){
    res.json({
      status : false,
      message: '..Opps, intent go wrong!'
    })
  }
  else{
    for (let x in intentsRes.values){
      intents= [...intents,{'value' :intentsRes.values[x].value}]
    }
    res.json({
      status : true,
      message: intents});
  }


})




botRouter.route('/deleteQuestion').post(async function(req,res){
  let deleteRes = await elasticMethod.deleteData(client,'Hey')
  res.json(deleteRes)
})

botRouter.route('/deleteEntity').post(async function(req,res){

  let deleteEntity = await elasticMethod.deleteIndex(client,'samples')
  res.json(deleteEntity)
})

module.exports = botRouter;
