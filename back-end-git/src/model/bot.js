var mongoose =require('mongoose');
var Schema = mongoose.Schema;

var Bot = new Schema({
  question :{
    type : String
  }, answer:{
    type : String
  }, default_answer:{
    type : String
  }, intent :{
    type : [String]
  }, entities :{

  }, params : {
    type : String
  }
},{
    collection : 'training'
  }
);

var Question = new Schema({
  question :{
    type : String
  },
  multipleChoice :{
      type : Boolean
  },
   answerA:{
    type : String , default : "other answers"
  },
   answerB:{
    type : String , default : "other answers"
  },
   answerC:{
    type : String , default : "other answers"
  },
  answerD:{
    type : String , default : "other answers"
  },
  author:{
    type : String
  },
  dayPulish : {
    type: Date
  },
  dayUpdate :{
    type : Date
  }
},{
    collection : 'question'
  }
)
var Account = new Schema({
  email :{
    type : String
  },
  password :{
      type : String
  },
  name:{
    type : String
  },
  dob:{
    type :String
  }
  address:{
    type : String
  },
  info :{
    type : String
  },
  contact:{
    type : Number
  },
  author:{
    type : String
  },
  class : {
    type: String
  },
  tested : {
    type : Array
  }
},{
    collection : 'account'
  }
)

var Test = new Schema({
  author :{
    type : String
  },
  createDate : {
    type : Date
  },
  questions : {
    type : Array
  },{
    collection : 'account'
  }
)

var Forum = new Schema({
  author :{
    type : String
  },
  createDate : {
    type : Date
  },
  question : {
    type : String
  },{
    collection : 'forum'
  }
)

var Comment = new Schema({
  author :{
    type : String
  },
  commentPost : {
    type :String
  }
  ,
  createDate : {
    type : Date
  },
  content : {
    type : String
  },{
    collection : 'comment'
  }
)

module.exports = mongoose.model('Bot', Bot);
