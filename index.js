const express = require('express');
const app = express();
const port = 3000;


const get_method = function(req, res) {
    res.send('GET: Hello World!')
};

const post_method = function(req, res) {
    res.send('POST: Hello World!')
};

const put_method = function(req, res) {
    res.send('PUT: Hello World!')
};

const delete_method = function(req, res) {
    res.send('PUT: Hello World!')
};

app.get('/', get_method);
app.post('/', post_method);
app.put('/', put_method);
app.delete('/', delete_method);



app.listen(port, () => console.log(`Example app listening on port ${port}!`));
