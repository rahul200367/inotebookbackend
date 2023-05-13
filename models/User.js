const mongoose = require('mongoose');
const {Schema}=mongoose;
const UserSchema = new Schema({
   name:{
   type: String,
   reuired: true
   },
   email:{
    type: String,
    reuired: true
   },
   password:{
    type: String,
    reuired: true
   },
   date:{
    type: Date,
    defult:Date.now
   },
  });
  const User = mongoose.model('user',UserSchema);
  User.createIndexes();
  module.exports = User;