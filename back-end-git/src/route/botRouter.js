const express = require('express');
const app = express();
const botRouter = express.Router();
const fetch = require('node-fetch');
const Bot  =  require('../model/bot');
const method = require('../method/trainingMethod');
const Wit = require('../method/witAPI')
const wit = new Wit();
const obj = {
  params : ['greeting'],
  tag :    ['Hey'],
  intent : ['greeting'],
  question: "Hey",
  default_answer : "Hey, hey what!",
  answer : 'Hi, how was your day?'
}
///Router

botRouter.route('/post/samples').post(async function (req, res) {
  let training = req.body
  console.log(training);
  //Converse data from font-end to bot.Model
  let trainingSchema = await method.converseToSchema(obj);
  let entities = await wit.getEntities();
  for (let x  in trainingSchema.entities){
    if(!entities.includes(x)){
      let resPostEntity = await wit.postEntity(x);
      //console.log(resPostEntity);
    }
  }
  //Converse data into wit sample type and post to wit
  let objInWit = await method.converseToWit(obj);
  const witResponse= await wit.postSample(objInWit);// post to wit.ai
  //console.log(witResponse);
  if (witResponse.sent){

    //let trainingSchema = await method.converseToSchema(training)
    botSchema = new Bot(trainingSchema);//Make model
    console.log(botSchema);
    //Save item in to mongo
    botSchema.save()
      .then(training => {                                    //Response Success
        res.json({
          status : true,
          message : 'Training Success!!'
        });
      })
      .catch(err => {                                         //Response Success
        res.json({
          status : false,
          message : "Unable to save to database"
        })
    });
  }
  else {                                                        // can't add to wit.ai
    res.json({
      status : false,
      message :'Enable to connect to wit.ai!!'})
  }
});
// Get entities from wit.ai
botRouter.route('/entities').get(async function (req, res) {
  // let entities = await method.getIntents();
  // let current = [];
  // for (let x in entities.values){
  //   current =[...current,entities.values[x].value]
  // }
  // //console.log(entities);

  let entitiesRes = await wit.getEntities()
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

botRouter.route('/sample').get(async function (req, res) {
  // let entities = await method.getIntents();
  // let current = [];
  // for (let x in entities.values){
  //   current =[...current,entities.values[x].value]
  // }
  // //console.log(entities);

  let sampleRes = await wit.getSample()
  let current = [];
  sampleRes.forEach(element =>{
    let step ={question : '',
                intent : '',
                entities : []
              };
    step.question = element.text;
    if(  element.entities.length!== 0 ){
      element.entities.forEach(item =>{
        if(item.entity === 'intent'){
          step.intent= item.value
        }
        else{
          step.entities = [...step.entities,{'name': item.entity,'value':item.value}]
        }
      })
    }
    current = [...current,step]
  })
  //console.log(entities);
  if(sampleRes.error){
    res.json({
      status : false,
      message: '..Opps, Somethings go wrong!'
    })
  }
  else{
    res.json({status: true, message : current})
  }
})
// get intent
botRouter.route('/intent').get(async function (req, res) {

  let intentsRes = await wit.getEntitiesValue('intent')
  console.log(JSON.stringify(intentsRes));
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
    console.log(intents);
    res.json({
      status : true,
      message: intents});
  }


})
///
botRouter.route('/postEntity').post(async function (req, res){
  // console.log(req.body);
  let step = req.body.data
  let resPostEntity = await wit.postEntity(step);
  if(resPostEntity.error){
    res.json({
      status : false,
      message : resPostEntity
    })}
  else{
    res.json({
      status : true,
      message : 'Add entity success!'
    })
  }

})
// Query anwser /// check intent or entities available!!!importance
/*
* @message : string
*/
botRouter.route('/getAnswer').post(async function (req, res) {
  let message = req.body.message
  //let message ='Iam hungry now!'
  console.log(message);

  let resMessage = await wit.getMessage(message)
  console.log(JSON.stringify(resMessage));
  if (Object.keys(resMessage.entities).length !== 0){
    if(resMessage.entities.intent === undefined){
      res.json({
        status : true,
        message: "Oh sorry! I did't recognize the intent of this sentence!" })
    }
    else {
      let intentWIT = resMessage.entities.intent[0].value;
      let entitiesWIT={}
      for (let x in resMessage.entities){
        //console.log(x);
        if (x !== 'intent' ) entitiesWIT[x] = []   ;
      }
      //console.log(entitiesWIT);
      for (let x in entitiesWIT){
        //console.log(resMessage.entities[x]);
        for(let i in resMessage.entities[x]){
          entitiesWIT[x] = [...entitiesWIT[x],resMessage.entities[x][i].value]
        }
      }
      console.log( intentWIT);
      if(entitiesWIT.length === 0){
        await Bot.find({intent : intentWIT },
          function (err,result){
            if (err){
              res.json({
                status: false,
                message: err})
            }
            else {
              //console.log('aaa');
              if(result.length < 1){
                res.json({
                  status : true,
                  message : 'Sorry! I dont have answer for this question!'});
              }
              else {
                res.json(result[0].default_answer)
              }
            }
        })
      }
      else{
        await Bot.find({intent : intentWIT },
          function (err,result){
            if (err){
              res.json({
                status : false,
                message:err})
            }
            else {
                //console.log(result);
                if(result.length < 1){
                  res.json({
                    status : true,
                    message :  'Sorry! I dont have answer for this question!'});
                }
                else {
                    for (let x in result){
                      console.log(result[x].entities);
                      console.log(entitiesWIT);
                      if ( JSON.stringify(result[x].entities ) === JSON.stringify(entitiesWIT)){
                        res.json({
                          status : true,
                          message : result[x].answer});
                      }
                      else res.json({status : true,message:result[0].default_answer});
                    }
                  //find param
              }
            }
          })
        }
      }
  }
  else {
    res.json({
      status: true,
      message : 'Oh! This sentence so strange to me!'})
  }
})
//Check trained (same structure)
/*
* @sentence : string
*/
botRouter.route('/checkValid').post(async function ( req,res){
  let sentence = req.body.message;
  console.log(sentence);
  let resMessage = await wit.getMessage(sentence);
  console.log(resMessage);
  if(JSON.stringify(resMessage.entities) !== '{}'){
    if(resMessage.entities.intent === undefined){
      res.json({
        status : false,
        message : 'This sentence is so strange to me!'
      })
    }
    else{
        await Bot.find({intent : resMessage.entities.intent[0].value },function(err,result){
          if (err){
            res.json({
              status: false,
              message: err})
          }
          else{
            //console.log(result);
            resMessage.answer = result[0].answer;
            resMessage.default_answer = result[0].default_answer;
            console.log(resMessage);
            res.json(
              {status : true,
                message :resMessage})
          }
        })
    }

  }
  else {
    res.json({
      status : false,
      message : 'This sentence is so strange to me!'
    })
  }
})
// update entities
/*
 * @entitiesUpdate  : Object{
                          id :string ,
                          oldId : tring,
                          value : [Array]}
*/
botRouter.route('/updateEntity').post(async function(req,res){
  let entitiesUpdate = req.body;
  console.log(entitiesUpdate);
  let update = await method.converseToUpdate(entitiesUpdate);
  let updateRes = await wit.updateEntity(update.id,update.oldId,update.values,lookups = ["free-text"])
  ///let updateRes = await wit.updateEntity('intent','intent',["feeling","greeting"],lookups = ["trait"])
  console.log(updateRes);
  if(updateRes.error){
    res.json({
      status: false,
      message :updateRes.message
    })
  }
  else{
    res.json({
      status: true,
      message :'Update success!'
    })
  }
})
// delete entites
botRouter.route('/deleteEntity').post(async function(req,res){
  let entitiesDelete = req.body.data;
  console.log(req.body);
  if(JSON.stringify(req.body) === '{}'){
     res.json({
       status : false,
       message : 'Opps! Somethings went wrong!'
     })
  }
  else {
    //console.log(entitiesDelete);
    let entityValue ;
    let undeleted = [];
    // if (!Array.isArray(entitiesDelete)) {
    //   entitiesDelete= [entitiesDelete];
    // }
    //let entitiesDelete = ['pizza'];

      let entitesName = 'entities.'+entitiesDelete;
      await Bot.find({ [entitesName] :{"$exists" : true}  } , async function(err,result){
        if (err){
          res.json({
            status : false,
            message : err
          })
        }
        else {
          console.log(result);
          if(result.length !== 0){
            console.log("");
            undeleted = [...undeleted,entitiesDelete];
            console.log(undeleted);
            console.log(undeleted.length);
          }
          else{
            entityValue = await wit.deleteEntity(entitiesDelete)
            //let deleteRes = wit.updateEntity(entitiesDelete)
            console.log(entityValue);
          }
          //console.log(entitiyValue.length);
          if(entityValue){
            res.json({
              status : true,
              message : 'Delete complete!'
            })
          }
          else {
            res.json({
              status : false,
              message : undeleted.toString() +' is used in another samples!'
            })
          }
        }
      })
  }
})

// delete sample
botRouter.route('/deleteSample').post(async function(req,res){
  let sample = req.body.data
  console.log(sample);
  let deleteRes = await wit.deleteSample(sample)
  console.log(deleteRes);
    if (deleteRes.sent){
      Bot.findOneAndDelete({ question:sample},async function(err,result){
        if(err){
          res.json({
            status : false,
            message : err
          });
        }
        else{
          if(result!== null){
            for (let element in result.entities){
                let entitesName = 'entities.'+element;
                await Bot.find({[entitesName] :{"$exists" : true}}, async function(err,res){
                    if (err){
                      res.json({
                        status : false,
                        message : err
                      })
                    }
                    else {
                      if(res.length === 0){
                        let entityValue = await wit.deleteEntity(element)
                        //let deleteRes = wit.updateEntity(entitiesDelete)
                        console.log(entityValue);
                      }
                    }
                })
              }
              res.json({status :true , message : 'Sample has been deleted!'})
            }
          }
        })
      }
      else{
        res.json({status : false, message :'Cant delete sample!'})
      }
  })
// Defined edit route
botRouter.route('/UpdateSample').post(async function(req,res){
  let sample = req.body;
  //await wit.deleteSample(sample.question);
  await Bot.findOneAndDelete({ question:sample.question},function(err,result){
    if(err){
      res.json(
      {status : false , message: err});
    }
    else{
      console.log(result);
    }
  })
  let trainingSchema = await method.converseToSchema(sample);
  let entities = await wit.getEntities();
  for (let x  in trainingSchema.entities){
    if(!entities.includes(x)){
      let resPostEntity = await wit.postEntity(x);
      //console.log(resPostEntity);
    }
  }
  //Converse data into wit sample type and post to wit
  let objInWit = await method.converseToWit(sample);
  const witResponse= await wit.postSample(objInWit);// post to wit.ai
  //console.log(witResponse);
  if (witResponse.sent){

    //let trainingSchema = await method.converseToSchema(training)
    botSchema = new Bot(trainingSchema);//Make model
    console.log(botSchema);
    //Save item in to mongo
    botSchema.save()
      .then(training => {                                    //Response Success
        res.json({
          status : true,
          message : 'Update Success!!'
        });
      })
      .catch(err => {                                         //Response Success
        res.json({
          status : false,
          message : "Unable to save to database"
        })
    });
  }
  else {                                                        // can't add to wit.ai
    res.json({status : false,
    message :'Unable to connect to wit.ai!!'})
  }
})
module.exports = botRouter;
