import { Router } from "express";
import { getMarkdowns, createMarkdown, createUser, login } from "./prisma.js";
import marktoHTML from "./md_to_html.js";
import multer from "multer";
import { createToken } from "./authentication.js";

const upload = multer({dest:"/filecontainer"});
const router = Router();
const userRouter = Router();

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
router.get("/grammercheck", (req, res) => {
  res.send("<h1>grammer check</h1>")
});

router.get("/note", async (req, res) => {
  try{
  const markdown = await getMarkdowns(req.user);
  const html = await marktoHTML(markdown[0].content);
  if (html) {
    res.status(201).send(html);
  } else {
    res.status(400).send({ message: "could not get markdown" });
  }
}
catch(error){
  console.error("Error is :",error)
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
