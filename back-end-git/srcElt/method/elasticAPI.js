const md5 = require('md5');
bodyConfig  = {
    "mappings": {
    "_doc": {
      "properties": {
        "question": { "type": "text" },
        "intent": { "type": "text" },
        "entities" : { type : "nested"},
        "answer": { "type": "keyword" },
        "default_answer" : { "type": "keyword" }
      }
    }
  }
}
let self  = module.exports = {

  /*
      * get data from csv file
  */
  // async converse(){
  //   const csvFilePath='./src/method/movies_metadata.csv'
  //   const csv=require('csvtojson');
  //   const jsonArray=await csv().fromFile(csvFilePath);
  //   //console.log(jsonArray);
  //   return jsonArray;
  // },

  /*
    * function( client)
    * create index(table)
  */

  isExist : async function(client , index){
    return await client.indices.exists({index : index},function(err,resp,status) {
        if (err){
          console.log(err);
        }
        else {
          if(status !== 200){
            console.log(status);
            self.createIndex(client , index);
          }
        }

    })
  },

  createIndex : async function(client,index){
    return await client.indices.create({index: index ,include_type_name : true , body : bodyConfig},function(err,resp,status) {
      if(err) {
        console.log(err);
      }
      else {
        console.log("create",resp);
      }
    })
  },
  deleteIndex: async function(client,index){
      client.indices.delete({index: index},function(err,resp,status) {
      console.log("delete",resp);
    });
  },
  /*
    * client  : Client
    * data object{index , id(not required), type}
  */
  indexData: async function(client,data){
    await self.isExist(client , "samples")
    let body = await client.index({
      index: "samples",
      id : md5(data.question),
      body: data
    });
    return body;
},
  bulkData : async function (client,data){
    let bulkBody = [];
    data.forEach(item => {
      bulkBody.push({
        index: {
          _index: data.intent[0]
        }
      });

      bulkBody.push(item);
    });
    const { body: bulkResponse } = await client.bulk({
      refresh: true,
      body: bulkBody
    })
    if (bulkBody.error){
      console.log(bulkBody.error);
    }
  },
  converseToSearch : async function(entities){
    if(entities.length!== 0){
      let query = [];
      let keys = []
      for (let x in entities){
        keys = [...keys,(Object.keys(entities[x]).toString())]
      }
      console.log(keys);
      for (let x in keys){
        query = [...query,{ match : { ['entities.'+keys[x]] : entities[x][keys[x]]  }}]
      }
      return query
    }
    else return []
  },
  searchData : async function(client,data){
    let entities = await  self.converseToSearch(data.entities)
    // entities =JSON.stringify(entities)
    console.log(entities);
    let  body = [];
    if(entities.length !== 0 ){
      body  = await client.search({
          index : "samples",
          body: {
            query: {
              bool : {
                must : [
                  {match : { intent : data.intent}} ,
                  {nested : {
                      path : "entities",
                      query : {
                        bool : {
                          should :  entities
                        }},
                        score_mode : "max"
                      }}
                    ]}  }
          }
      })
    }
    else{
      body  = await client.search({
          index : "samples",
          body: {
            query: {
              bool : {
                must : [
                  {match : { intent : data.intent}}
                    ]}  }
          }
      })
    }

    if (body.length === 0){
      return body
    } else {
      return { body : body.hits.hits,max_score :body.hits.max_score}
    }
  },
  deletebyQueryData : async function(client,data){
    // console.log('here')
    const body = await client.deleteByQuery({
      index : '',
      body: {
        query: {
              match  : {
                  question : {
                    query :  data,
                    operator : 'and'
                  }
              }
        }
      }
    });
    return body
  },

  deleteData : async function (client ,data){
    await client.delete({
      index : 'samples',
      id : md5(data)
    }).then( res => console.log(res))
    .catch(err => console.log(err.message))
  }





}
