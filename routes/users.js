const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();

router.route('/signup').post(async function(req,res){
  res.setHeader('Content-Type', 'application/json');
  const checkUser = await prisma.user.findMany({
    where: {
      username: req.body.username
    }
  });
  if(checkUser.length === 0){
    const newUser = await prisma.user.create({
      data: {
        username: req.body.username,
        password: req.body.password
      }
    });
    res.end(JSON.stringify({registered : '1'}));
  } else {
    res.end(JSON.stringify({registered : '0'}));
  }
});

router.route('/signin').post(async function(req,res){
  res.setHeader('Content-Type', 'application/json');
  const checkUser = await prisma.user.findMany({
    where: {
      username: req.body.username
    }
  });
  console.log(checkUser)
  if(checkUser.length === 0){
    res.end(JSON.stringify({signed : '0'}));
  } else {
    if(checkUser[0].username === req.body.username && checkUser[0].password === req.body.password)
    res.end(JSON.stringify({signed : '1'}));
  }
});
module.exports = router;
