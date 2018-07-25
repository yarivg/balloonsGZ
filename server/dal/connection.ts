// Import the mongoose module
let mongoose = require("mongoose");

// Set up default mongoose connection
let mongoDB = process.env.MONGODB_URI;

// If we couldn't get the value so set as local host.
if (!mongoDB) {
  mongoDB = "mongodb://localhost:27017/balloons";
}
mongoose.connect(mongoDB, { useNewUrlParser: true });

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
// Get the default connection
let db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export {
  mongoose,
  db,
};
