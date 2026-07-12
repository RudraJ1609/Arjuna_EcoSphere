require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/database');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('EcoSphere API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const authRoutes = require('./Routes/authRoutes');
app.use('/api/auth', authRoutes);