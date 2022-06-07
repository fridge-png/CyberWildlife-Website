const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/webdb", (error) => {
  if (error) {
    console.log(error);
    return;
  }
});

const ExperienceSchema = mongoose.Schema({
    
    username: {
      type:String,
      required:true
    },
    title: {
      type:String,
      required:true
    },
    photo: {
      type:String,
      required:true
    },
    description: {
      type:String,
      required:true
    }
  });


const UserSchema = mongoose.Schema({
    username: {
      type:String,
      required:true
    },
    password: {
      type:String,
      required:true
    },
    full_name: {
      type:String,
      required:true
    },
    photo: {
      type:String,
      required:false
    }
  });

const ExperienceModel = mongoose.model("experience", ExperienceSchema);
const UserModel = mongoose.model("user", UserSchema);

// module.exports = ExperienceModel,UserModel;

exports.ExperienceModel = ExperienceModel;
exports.UserModel = UserModel;