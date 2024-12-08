"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.cart = exports.Item = exports.User = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("./Routes/user");
const admin_1 = require("./Routes/admin");
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const UserSchema = new mongoose_1.default.Schema({
    username: String,
    password: String
});
const itemSchema = new mongoose_1.default.Schema({
    image: String,
    id: Number,
    name: String,
    price: Number
});
const cartSchema = new mongoose_1.default.Schema({
    userId: String,
    item: [{
            type: mongoose_1.default.Schema.Types.ObjectId, // Refers to an ObjectId
            ref: "itemDetails", // Refers to the 'item' model
            required: true
        }]
});
app.use('/user', user_1.Router);
app.use('/admin', admin_1.adminRouter);
exports.User = mongoose_1.default.model('userDetails', UserSchema);
exports.Item = mongoose_1.default.model('itemDetails', itemSchema);
exports.cart = mongoose_1.default.model('cartDetails', cartSchema);
exports.Order = mongoose_1.default.model('orderDetails', cartSchema);
mongoose_1.default.connect("mongodb+srv://navravi31122002:Navanith%4056@cluster0.xgytx.mongodb.net/Shopping");
app.listen(port, () => {
    console.log("Running on port 3000");
});
