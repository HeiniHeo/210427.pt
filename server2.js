const express = require('express');

const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const mysql = require('mysql');

const main = require('./routes/index');
const board = require('./routes/board');

const app = express();

app.set('view engine','html');
app.use(bodyParser.urlencoded({extended:false})); // next()가 포함 되어있음 그래서 상단에 존재해야 아래 값들도 가지고 올 수가 있음
app.use(express.static('public'));

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'rouTer'
});
connection.connect();

app.use('/',main);  //page를 작동시킬때 routes 파일에 있는 index 를 거쳐서 작동시킨다는 뜻
app.use('/board',board);


nunjucks.configure('views',{
    express:app,
});

app.listen(3000,()=>{
    console.log('server starting port 3000')
})