import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
    addressLine1:{
        type:String,
        required:true,
    },
    addressLine2:{
        type:String,
        required:true,
    },
    cityId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"City",
    },
    pin_code:{
        type:Number,
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
},{timestamps:true});

export const Address = mongoose.model('Address',addressSchema);
