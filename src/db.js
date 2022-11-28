import mongoose from "mongoose";

mongoose.connect("mongodb://wetube-mongo:27017/wetube")

const db = mongoose.connection;

const handleOpen = () => console.log("👍 Connected to DB");
const handelError = (error) => console.log("🤦‍♀️ DB Error", error)
db.on("error", handelError); // 여러 번 발생 가능
db.once("open", handleOpen); // 한 번만 발생