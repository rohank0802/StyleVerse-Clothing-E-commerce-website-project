import "dotenv/config"
import mongoose  from "mongoose";
import { config } from "./config.js";

async function connectToDatabse(){
 try{
    await mongoose.connect(config.MONGO_URI)
    console.log(" successfully connected to DB")
 }
 catch(err){
  throw new Error(err.message)
  process.exit(1)
 }
}
export default connectToDatabse