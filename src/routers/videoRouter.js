import express from "express";
import { watch, getEdit, postEdit, getUpload, postUpload, deletVideo } from "../controllers/videoControllers";
import { protectorMiddleware } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
// videoRouter.get("/:id(\\d+)/edit", editGet);
// videoRouter.post("/:id(\\d+)/edit", editPost);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deletVideo);
videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(postUpload);

export default videoRouter;