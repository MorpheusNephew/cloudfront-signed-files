import { Router } from "express";
import fileRouter from "./files";

const router = Router()
  .use("/files", fileRouter)
  .get("/", (_req, res) => {
    res.json("Hello world");
  });

export default router;
