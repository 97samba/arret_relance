const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
var helmet = require("helmet");
require("dotenv").config();
const path = require("path");
const port = process.env.APP_BDD_PORT;

const app = express();

//dependances
app.use(cors());

//parse le continu web
app.use(bodyParser.json());

//contre les attaques web
app.use(helmet());

//les routes
app.use("/api", require("./Routes/db"));
app.use("/api", require("./Routes/win"));
app.use("/api", require("./Routes/excel"));
//pour l'acces qux images
app.use("/", express.static(path.join(__dirname, "/public")));

app.listen(port, () => console.log("Server started at port", port));
