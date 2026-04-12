require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const port = process.env.PORT || 4000;
const uri = process.env.MONGO_URI;

// routes first
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// connect DB then start server
connectDB(uri).then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}).catch(err => {
  console.error("DB connection failed ❌", err);
});