import express,{ Request, Response } from 'express';
import mongoose from 'mongoose';
import routes from "./routes/route"
import cors from "cors"
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongodb_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/barracks';
  
app.use(express.json());
app.use(cors()); 
app.use(routes)

mongoose.connect(mongodb_uri)

app.get('/', async (request: Request, response: Response) => {
  response.send("working...........")
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} `);
});
