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
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
exports.adminRouter = express_1.default.Router();
const zod_1 = require("zod");
const shopping_1 = require("../shopping");
const auth_1 = require("../Middleware/auth");
const itemValidation = zod_1.z.object({
    image: zod_1.z.string(),
    id: zod_1.z.number(),
    name: zod_1.z.string().min(1),
    price: zod_1.z.number()
});
exports.adminRouter.get("/getItem", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield shopping_1.Item.find();
    res.json(item);
}));
exports.adminRouter.post("/addItem", auth_1.UserAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { image, id, name, price } = req.body;
    const parsedInput = itemValidation.safeParse(req.body);
    if (!parsedInput.success) {
        res.json({ message: "Input error" });
    }
    else {
        const item = yield shopping_1.Item.findOne({ id });
        if (!item) {
            const newitem = new shopping_1.Item({ image, id, name, price });
            yield newitem.save();
            res.json({ message: "item added successfully" });
        }
        else {
            res.json({ message: "item already exist" });
        }
    }
}));
