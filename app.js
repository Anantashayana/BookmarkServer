const express = require('express');
const dataRouter = require('./routes/data');
const cors = require('cors');
const loginRouter = require('./routes/login');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Add this line to enable CORS

app.get('/', (req, res) => {
  res.send('Hello World')
})

// Routes
app.use('/api/data', dataRouter);
app.use('/api/login',loginRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
