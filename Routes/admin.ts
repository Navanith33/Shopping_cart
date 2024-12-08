import  express  from "express";
export const adminRouter = express.Router();
import {z} from "zod";
import {Item } from "../shopping";
import {UserAuthentication}  from "../Middleware/auth";
const itemValidation = z.object({
    image:z.string(),
    id:z.number(),
    name:z.string().min(1),
    price:z.number()
})
adminRouter.get("/getItem",async(req,res)=>{
        const item = await Item.find();
        res.json(item); 
})
adminRouter.post("/addItem",UserAuthentication,async(req,res)=>{
    const {image,id,name,price} = req.body;
    const parsedInput = itemValidation.safeParse(req.body);
    if(!parsedInput.success){
        res.json({message:"Input error"});
    }
    else{
        const item = await Item.findOne({id});
        if(!item){
            const newitem = new Item({image,id,name,price});
            await newitem.save();
            res.json({message:"item added successfully"})
        }
        else{
            res.json({message:"item already exist"});
        }
    }
})