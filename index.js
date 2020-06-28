const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');
const e = require('express');
const cors = require('cors');



app.use(bodyparser.json());
app.use(cors({origin:'http://localhost:3000'}))

db_config= { 
    host: '94.73.146.188',
    user: 'varul_proje1',
    password: 'T&90tv4p', 
    database: 'varulf_com_proje1',
    multipleStatements: true
};

var mysqlConnection= mysql.createConnection(db_config);

function handleDisconnect() {
    mysqlConnection = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.
  

mysqlConnection.connect((err)=>{
    if(!err)   {
        console.log('DB connection succeed.');
        setTimeout(handleDisconnect, 80000);
    }else
        console.log('DB connection failed \n Error: '+ JSON.stringify(err, undefined, 2));

});
mysqlConnection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

app.listen(4000, ()=> console.log('Express server is running at port: 4000'));


//Get all employees 
app.get('/posts', (req, res)=> {
    mysqlConnection.query('SELECT * FROM varulf_com_proje1.posts', (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err);
        }
    } )
});
//Get an employees with ID
app.get('/posts/:id', (req, res)=> {
    mysqlConnection.query('SELECT * FROM varulf_com_proje1.posts WHERE id = ?',
    [req.params.id],
     (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err);
        }
    } )
});
//Delete an employees with ID
app.delete('/posts/:id', (req, res)=> {
    mysqlConnection.query('DELETE FROM varulf_com_proje1.posts WHERE id = ?',
    [req.params.id],
     (err, rows, fields)=>{
        if(!err){
            res.send('Deleted Item Successfully.');
        }else{
            console.log(err);
        }
    } )
});
//Insert Post using sql stored procedures
app.post('/posts', (req, res)=> {
    let post = req.body;
    var sql = "SET @id = ?; SET @title = ?; SET @message= ?;CALL PostAddOrEdit(@id,@title,@message)";
    mysqlConnection.query(sql,
    [post.id, post.title, post.message],
     (err, rows, fields)=>{
        if(!err){
            rows.forEach(item => {
                if(item.constructor == Array)
                    res.send('Inserted post at id: '+ item[0].id)
            });
        }else{
            console.log(err);
        }
    } )
});
//UPDATE existing Post using sql stored procedures
app.put('/posts', (req, res)=> {
    let post = req.body;
    var sql = "SET @id = ?; SET @title = ?; SET @message= ?;CALL PostAddOrEdit(@id,@title,@message)";
    mysqlConnection.query(sql,
    [post.id, post.title, post.message],
     (err, rows, fields)=>{
        if(!err){
            res.send('Updated successfully');
        }else{
            console.log(err);
        }
    } )
});



