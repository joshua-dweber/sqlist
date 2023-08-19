const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const port = 9000;

app.get('/sql', (req, res) => {
    res.send(JSON.parse(fs.readFileSync('sql.json')));
});

app.post('/sql', (req, res) => {
    let sqls = JSON.parse(fs.readFileSync('sql.json'));
    sqls.push({ description: req.body.description, sql: req.body.sql })
    fs.writeFileSync('sql.json', JSON.stringify(sqls));
    res.send(JSON.parse(fs.readFileSync('sql.json')));
})

app.listen(port, () => {
    console.log(`SQLIST server listening on ${port}`)
})