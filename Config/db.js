// mongodb://localhost:27017/expence_eracker
// config/mongodb.js

// kan-importiw mongoose bach n9dro nconnectiw Node.js m3a MongoDB
const mongoose = require("mongoose");

// had function smitha connectDB, hiya li ghadi tdir connection m3a database
// darna async 7it connection katakhod wa9t
const connectDB = async () => {
  try {

    // hna kan9olo l mongoose ittasal b MongoDB
    // 127.0.0.1 = localhost (database khdama f nafs pc)
    // 27017 = port dyal MongoDB
    // brief5 = smiya dyal database
    await mongoose.connect("mongodb://localhost:27017/expence_eracker");

    // ila tconnectat bnejah, katbano had message
    console.log("MongoDB connected successfully ");

  } catch (error) {

    // ila wa93 chi mochkil f connection
    console.error("MongoDB connection failed ");

    // kaytba3 message dyal error
    console.error(error.message);

    // kan7bso server ila ma tconnectatch database
    // 7it ma kaynch ma3na server yb9a khdam bla DB
    process.exit(1);
  }
};

// kan-exportiw function bach n9dro n3ayto liha f app.js
module.exports = connectDB;