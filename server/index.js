import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from 'url';
import { register } from "./controllers/auth.js"

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet(__dirname))
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({limit: "30mb",extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb",extended: true}))
app.use(cors());
app.use("/assets",express.static(path.join(__dirname,'public/assets')))

/* FILE STROAGE */
const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,"public/assets");
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})
const upload = multer({storage})

/*ROUTES WITH FILE*/
app.post('/auth/register',upload.single("picture"),register)
app.post("/posts",verifytoken,upload.single("picture"),createPost)

/*ROUTES */
app.use("/auth",authRoutes)

/* MONGO */
const PORT = process.env.PO1RT || 6001
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`))
}).catch((error) => console.error(error));