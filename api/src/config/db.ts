import mongoose from "mongoose"

const connectDB = async (): Promise<void> => {
    try {
    const connect = await mongoose.connect(process.env.MONGO_URL)
    console.log(`MongoDB Connected To: ${connect.connection.host}`);
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export default connectDB