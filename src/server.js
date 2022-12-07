import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import {localsMiddleware} from "./middlewares";

const app = express(); // express app 생성
const logger = morgan("dev"); // logger middleware: dev, combined, common, short, tiny

// app settings
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

// app middleware
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.COOKEI_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //     maxAge: 5000,
    // },
    store: MongoStore.create({mongoUrl: process.env.DB_URL})
}));

app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));

// app router
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;