const mongoose = require("mongoose");

// connect to DB
module.exports = function () {
  const db =
    process.env.DB_CONNECTION_STRING_DEVELOPMENT ||
    "mongodb://127.0.0.1:27017/vidly";
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
