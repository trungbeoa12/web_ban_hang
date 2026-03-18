const express = require('express');
const methodOverride = require("method-override");
require("dotenv").config();

const database = require("./config/database.js");

const systemConfig = require("./config/system.js")

const routeAdmin = require("./routers/admin/index.route.js");
const route = require("./routers/client/index.route.js");

const app = express();
const port = process.env.PORT;

database.connect().catch((error) => {
  console.error("Database startup error:", error);
});

app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// App Locals variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;
console.log(__dirname);


app.use(express.static(`${__dirname}/public`));

// Routes
routeAdmin(app);
route(app);

module.exports = app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}
