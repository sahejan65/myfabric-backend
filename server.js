const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/products',  require('./routes/products'));
app.use('/api/orders',    require('./routes/orders'));
app.use('/api/stitching', require('./routes/stitching'));
app.use('/api/offers',    require('./routes/offers'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use((req, res) => res.status(404).json({ message: `Route ${req.method} ${req.path} not found` }));
app.use((err, req, res, next) => { console.error(err.stack); res.status(500).json({ message: err.message }); });

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/myfabric')
  .then(() => { console.log('✅ MongoDB connected'); app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`)); })
  .catch(err => { console.error('❌ DB:', err.message); process.exit(1); });
