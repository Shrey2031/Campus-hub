import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors({
   origin:process.env.CORS_ORIGIN||'http://localhost:5173',
   credentials:true
}))

app.use(express.json({limit:'12kb'}));
app.use(express.urlencoded({extended:true,limit:'12kb'}));
app.use(express.static('public'))
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(express.json());



//route declaration
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import discussionRoutes from "./routes/discussion.routes.js";
import aiRoutes from "./routes/aiRoutes.js";



app.use('/api/v1/posts',postRoutes)
app.use('/api/v1/ai',aiRoutes)
app.use('/api/v1/users',userRoutes)
app.use('/api/v1/comments',commentRoutes)
app.use('/api/v1/notifications',notificationRoutes)
app.use('/api/v1/discussions',discussionRoutes)
export { app }