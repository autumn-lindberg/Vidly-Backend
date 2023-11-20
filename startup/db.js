const mongoose = require("mongoose");
const config = require("config");

// connect to DB
module.exports = function () {
  const db =
    process.env.DB_URL ||
    "mongodb://127.0.0.1:27017/vidly"; /*config.get("DB-connection-string");*/
  if (process.env.NODE_ENV !== "test")
    console.log("attempting to connect to " + db);
  mongoose
    .connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      if (process.env.NODE_ENV !== "test") console.log(`Connected to ${db}...`);
    });
};
