const express = require('express');
const path = require("path");
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
app.use("/tinymce", express.static(path.join(__dirname, "node_modules", "tinymce")));

app.use(async (req, res, next) => {
  try {
    await database.connect();
    next();
  } catch (error) {
    next(error);
  }
});

// Routes
routeAdmin(app);
route(app);

app.use((error, req, res, next) => {
  console.error("Unhandled app error:", error);
  res.status(500).send("Server Error");
});

module.exports = app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}
