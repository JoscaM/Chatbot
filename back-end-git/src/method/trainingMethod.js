require('dotenv').config()
const {Wit, log} = require('node-wit');
module.exports = {

  // [{
  //   "text": "I want to buy a medium pizza",
  //   "entities": [
  //     {
  //       "entity": "intent",
  //       "value": "pizza",
  //     },
  //     {
  //       "entity": "pizzaSize",
  //       "value": "medium",
            // "start" : 00,
            // "end" : 00
  //     }
  //   ]
  // }]
  // const obj = {
  //   params : ['action','place'],
  //   tag :    ['book','Las Vegas'],
  //   intent : ['Question'],
  //   question: 'Cant you book a room in Vegas',
  //   default_answer : "No",
  //   answer : 'Yes,I can'
  // }
  converseToElastic : function (object){
    let intent = object.intent.toString();
    let question = object.question;
    let answer = object.answer;
    let default_answer = object.default_answer;
    let params = object.params;
    let tag = object.tag ;
    let entities = []

    for (let x in params){
      entities = [...entities,{ [params[x]] : tag[x] }];
    }
    return {
      intent , question , answer , default_answer , entities
    }
  },
  converseToSchema : function(object){
    let params =object.params;
    let intent = object.intent;
    let question = object.question;
    let answer = object.answer;
    let default_answer = object.default_answer;

    let tag = object.tag;
    let training = {}
    let entities ={}
    for (let x in params) {
      entities[params[x]] = []
    }
    for (let i in params){
      entities[params[i]] = [...entities[params[i]],tag[i]]
    }
     training.entities = entities;
     training.params = '';
     let step = []
     for (let x in entities){
       step  = [...step, x]
     }
     training.params = step.toString();
     // console.log(training.params );
     training.intent = intent ;
     training.question = question;
     training.default_answer = default_answer;
     training.answer = answer;
     return training;
  },

  converseToWit : function (obj){

    let sample = {};
    sample.text = obj.question;

    let entityIntent = obj.intent.map(
      (intentName) => {return {
        "entity" : "intent",
        "value" : intentName
      }
    })
    // let entityIntent = {
    //   'entity' : 'intent',
    //   'value' : obj.intent
    // }
    let entity = obj.params.map((entitiesName,index)=>{
       return {
        'entity' : entitiesName,
        'start' : sample.text.indexOf(obj.tag[index]),
        'end' : sample.text.indexOf(obj.tag[index])  + obj.tag[index].length,
        'value' : obj.tag[index]
        }
    })
    let entities = [...entityIntent,...entity]
    sample.entities = entities
    //console.log(sample);
    return [sample]
  },

  converseToUpdate : function(obj){
    let result = {};
    result.id = obj.id;
    result.oldId = obj.oldId;
    let values = [];
    if(obj.value.length !== 0){
      obj.value.forEach(element =>{
        values = [...values,{'value' : x}]
      })
    }
    result.values =values
    return result;
  },
//Get data from wit
  getEntities : function (){
    return fetch(process.env.WIT_AI + 'entities?v=20170307', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer '+process.env.WIT_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        }

      })
        .then(res => res.json())
  },
  getIntents : function (){
    return fetch(process.env.WIT_AI + 'entities/intent?v=20170307', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer '+process.env.WIT_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        }

      })
        .then(res => res.json())
  },

  getEntitiesValue : function (value){
    return fetch(process.env.WIT_AI + 'entities/'+value+'?v=20170307', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer '+process.env.WIT_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        }

      })
        .then(res => res.json())
  },

  getSample : function (){
    return fetch(process.env.WIT_AI + 'samples?limit=200', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer '+process.env.WIT_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        }

      })
        .then(res => res.json())
  },

  getMessage : function (message){
    const client = new Wit({accessToken: process.env.WIT_ACCESS_TOKEN});
    return client.message( message, {})
    .then(data => data)//JSON.stringify(data) )
    .catch(console.error);
    // return  fetch('process.env.WIT_AI + message?v=20190711&q=How%20are%20you!', {
    //     method: 'GET',
    //     headers: {
    //       Authorization: 'Bearer '+process.env.WIT_ACCESS_TOKEN,
    //       'Content-Type': 'application/json',
    //     }
    //
    //   })
    //     .then(res => res.json())
  },

  // Post data into wit
  postEntity : function (entity){
    return fetch(process.env.WIT_AI + 'entities?v=20170307', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer '+process.env.WIT_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
        body : JSON.stringify(
          {
            'doc' : 'Size of pizza',
            'id' : entity
          }
        )
      })
        .then(res => res.json())
  },
  putEntity : function (value){
    return fetch(process.env.WIT_AI + 'entities/'+value+'?v=20170307', {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer '+process.env.WIT_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
        body : JSON.stringify(
          {
            "lookups":["free-text"]
          }
        )
      })
        .then(res => res.json())
  },


  postSample : function (sample){
    return fetch(process.env.WIT_AI + 'samples?v=20170307', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer '+ process.env.WIT_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },

        body : JSON.stringify(sample)

    }).then(res => res.json())
  },
  //Delete Sample
  deleteSample : function (deleteSample){
    return fetch(process.env.WIT_AI + 'samples?v=20170307', {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer '+process.env.WIT_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
        body : JSON.stringify([
          {'text' : deleteSample}
        ])
      })
        .then(res => res.json())
    }

}

// Router get data
