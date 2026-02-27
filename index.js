const express = require('express');
require("dotenv").config();

const database = require("./config/database.js");

const systemConfig = require("./config/system.js")

const routeAdmin = require("./routers/admin/index.route.js");
const route = require("./routers/client/index.route.js");

database.connect();

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

// App Locals variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;


app.use(express.static("public"));

// Routes
routeAdmin(app);
route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
