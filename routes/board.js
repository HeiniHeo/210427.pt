const express = require('express');
const router = express.Router();
const mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'rouTer'
});
connection.connect();

router.get('/',(req,res)=>{
    res.render('../views/index.html',{
        title: 'board입니다'
    });
});

router.get('/list',(req,res)=>{// board를 받는건데 이미 server.js에서 use로 /board라고 설정 해놨기 때문에 여기서는 다음uri를 입력해준다
    connection.query("SELECT idx, subject, board_name, content, date_format(today,'%Y-%m-%d')as today, hit FROM board2 ORDER BY idx desc",(error,results)=>{
        if(error){
            console.log(error)
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
    });
});  

router.get('/write',(req,res)=>{
    res.render('./board/write.html');
});

router.post('/write',(req,res)=>{
    console.log(req.body);
    let title = req.body.title;
    let writer = req.body.writer;
    let content = req.body.content;
    connection.query(`INSERT INTO board2 (subject, board_name,content,hit) values ('${title}','${writer}','${content}',0)`,(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect(`/board/view?idx=${results.insertId}`);
        };
    });
});

router.get('/view',(req,res)=>{
    connection.query(`UPDATE board2 SET hit=hit+1 WHERE idx='${req.query.idx}'`);

    connection.query(`SELECT * FROM board2 WHERE idx=${req.query.idx}`,(error,results)=>{
        if(error){
            console.log(error)
        }else{
            res.render('./board/view.html',{
                list: results,
            })
        };
    });

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
    // let idx = req.query.idx;
    let title = req.body.title;
    let writer = req.body.writer;
    let content = req.body.content;

    connection.query(`UPDATE board2 SET subject='${title}', board_name='${writer}', content='${content}' WHERE idx=${req.query.idx}`,(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect(`/board/view?idx=${req.query.idx}`)
        };
    });
});

router.get('/delete',(req,res)=>{
    connection.query(`DELETE FROM board2 WHERE idx = ${req.query.idx}`,(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/board/list');
        }
    });
})

module.exports = router;