const mongoose = require("mongoose");
const config = require("config");

// connect to DB
module.exports = function () {
  const db = config.get("DB-connection-string");
  console.log("attempting to connect to " + db);
  mongoose.connect(db).then(() => {
    console.log(`Connected to ${db}...`);
  });
};
