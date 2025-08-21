const mongoose = require('mongoose')
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI not found in environment variables");
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch((err) => {
  console.error("Failed to connect to MongoDB:", err.message);
});

const LogInSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  Mobile: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: String,
});

const collection = mongoose.model("collection1", LogInSchema);

module.exports = collection;
