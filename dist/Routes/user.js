"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const express_1 = __importDefault(require("express"));
exports.Router = express_1.default.Router();
const zod_1 = require("zod");
const shopping_1 = require("../shopping");
const auth_1 = require("../Middleware/auth");
const auth_2 = require("../Middleware/auth");
const userdetailsValidation = zod_1.z.object({
    username: zod_1.z.string().min(1),
    password: zod_1.z.string().min(8)
});
exports.Router.get("/getUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield shopping_1.User.find();
    res.json(user);
}));
exports.Router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const parsedInput = userdetailsValidation.safeParse(req.body);
    if (!parsedInput.success) {
        res.json({ message: "Input error" });
    }
    else {
        console.log("inside");
        const user = yield shopping_1.User.findOne({ username, password });
        if (user) {
            const token = (0, auth_1.generateUsertoken)(username);
            res.json({ message: "Login successfully", token: token });
        }
        else {
            res.status(404).json({ message: "user doesn't exist" });
        }
    }
}));
exports.Router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const parsedInput = userdetailsValidation.safeParse(req.body);
    if (!parsedInput.success) {
        res.json({ message: "Input error" });
    }
    else {
        const user = yield shopping_1.User.findOne({ username });
        if (!user) {
            const newUser = new shopping_1.User({ username, password });
            yield newUser.save();
            const token = (0, auth_1.generateUsertoken)(username);
            res.json({ message: "user created successfully", token: token });
        }
        else {
            res.status(403).json({ message: "user already exist" });
        }
    }
}));
exports.Router.post("/addtocart", auth_2.UserAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.headers.user;
    const id = req.body.id;
    const item = yield shopping_1.Item.findOne({ id });
    const user = yield shopping_1.User.findOne({ username: name });
    if (user) {
        if (item) {
            const isCart = yield shopping_1.cart.findOne({ userId: user._id });
            if (!isCart) {
                const userid = user._id;
                const newCartItem = new shopping_1.cart({ userId: userid, item: item._id });
                yield newCartItem.save();
                res.json({ message: "Added to cart successfully" });
            }
            else {
                isCart.item.push(item._id);
                isCart.save();
                res.json({ message: "Added to cart successfully" });
            }
        }
        else {
            res.send({ message: "item doesn't exist" });
        }
    }
    else {
        res.send("error");
    }
}));
exports.Router.get("/getcartItems", auth_2.UserAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.headers.user;
    console.log(name);
    const user = yield shopping_1.User.findOne({ username: name });
    if (user) {
        const item = yield shopping_1.cart.findOne({ userId: user._id }).populate('item');
        if (!item) {
            res.send("cart is empty");
        }
        else {
            res.json(item);
        }
    }
}));
exports.Router.get("/ordersHistory", auth_2.UserAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.headers.user;
    const user = yield shopping_1.User.findOne({ username: name });
    if (user) {
        const isplaced = yield shopping_1.Order.findOne({ userId: user._id }).populate('item');
        if (isplaced) {
            res.json(isplaced);
        }
        else {
            res.json("Never ordered anything");
        }
    }
    else {
        res.send({ message: "user doesn't exist" });
    }
}));
exports.Router.get("/checkout", auth_2.UserAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.headers.user;
    const user = yield shopping_1.User.findOne({ username: name });
    if (user) {
        const Cart = yield shopping_1.cart.findOne({ userId: user._id });
        if (Cart) {
            const userOrders = yield shopping_1.Order.findOne({ userId: user._id });
            if (!userOrders) {
                const newOrder = new shopping_1.Order({ userId: user._id, item: Cart.item });
                yield newOrder.save();
                const deleteItem = yield shopping_1.cart.deleteOne({ userId: user._id });
                res.json({ message: "order succesfull" });
            }
            else {
                for (const obj of Cart.item) {
                    userOrders.item.push(obj);
                    yield userOrders.save(); // Save one at a time to avoid ParallelSaveError
                }
                const deleteItem = yield shopping_1.cart.deleteOne({ userId: user._id });
                res.json({ message: "order successfull" });
            }
        }
        else {
            res.json({ message: "Cart is Empty" });
        }
    }
    else {
        res.send("user failure");
    }
}));
