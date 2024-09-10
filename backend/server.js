import express from "express"
import { Protected } from "./authentication.js";
import route from "./router.js"
import cors from "cors"
const app =express();
app.use(cors())
app.use(express.json());
app.use("/api/protected",Protected,route.router);
app.use("/api/user",route.userRouter);
app.listen(3000,()=>{
    console.log("Server is listening at port 3000")
})