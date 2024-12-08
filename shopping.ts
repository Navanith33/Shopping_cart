import express from "express";
const app = express();
const port = 3000;
import cors from 'cors'
import mongoose from "mongoose";
import { Router } from "./Routes/user";
import { adminRouter } from "./Routes/admin";
app.use(express.json());
app.use(cors());
const UserSchema = new mongoose.Schema({
   username:String,
   password:String
})
const itemSchema = new mongoose.Schema({
    image:String,
    id:Number,
    name:String,
    price:Number
 })
 const cartSchema = new mongoose.Schema({
    userId:String,
    item:[{ 
        type: mongoose.Schema.Types.ObjectId, // Refers to an ObjectId
        ref: "itemDetails",                      // Refers to the 'item' model
        required: true 
      }]
 })
app.use('/user',Router);
app.use('/admin',adminRouter)
export const User = mongoose.model('userDetails',UserSchema);
export const Item = mongoose.model('itemDetails',itemSchema);
export const cart = mongoose.model('cartDetails',cartSchema);
export const Order = mongoose.model('orderDetails',cartSchema);
mongoose.connect("mongodb+srv://navravi31122002:Navanith%4056@cluster0.xgytx.mongodb.net/Shopping")
app.listen(port,()=>{
    console.log("Running on port 3000")
})