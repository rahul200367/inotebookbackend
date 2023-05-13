const connectToMongo = require('./routes/db');
const express = require('express');
const cors  = require('cors');
connectToMongo();
const app = express()
const port = 5000
app.use(cors({
  origin:true
}));
app.use(express.json())
//available routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/note',require('./routes/note'))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})