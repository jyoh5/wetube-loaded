import express from "express";
import { watch, editGet, editPost, uploadGet, uploadPost } from "../controllers/videoControllers";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch);
videoRouter.route("/:id(\\d+)/edit").get(editGet).post(editPost);
// videoRouter.get("/:id(\\d+)/edit", editGet);
// videoRouter.post("/:id(\\d+)/edit", editPost);
videoRouter.route("/upload").get(uploadGet).post(uploadPost);


export default videoRouter;