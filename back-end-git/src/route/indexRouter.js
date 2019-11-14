const express = require('express');
const app = express();
const indexRouter = express.Router();
const fetch = require('node-fetch');

require('dotenv').config()
const method = require('../method/trainingMethod')
// const obj = {
//   params : ['action','place'],
//   tag :    ['book','Las Vegas'],
//   intent : 'Question',
//   question: 'Cant you book a room in Vegas',
//   default_answer : "No",
//   answer : 'Yes,I can'
// }
// const obj =[{
//         "text": "I want a chesse and opinion pizza",
//         "entities": [
//           {
//             "entity": "intent",
//             "value": "pizza"
//           },
//           {
//             "entity": "pizza",
//             "start": 10,
//             "end": 16,
//             "value": "chesse"
//           },
//           {
//             "entity": "pizza",
//             "start": 21,
//             "end": 28,
//             "value": "opinion"
//           }
//         ]
//       }]
indexRouter.route('/get/entities').get(async function(req,res){
  const step= await method.getEntities();
  res.send(step);
  //res.send('Index')
})

indexRouter.route('/get/entitiesvalue').get(async function(req,res){
  const step= await method.getEntitiesValue('intent');
  console.log(step);
  //res.send('Index')
})

indexRouter.route('/get/message').get(async function(req,res){
  const step= await method.getMessage('I want to fly to sfo')
  res.send(step);
  //console.log(step);
})

indexRouter.route('/get/samples').get(async function(req,res){
  const step =await method.getSample();
  res.send(JSON.stringify(step))
})
// indexRouter.route('/get/intents').get(async function(req,res){
//   const step =await method.getIntents();
//   res.send(JSON.stringify(step))
// })

// Router Post
indexRouter.route('/post/entities').get(async function(req,res){
  const step= await method.postEntity('pizza');
  console.log(step);
  //res.send('Index')
})

indexRouter.route('/post/samples').get(async function(req,res){
  //let step = await method.converseToWit(obj);
  const current= await method.postSample(obj);
  res.send(current);
})

//Delete samples
indexRouter.route('/delete/samples').get(async function(req,res){
  const step =await method.deleteSample("I want to chesse and opinion pizza");
  res.send(step)
})

indexRouter.route('/converse/samples').get(async function(req,res){
  let step = await method.converseToWit(obj);
  console.log(step);
})
module.exports = indexRouter;
