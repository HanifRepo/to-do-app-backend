require('dotenv').config();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/checkinput' ,autenticateToken ,async function(req,res){
    res.setHeader('Content-Type', 'application/json');
    var todoData = req.body.todoValue;
    if(req.answer.name === req.body.username){
      console.log('Inside If');
    const checkUser = await prisma.user.findMany({
      where: {
        username: req.body.username
      }
    });
    const getUserToDoList = await prisma.todolist.findMany({
      where: {
        userid: checkUser[0].id
      }
    })
    var checkToDoValue = true;
    for(let i of getUserToDoList){
      if(i.todoValue === todoData){
        checkToDoValue = false;
        break;
      }
    }
    if(checkToDoValue){
      const newToDOValue = await prisma.todolist.create({
        data: {
            todoValue: todoData,
            iscompleted: "uncompleted",
            ischecked: "false",
            user: {
                connect: {
                    id: checkUser[0].id
                }
            }
          
        }
      });
      res.end(JSON.stringify({status : 'signed'}));
    } else {
      res.end(JSON.stringify({status : 'repeated'}));
    }
    }else{
      res.sendStaus(403);
      res.end();
    }
});

router.post('/setuplist',autenticateToken,async function(req,res){
    res.setHeader('Content-Type', 'application/json');
    console.log(req.answer.name);
    console.log( req.body.username);
    if(req.answer.name === req.body.username){
    const checkUser = await prisma.user.findMany({
      where: {
        username: req.body.username
      }
    });
    const getToDoValue = await prisma.todolist.findMany({
        where: {
          userid: checkUser[0].id
        }
      })
    if(getToDoValue.length === 0){
      res.end(JSON.stringify({status: 'empty'}));
    } else {
      res.end(JSON.stringify(getToDoValue));
    }
    }else{
      res.sendStaus(403);
    }
});

router.post('/completesingleitem',autenticateToken,async function(req,res){
    res.setHeader('Content-Type', 'application/json');
    if(req.answer.name === req.body.username){
    const checkUser = await prisma.user.findMany({
      where: {
        username: req.body.username
      }
    });
    const toDoValues = await prisma.todolist.findMany({
        where: {
            userid: checkUser[0].id
        }
    });
    for(let i of toDoValues){
        if(i.todoValue === req.body.todovalue){
            const toDoupdate = await prisma.todolist.update({
                where: {
                    id: i.id
                },
                data: {
                    iscompleted: "completed"
                }
            });
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({status : "completed"}));
            break;
        }
    }
    }else{
      res.sendStaus(403);
      res.end();
    }
});

router.post('/deletesingleitem',autenticateToken,async function(req,res){
    res.setHeader('Content-Type', 'application/json');
    if(req.answer.name === req.body.username){
    const checkUser = await prisma.user.findMany({
      where: {
        username: req.body.username
      }
    });
    const toDoValues = await prisma.todolist.findMany({
        where: {
            userid: checkUser[0].id
        }
    });
    for(let i of toDoValues){
        if(i.todoValue === req.body.todovalue){
            const toDoupdate = await prisma.todolist.delete({
                where: {
                    id: i.id
                }
            });
            res.send(JSON.stringify({status : "deleted"}));
            break;
        }
    }
    }else{
      res.sendStaus(403);
      res.end();
    }
});

router.post('/completebatchitem',autenticateToken,async function(req,res){
  if(req.answer.name === req.body.username){
    const checkUser = await prisma.user.findMany({
      where: {
        username: req.body.username
      }
    });
    const toDoValues = await prisma.todolist.findMany({
        where: {
            userid: checkUser[0].id
        }
    });
    var valueArray = req.body.todovalues;
    for(let i of toDoValues){
        for(j of valueArray){
            if(i.todoValue === j){
                const toDoupdate = await prisma.todolist.update({
                    where: {
                    id: i.id
                    },data: {
                        iscompleted: "completed"
                    }
                });
                res.send(JSON.stringify({status : "Batch Completed"}));
                break;
        }
        }
    }
  }else{
    res.sendStaus(403);
    res.end();
  }
});

router.post('/deletebatchitem',autenticateToken,async function(req,res){
  if(req.answer.name === req.body.username){  
    const checkUser = await prisma.user.findMany({
      where: {
        username: req.body.username
      }
    });
    const toDoValues = await prisma.todolist.findMany({
        where: {
            userid: checkUser[0].id
        }
    });
    var valueArray = req.body.todovalues;
    for(let i of toDoValues){
        for(j of valueArray){
            if(i.todoValue === j){
                const toDoupdate = await prisma.todolist.delete({
                    where: {
                    id: i.id
                    }
                });
                res.send(JSON.stringify({status : "Batch Deleted"}));
                break;
        }
        }
    }
  }else{
    res.sendStaus(403);
    res.end();
  }
});

function autenticateToken(req,res,next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token === null) return res.sendStaus(401);

  jwt.verify(token,process.env.SECRET_KEY,(err,name) =>{
    if(err) return res.sendStaus(403);
    req.answer = name;
  })
  next();
}

module.exports = router;
