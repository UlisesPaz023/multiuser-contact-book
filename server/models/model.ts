import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
    name: string,
    email:string,
    password:string,
    admin?:boolean,
    phone?:string,
    company?:string,
    address?:string
};

const UserSchema: Schema = new Schema({
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

const User = mongoose.model<IUser>("User", UserSchema);
export default User;