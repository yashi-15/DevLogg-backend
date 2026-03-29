import express from 'express';
import 'dotenv/config'
import { connectDB } from './config/db/db.js';
import authRouter from './routes/auth.route.js'

const app = express();
app.use(express.json())

let PORT = 3000;

connectDB()

app.use("/api/v1/auth", authRouter  )

app.listen(PORT, () => {
    console.log(`listening on PORT number: ${PORT}`);
})