//create a express server
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const userRouter = require('./routes/user.js');
const PORT = 3000
app.use(cors());
app.use(express.json());

//create a mongoose connection to localhost 
mongoose.connect('mongodb://localhost:27017/notes', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

//create a rouer    
app.use('/api/user', userRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

