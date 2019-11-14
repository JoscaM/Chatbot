import axios from 'axios';
import Alert from './alert'
const alert = new Alert();
class BotTraining {

  sendData(data) {
    axios.post('http://127.0.0.1:5000/index/post',
     data
  )
  .then(function (response) {

    if(response.data.status){
      alert.alertSuccess(response.data.message)
    }
    else {
      alert.alertError('Training fail!')
    }

  })
  .catch(function (error) {
    console.log(error);
  });
  }

  async getSamples(){
    return await axios.get('http://127.0.0.1:4200/training/sample')
    .then (response => response.data)
    .catch ( error => console.log(error))
  }

  async sendMessage(message) {
    return await axios.post('http://127.0.0.1:5000/index/searchQuestion',
     {message}
  )
  .then( (response) => response.data)
  .catch(error => console.log(error))
  }
  async checkValid(message) {
    return await axios.post('http://127.0.0.1:5000/index/checkValid',
     {message}
  )
  .then( (response) => response.data)
  .catch(error => console.log(error))
  }

  async getIntents(){
    return await axios.get('http://127.0.0.1:4200/training/intent')
    .then (response => response.data)
    .catch ( error => console.log(error))
  }
  async deleteIntents(data){
    return await axios.post('http://127.0.0.1:4200/training/deleteIntents',{data})
    .then (response =>  response.data)
    .catch ( error => console.log(error))
  }
  async updateIntent(data){
    return await axios.post('http://127.0.0.1:4200/training/updateIntent',data)
    .then (response =>  response.data)
    .catch ( error => console.log(error))
  }
  async postIntents(data){
    return await axios.post('http://127.0.0.1:5000/training/postIntents',{data})
    .then (response =>  response.data)
    .catch ( error => console.log(error))
  }


  async getEntities(){
    return await axios.get('http://127.0.0.1:5000/index/entities')
    .then (response =>  response.data)
    .catch ( error => console.log(error))
  }
  async deleteEntity(data){
    return await axios.post('http://127.0.0.1:4200/training/deleteEntity',{data})
    .then (response =>  response.data)
    .catch ( error => console.log(error))
  }
  async updateEntity(data){
    return await axios.post('http://127.0.0.1:4200/training/updateEntity',data)
    .then (response =>  response.data)
    .catch ( error => console.log(error))
  }
  async postEntitiy(data){
    return await axios.post('http://127.0.0.1:4200/training/postEntity',{data})
    .then (response =>  response.data)
    .catch ( error => console.log(error))
  }

  async deleteSample(data){
    return await axios.post('http://127.0.0.1:4200/training/deleteSample',{data})
    .then (response =>  response.data)
    .catch ( error => console.log(error))
  }

}
export default BotTraining;
