import mongoose from "mongoose";
const connectMongoDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("connected to db")
        
    } catch (error) {
        console.log("error connectin db",error.message)
        
    }
}
export default connectMongoDB;