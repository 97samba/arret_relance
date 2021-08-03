const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const path = require("path");
const port = process.env.APP_BDD_PORT;

const app = express();
app.use(cors());
app.use(bodyParser.json());

//les routes windows
app.use("/api", require("./Routes/db"));
app.use("/api", require("./Routes/win"));
app.use("/api", require("./Routes/excel"));
//pour l'acces qux images
app.use("/", express.static(path.join(__dirname, "/public")));

app.listen(port, () => console.log("Server started at port", port));
