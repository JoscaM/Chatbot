const axios = require('axios')
require('dotenv').config();
class Wit {
  constructor() {
    this.api = process.env.WIT_AI;
    this.version = process.env.WIT_VERSION;
    this.params = {};
    this.intent = 'intent';
    console.log("Create Wit");
    this.Token = process.env.WIT_CHATBOT;
    console.log(this.Token);
    axios.defaults.headers.common["Authorization"] = "Bearer " + this.Token;
    axios.defaults.headers.post["Content-Type"] = "application/json";
  }

  async run(setURL=''){
    if (this.method && this.action){
      const url = (setURL ? setURL : (this.api + this.action)) + this.version;

      let params = this.params;
      switch (this.method) {
        case "get": {
          const result = await axios
            .get(url, { params: params })
            .then(result => result.data)
            .catch(err => {
              console.log(err.response.data);
              return {
                error: true,
                message: err.response.data.error
              };
            });
          return result;
        }

        case "post": {
          const result = await axios
            .post(url,  params)
            .then(result => result.data)
            .catch(err => {
              console.log(err.response.data);
              return {
                error: true,
                message: err.response.data.error
              };
            });
          return result;
        }

        case "delete": {
          const result = await axios
            .delete(url, params )
            .then(result => result.data)
            .catch(err => {
              console.log(err.response.data);
              return {
                error: true,
                message: err.response.data.error
              };
            });
          return result;
        }

        case "put": {
          const result = await axios
            .put( url,  params  )
            .then(result => result.data)
            .catch(err => {
              console.log(err.response.data);
              return {
                error: true,
                message: err.response.data.error
              };
            });
          return result;
        }

        default:
          return false;
      }
    }
  }

// Get samples
  async getSample() {
    this.params = { limit: 10000 };
    this.method = "get";
    this.action = "samples";
    return await this.run();
  }

// get message
  async getMessage(question) {
    question = question.trim();
    this.params = { q: question };
    this.method = "get";
    this.action = "message";
    return await this.run();
  }
  // get all entities
  async getEntities() {
    this.method = "get";
    this.action = "entities";
    return await this.run();
  }

  // get entities value
  async getEntitiesValue(id) {
    id = id.trim();
    const url = this.api + "entities/" + id;
    this.method = "get";
    this.action = "entities";
    return await this.run(url);
  }

  //// create entites
  async postEntity(id, values, lookups = ["free-text"]) {
    id = id.trim();
    this.params = {
      id,
      doc: id
    };
    this.method = "post";
    this.action = "entities";
    const result = await this.run();
    if (result.error) {
      return result;
    } else {
      return await this.updateEntity(id, id, values, lookups);
    }
  }
  // post sample
  async postSample(sample) {
      this.params = sample;
      this.method = "post";
      this.action = "samples";
      return await this.run();
    }
  // update entities
  async updateEntity(id, oldId, values, lookups = ["free-text"]) {
    id = id.trim();
    oldId = oldId.trim();
    const url = this.api + "entities/" + oldId;
    this.params = {
      id,
      doc: id,
      lookups: lookups,
      values
    };
    this.method = "put";
    this.action = "entities";
    return await this.run(url);
  }

  //delete entities
  async deleteEntity(id) {

      const url = this.api + "entities/" + id;
      this.method = "delete";
      this.action = "entities";
      const result = await this.run(url);
      if (result.error) {
        return result;
      }
    return true;
  }
  //delete sample
  async deleteSample(params) {
    this.params ={data: [ {'text' : params}]};
    console.log(this.params);
    this.method = "delete";
    this.action = "samples";
    return await this.run();
  }

}
module.exports = Wit;
