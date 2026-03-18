const mongoose = require("mongoose");

module.exports.connect = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return mongoose.connection;
    }

    await mongoose.connect(process.env.MONGO_URL);
    console.log("connect Success!");
    return mongoose.connection;
  } catch (error) {
    console.log("connect error!", error);
    throw error;
  }
};
