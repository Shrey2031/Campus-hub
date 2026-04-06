// require ('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import { app } from './app.js';
import connectDB from './db/connect.js';



dotenv.config({
    path: './.env'
})

connectDB();
app.listen(process.env.PORT|| 4000, () => {
          console.log(`server is running at  ${process.env.PORT}`);
   })
// .catch((err) => {
//     console.log("mongodb connection failed : !!",err)
// })