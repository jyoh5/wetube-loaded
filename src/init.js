// require("dotenv").config();
import "dotenv/config";
import "./db" // 서버보다 더 늦게 시작. 느리기 때문!
import "./models/Video";
import "./models/User";
import app from "./server"




const PORT = 4000;

const handleListening = () => console.log(`server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening)