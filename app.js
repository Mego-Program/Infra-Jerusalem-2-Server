const mongoose = require('mongoose');
const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello Infra-jerusalem-2 Team! This is our Express server.');
});

// MongoDB connection setup
// mongoose.connect('mongodb://localhost/database-name', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('Connected to MongoDB');
// }).catch((err) => {
//     console.error('Connection error', err);
// });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
