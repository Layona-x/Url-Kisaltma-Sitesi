const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const short = require('shortid')


const urlSchema = new Schema({
  url: {
    type: String,
    require: true,
  },
  short: {
    type: String,
    require: true,
    default: short.generate,
  },
  click: {
    type: Number,
    require: true,
    default: 0,
  },
  userId:{
    type:String,
    require:true,
  },
  name:{
    type:String,
    require:true,
  }
});

let url = mongoose.model("Url", urlSchema);
module.exports = url;
