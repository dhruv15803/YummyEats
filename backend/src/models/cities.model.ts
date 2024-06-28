import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
    cityName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    }
})

export const City = mongoose.model('City',citySchema);