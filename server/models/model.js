const {Schema , model} = require('mongoose');

const user_schema = Schema({
    name : {type : String , required : true , unique : true},
    company : {type : String , required: true },
    phone : {type : Number , required : true},
    email : {type : String , required : true , unique: true},
    is_public : {type : Boolean  , default : true},
    is_visible : {type : Boolean  , default : true},
    password : {type : String , required : false , default : ""},
    admin : {type : Boolean , default : true},
    address : {type : String  , required: false},
    owner: {type: String , required: false , default : "admin"},
});

module.exports = model('user' , user_schema);
    