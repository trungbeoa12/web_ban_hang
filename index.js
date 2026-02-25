const express = require('express');
const route = require("./routers/client/index.route.js");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

// Routes
route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
