const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
var express = require('express');
var router = express.Router();

router.route('/checkinput').post(async function(req,res){
    res.setHeader('Content-Type', 'application/json');
    const checkUser = await prisma.user.findMany({
      where: {
        username: req.body.username
      }
    });
    const checkToDoValue = await prisma.todolist.findMany({
        where: {
          userid: checkUser[0].id,
          todoValue: req.body.toDoValue
        }
    })
    if(checkToDoValue.length === 0){
      const newToDOValue = await prisma.todolist.create({
        data: {
            todoValue: req.body.toDoValue,
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
});

router.route('/setuplist').post(async function(req,res){
    res.setHeader('Content-Type', 'application/json');
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
});

router.route('/completesingleitem').post(async function(req,res){
    res.setHeader('Content-Type', 'application/json');
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
});

router.route('/deletesingleitem').post(async function(req,res){
    res.setHeader('Content-Type', 'application/json');
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
});

router.route('/completebatchitem').post(async function(req,res){
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
});

router.route('/deletebatchitem').post(async function(req,res){
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
});


module.exports = router;
