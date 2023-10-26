const mongoose = require("mongoose");
const config = require("config");

// connect to DB
module.exports = function () {
  const db = config.get("DB-connection-string");
  if (process.env.NODE_ENV !== "test")
    console.log("attempting to connect to " + db);
  mongoose.connect(db).then(() => {
    if (process.env.NODE_ENV !== "test") console.log(`Connected to ${db}...`);
  });
};
