import mongoose from "mongoose";

mongoose.set('strictQuery', true)
mongoose.set("strictPopulate", false)

export const connect = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL!)
        console.log("Connected to MongoDB")
        return connection
    } catch (err) {
        if (err instanceof Error)
            console.error(err.message)
    }
}