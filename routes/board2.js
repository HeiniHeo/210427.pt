const express = require('express');
const router = express.Router();
const mysql = require('mysql');

let connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'rouTer'
});
connection.connect();

router.get('/',(req,res)=>{
    res.render('../views/index.html',{
        title: 'GO TO BOARD'
    });
});

router.get('/list',(req,res)=>{
    connection.query("SELECT idx, subject, board_name, date_format(today, '%Y-%m-%d')as today, hit FROM board2 ORDER BY idx desc",(error,results)=>{
        if(error){
            console.log(error);
        }else{
            let total_record = results.length;
            results.forEach(ele=>{
                ele.num = total_record;
                total_record--;
            })
            res.render('./board/list.html',{
                list:results,
            });
        }
    })
});

router.get('/write',(req,res)=>{
    res.render('./board/write.html');
});

router.post('/write',(req,res)=>{
    let title = req.body.title;
    let writer = req.body.writer;
    let content = req.body.content;
    connection.query(`INSERT INTO board2 (subject,board_name,content,hit) VALUES ('${title}','${writer}','${content}',0)`,(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect(`/board/view?idx=${results.insertId}`);
        };
    });
});

router.get('/view',(req,res)=>{
    connection.query(`SELECT * FROM board2 WHERE idx=${req.query.idx}`,(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('./board/view.html',{
                list:results,
            });
        };
    });

    connection.query(`UPDATE board2 SET hit=hit+1 WHERE idx=${req.query.idx}`);
});

router.get('/update',(req,res)=>{
    connection.query(`SELECT * FROM board2 WHERE idx=${req.query.idx}`,(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('./board/update.html',{
                list:results,
            });
        };
    });
});

router.post('/update',(req,res)=>{
    connection.query(`UPDATE board2 SET subject='${req.body.title}',board_name='${req.body.writer}',content='${req.body.content}' WHERE idx=${req.query.idx}`,(error,results)=>{
        if(error){
            console.log(error)
        }else{
            res.redirect(`/board/view?idx=${req.query.idx}`);
        };
    });
});

router.get('/delete',(req,res)=>{
    connection.query(`DELETE FROM board2 WHERE idx=${req.query.idx}`,(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/board/list');
        }
    });
});

module.exports = router;