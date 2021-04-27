const express = require('express');
const router = express.Router();  // == server2.js에서 app과 같은 역할

router.get('/',(req,res)=>{
    res.render('index.html',{
        title : 'homepage'
    });
});

module.exports = router; // same as app.listen
                         // module에 보내서 router로 받는,,?