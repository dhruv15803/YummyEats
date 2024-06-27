import mongoose from 'mongoose';
export const connectToDb = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/yummyEats`);
        console.log('DB CONNECTED');
    }
    catch (error) {
        console.log(error);
    }
};
