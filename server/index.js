const express = require('express');
const bodyParser = require('body-parser');
const multer  = require('multer');

// controller methods
const { extract_questions } = require('./controllers/questions');

// create express app
const app = express();
const port = 5000;

// file uploads handler
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// define middleware to fetch url query params and json body
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

// define routes
app.post('/api/extract_questions', upload.single('filepond'), extract_questions);

app.listen(port, () => console.log(`app listening on port ${port}!`));