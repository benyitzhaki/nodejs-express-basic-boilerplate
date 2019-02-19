const express = require('express');
const bodyParser = require('body-parser');

// require custom middleware
const myMiddleware = require('./my_middleware');

// create express app
const app = express();
const port = 3000;

// use custom middleware
app.use(myMiddleware);

// define middleware to fetch url query params and json body
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

// define route methods
const get_method = function(req, res) {
    res.send(basic_response(req, "get"));
};

const post_method = function(req, res) {
    res.send(basic_response(req, "post"));
};

const put_method = function(req, res) {
    res.send(basic_response(req, "put"));
};

const delete_method = function (req, res) {
    res.send(basic_response(req, "delete"));
};

// helper function to fetch requests
const basic_response = function(req, request_type) {
    return `${request_type.toUpperCase()}: Hello World!, 
    Query Params: ${JSON.stringify(req.query)},
    URL Params: ${JSON.stringify(req.params)},
    Body Content: ${JSON.stringify(req.body)}`;
};

// define routes
app.get('/', get_method);
app.get('/:param', get_method);
app.post('/', post_method);
app.put('/', put_method);
app.delete('/', delete_method);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
