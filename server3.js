const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');

const main = require('./routes/index');
const board = require('./routes/board2');

const app = express();

app.set('view engine','html');
nunjucks.configure('views',{
    express:app,
})
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));

app.use('/',main);
app.use('/board',board);

app.listen(3000,()=>{
    console.log('server starting port : 3000')
})