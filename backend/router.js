import { Router } from "express";
import { getMarkdowns, createMarkdown, createUser, login } from "./prisma.js";
import marktoHTML from "./md_to_html.js";
import multer from "multer";
import axios from "axios"
import { createToken } from "./authentication.js";
import dotenv from "dotenv"
dotenv.config();
const storage =multer.memoryStorage()
const upload = multer({storage});
const router = Router();
const userRouter = Router();




async function checkGrammar(text) {
  try {
    const response = await axios.post('https://grammarbot.p.rapidapi.com/check',
      // Send text in the request body
      new URLSearchParams({
        text,
        language: 'en-US'
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          "x-rapidapi-key":process.env.API
        }
      }
    );
    console.log(response)
    return response.data;
  } catch (error) {
    console.log(error)
    console.error('Error checking grammar:', error.response ? error.response.data : error.message);
    return null;
  }
}




router.post("/savenote", upload.single("file"), async (req, res) => {
  const markdownData = { content: req.file.buffer.toString() };
  const response = await createMarkdown(markdownData, req.user.id);
  if (response) {
    res.status(201).json({ message: "Create successfully!" });
  } else {
    res.status(400).json({ message: "Failed to create!" });
  }
});

router.get("/savednotes", async (req, res) => {
  const markdowns = await getMarkdowns(req.user.id);
  if (markdowns) {
    res.status(200).json(markdowns);
  } else {
    res.status(400).json("do not have any notes to show");
  }
});
router.post("/grammercheck", async (req, res) => {
const response =await checkGrammar(req.body);
if(response){
  res.status(201).json(response);
}
else{
  res.status(400).json("failed to check grammer")
}

});

router.get("/note", async (req, res) => {
  const markdown = await getMarkdowns(req.user.id);
  const fileId = req.query.id;
  const file = markdown.find((file) => file.id == fileId);
  const html = await marktoHTML(file?file.content:markdown[0].content);
  if (html) {
    res.status(201).send(html);
  } else {
    res.status(400).send({ message: "could not get markdown" });
  }
});

userRouter.post("/createUser", (req, res) => {
  const user = req.body;
  const response = createUser(user);
  if (response) {
    const token = createToken(user);

    res.status(201).json({ message: "User created successfully!", token });
  } else {
    res.status(400).json({ message: "Failed to create user!" });
  }
});

userRouter.post("/signin", (req, res) => {
  const user = req.body;
  const response = login(user);
  if (response) {
    const token = createToken(user);
    res.status(201).json({ message: "User login successfully!", token });
  } else {
    res.status(400).json({ message: "Failed to login user!" });
  }
});
  const route={router,userRouter};
  export default route;
