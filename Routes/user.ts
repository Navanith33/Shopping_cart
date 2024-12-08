import  express  from "express";
export const Router = express.Router();
import {z} from "zod";
import { cart, User,Item,Order} from "../shopping";
import { generateUsertoken } from "../Middleware/auth";
import {UserAuthentication}  from "../Middleware/auth";
const userdetailsValidation = z.object({
    username:z.string().min(1),
    password:z.string().min(8)
})
Router.get("/getUser",async(req,res)=>{
        const user = await User.find();
        res.json(user);
})
Router.post("/login",async(req,res)=>{
    const {username,password} = req.body;

    const parsedInput = userdetailsValidation.safeParse(req.body);
    if(!parsedInput.success){
        res.json({message:"Input error"});
    }
    else{
        console.log("inside");
        const user = await User.findOne({username,password});
        if(user){
            const token = generateUsertoken(username);
            res.json({message:"Login successfully",token:token});
        }
        else{
            res.status(404).json({message:"user doesn't exist"});
        }
    }
})
Router.post("/signup",async(req,res)=>{
    const {username,password} = req.body;
    const parsedInput = userdetailsValidation.safeParse(req.body);
    if(!parsedInput.success){
        res.json({message:"Input error"});
    }
    else{
        const user = await User.findOne({username});
        if(!user){
            const newUser = new User({username,password});
            await newUser.save();
            const token = generateUsertoken(username);
            res.json({message:"user created successfully",token:token});
        }
        else{
            res.status(403).json({message:"user already exist"});
        }
    }
})
Router.post("/addtocart",UserAuthentication,async(req,res)=>{
    const name = req.headers.user;
    const id = req.body.id;
    const item = await Item.findOne({id});
    const user = await User.findOne({username:name});
    if(user){
        if(item){
            const isCart = await cart.findOne({userId:user._id});
            if(!isCart){
                const userid = user._id;
                const newCartItem = new cart({userId:userid,item:item._id});
                await newCartItem.save();
                res.json({message:"Added to cart successfully"});
            }
            else{
                isCart.item.push(item._id);
                isCart.save();
                res.json({message:"Added to cart successfully"});
            }
        }
        else{
            res.send({message:"item doesn't exist"});
        }
    }
    else{
        res.send("error");
    }
})
Router.get("/getcartItems",UserAuthentication,async(req,res)=>{
    const name = req.headers.user;
    console.log(name);
    const user = await User.findOne({username:name});
    if(user){
        const item = await cart.findOne({userId:user._id}).populate('item');
        if(!item){
            res.send("cart is empty");
        }
        else{
            res.json(item);
        }
    }
})

Router.get("/ordersHistory",UserAuthentication,async(req,res)=>{
    const name = req.headers.user;
    const user = await User.findOne({username:name});
    if(user){
            const isplaced = await Order.findOne({userId:user._id}).populate('item');
            if(isplaced){
                res.json(isplaced);
            }
            else{
                res.json("Never ordered anything");
            }
        }
        else{
            res.send({message:"user doesn't exist"});
        }
    }
)

Router.get("/checkout",UserAuthentication,async(req,res)=>{
    const name = req.headers.user;
    const user= await User.findOne({username:name});
    if(user){
        const Cart = await cart.findOne({userId:user._id});
        if(Cart){
            const userOrders = await Order.findOne({userId:user._id})
            if(!userOrders){
                const newOrder = new Order({userId:user._id,item:Cart.item});
                await newOrder.save();
                const deleteItem = await cart.deleteOne({userId:user._id});
                res.json({message:"order succesfull"});
            }
            else{
               for (const obj of Cart.item) {
                    userOrders.item.push(obj);
                    await userOrders.save();
                  }
                const deleteItem = await cart.deleteOne({userId:user._id});
                res.json({message:"order successfull"});
            }

        }
        else{
            res.json({message:"Cart is Empty"});
        }
    }
    else{
        res.send("user failure");
    }
})

