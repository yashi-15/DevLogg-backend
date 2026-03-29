import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
            autoIndex: true
        })
        console.log("DB connected successfully!");

    } catch (error) {
        console.log("DB connection failed..", error);

    }

}