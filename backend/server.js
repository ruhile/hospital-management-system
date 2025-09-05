require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const port = process.env.PORT || 4000;
const uri = process.env.MONGO_URI;

connectDB(uri).then(() => {
  app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
});
