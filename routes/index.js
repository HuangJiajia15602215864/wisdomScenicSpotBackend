//router/index.js
var express = require('express');
var router = express.Router();
var multer = require('multer');
// 设置文件缓存的目录
var upload = multer({ dest: './uploadFiles/tmp/'});
var {user,spots,activityInfo,ticket,parking,buy,file} = require('../modules/user');

// 登录
router.post('/login', function(req, res, next) {
  user.login(req, res, next);
});
// 注册
router.post('/register', function(req, res, next) {
  user.register(req, res, next);
});
// 个人信息
router.get('/userCenter', function(req, res, next) {
  user.userCenter(req, res, next);
});

// 获取景点信息
router.get('/spots', function(req, res, next) {
  spots.get(req, res, next);
  
});
// 通过关键字获取景点信息
router.get('/findSpot', function(req, res, next) {
  spots.findSpot(req, res, next);
});
// 新增景点信息
router.post('/spot', function(req, res, next) {
  spots.post(req, res, next);
});
// 更新景点信息
router.post('/updateSpot', function(req, res, next) {
  spots.update(req, res, next);
});
// 删除景点信息
router.post('/deleteSpot', function(req, res, next) {
  spots.delete(req, res, next);
});



// 获取活动资讯
router.get('/activity', function(req, res, next) {
  activityInfo.get(req, res, next);
});
// 通过关键字获取活动资讯
router.get('/findActivity', function(req, res, next) {
  activityInfo.findActivity(req, res, next);
});
// 新增活动资讯
router.post('/activity', function(req, res, next) {
  activityInfo.post(req, res, next);
});
// 更新活动资讯
router.post('/updateActivity', function(req, res, next) {
  activityInfo.update(req, res, next);
});
// 删除活动资讯
router.post('/deleteActivity', function(req, res, next) {
  activityInfo.delete(req, res, next);
});

// 获取电子门票
router.get('/tickets', function(req, res, next) {
  ticket.get(req, res, next);
});
// 通过id获取电子门票
router.get('/findTicketById', function(req, res, next) {
  ticket.findTicketById(req, res, next);
});
// 通过关键字获取电子门票
router.get('/findTicket', function(req, res, next) {
  ticket.findTicket(req, res, next);
});
// 新增电子门票
router.post('/ticket', function(req, res, next) {
  ticket.post(req, res, next);
});
// 更新电子门票
router.post('/updateTicket', function(req, res, next) {
  ticket.update(req, res, next);
});
// 删除活动资讯
router.post('/deleteTicket', function(req, res, next) {
  ticket.delete(req, res, next);
});

// 预约停车
router.post('/parking', function(req, res, next) {
  parking.post(req, res, next);
});
// 通过用户ID获取停车信息
router.get('/parkingSelect', function(req, res, next) {
  parking.get(req, res, next);
});
// 通过区域获取停车信息
router.get('/parkingByArea', function(req, res, next) {
  parking.parkingByArea(req, res, next);
});

// 线上购票
router.post('/buy', function(req, res, next) {
  buy.post(req, res, next);
});
// 通过用户ID获取购票信息
router.get('/buyList', function(req, res, next) {
  buy.get(req, res, next);
});
// 通过搜索获取购票信息
router.get('/buySearch', function(req, res, next) {
  buy.buySearch(req, res, next);
});

// 文件上传
router.post('/upload', upload.array('file'),function(req, res, next) {
  // 文件信息
  if (req.files[0]){
      console.log("----------接收文件----------\n"); 
      console.log(req.files[0]);
  }
  let reqData = req.files[0]
  file.upload(reqData, res, next);
});

module.exports = router;