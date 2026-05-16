const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { router: contactRouter } = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, please try again later.' }
});

app.use('/api/contact', limiter);
app.use('/api/contact', contactRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'banker-wiz' });
});

app.listen(PORT, () => {
  console.log(`Banker Wiz API running on port ${PORT}`);
});
