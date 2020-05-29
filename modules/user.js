/*
    数据增删改查模块封装
    req.query 解析GET请求中的参数 包含在路由中每个查询字符串参数属性的对象，如果没有则为{}
    req.params 包含映射到指定的路线“参数”属性的对象,如果有route/user/：name，那么“name”属性可作为req.params.name
    req.body通常用来解析POST请求中的数据
     +req.query.id 可以将id转为整数
 */
// 引入mysql
var mysql = require('mysql');
// 引入mysql连接配置
var mysqlconfig = require('../config/mysql');
// 引入连接池配置
var poolextend = require('./poolextend');
// 引入SQL模块
var sql = require('./sql');
// 引入json模块
var json = require('./json');
var fs = require('fs');
var globalObj = require('../config')  
// 使用连接池，提升性能
var pool = mysql.createPool(poolextend({}, mysqlconfig));

// 将时间戳timestamp转化为YYYY-MM-DD HH:mm:ss格式（满足数据库存储datetime需求）
function timestampToTime(timestamp) {
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate();
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D;
}

// 用户
var user = {
    // 登录
    login: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            var param = req.body;
            connection.query(sql.userSelect, param.tel, function (err, result) {
                console.log(result)
                var resultArray = result[0]; // 接口返回值
                if (result.length == 0) { // 未注册
                    result = undefined
                } else {
                    if (resultArray.password === param.password) { // 密码正确
                        result = 'login'
                    } else { // 密码错误
                        result = 'wrong'
                    }
                }
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    // 个人信息
    userCenter: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            var param = req.query;
            connection.query(sql.userSelect, param.tel, function (err, result) {
                console.log(result)
                json(res, result[0]);
                // 释放连接
                connection.release();
            });
        });
    },
    // 注册
    register: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            var param = req.body;
            param.id = new Date().getTime();
            connection.query(sql.userSelect, param.tel, function (err, result) {
                if (result.length != 0) { // 已经注册
                    result = 'alreadyRegister'
                    json(res, result);
                } else {
                    connection.query(sql.userInsert, [param.id, param.tel, param.password, 1, '小游用户'], function (err, result) {
                        if (result) {
                            result = 'register'
                        }
                        // 以json形式，把操作结果返回给前台页面
                        json(res, result);
                        // 释放连接
                        connection.release();
                    });
                }
                // 释放连接
                connection.release();
            });

        });
    },
};

// 景点信息
var spots = {
    get: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            connection.query(sql.spotSelect, function (err, result) {
                console.log(result)
                if (result == undefined) {
                    result = 'notData'
                }
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    findSpot: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            // if (req.query.searchWord) {
            //     console.log(1111)
            //     sql.spotSelect = 'select * from spots';
            //     sql.spotSelect = sql.spotSelect + " where title like '%" + req.query.searchWord + "%'";
            // }
            console.log(sql.spotSelect)
            connection.query(sql.spotSelect + " where title like '%" + req.query.searchWord + "%'", function (err, result) {
                console.log(result)
                if (result == undefined) {
                    result = 'notData'
                }
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    post: function (req, res, next) {
        var param = req.body;
        param.id = new Date().getTime();
        console.log(param)
        pool.getConnection(function (err, connection) {
            connection.query(sql.spotAdd, ["" + param.id + "", param.title, param.desc, timestampToTime(param.startDate), timestampToTime(param.endDate),param.image], function (err, result) {
                console.log(result)
                console.log(err)
                // if (result==undefined) { 
                //     result = 'notData'
                // } 
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    update: function (req, res, next) {
        var param = req.body;
        console.log(param)
        console.log([param.title, param.desc, timestampToTime(param.startDate), timestampToTime(param.endDate), "" + param.id + ""])
        pool.getConnection(function (err, connection) {
            connection.query(sql.spotUpdate, [param.title, param.desc, timestampToTime(param.startDate), timestampToTime(param.endDate),param.image, "" + param.id + ""], function (err, result) {
                console.log(result)
                console.log(err)
                // if (result==undefined) { 
                //     result = 'notData'
                // } 
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    delete: function (req, res, next) {
        var param = req.body;
        console.log(param)
        console.log([param.title, param.desc, timestampToTime(param.startDate), timestampToTime(param.endDate), "" + param.id + ""])
        pool.getConnection(function (err, connection) {
            connection.query(sql.spotDelete, "" + param.id + "", function (err, result) {
                console.log(result)
                console.log(err)
                // if (result==undefined) { 
                //     result = 'notData'
                // } 
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
}

// 活动资讯
var activityInfo = {
    get: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            connection.query(sql.activitySelect, function (err, result) {
                console.log(result)
                if (result == undefined) {
                    result = 'notData'
                }
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    findActivity: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            console.log(sql.activitySelect)
            connection.query(sql.activitySelect + " where title like '%" + req.query.searchWord + "%'", function (err, result) {
                console.log(result)
                if (result == undefined) {
                    result = 'notData'
                }
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    post: function (req, res, next) {
        var param = req.body;
        param.id = new Date().getTime();
        console.log(param)
        pool.getConnection(function (err, connection) {
            connection.query(sql.activityAdd, ["" + param.id + "", param.title, param.desc,param.image], function (err, result) {
                console.log(result)
                console.log(err)
                // if (result==undefined) { 
                //     result = 'notData'
                // } 
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    update: function (req, res, next) {
        var param = req.body;
        pool.getConnection(function (err, connection) {
            connection.query(sql.activityUpdate, [param.title, param.desc, param.image,"" + param.id + ""], function (err, result) {
                console.log(result)
                console.log(err)
                // if (result==undefined) { 
                //     result = 'notData'
                // } 
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },

    delete: function (req, res, next) {
        var param = req.body;
        pool.getConnection(function (err, connection) {
            connection.query(sql.activityDelete, "" + param.id + "", function (err, result) {
                console.log(result)
                console.log(err)
                // if (result==undefined) { 
                //     result = 'notData'
                // } 
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
}

// 电子门票
var ticket = {
    get: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            connection.query(sql.ticketSelect, function (err, result) {
                console.log(result)
                if (result == undefined) {
                    result = 'notData'
                }
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    findTicketById: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            connection.query(sql.ticketSelect + " where id = " + req.query.ticketId, function (err, result) {
                console.log(result)
                if (result == undefined) {
                    result = 'notData'
                }
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    findTicket: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            connection.query(sql.ticketSelect + " where title like '%" + req.query.searchWord + "%'", function (err, result) {
                console.log(result)
                if (result == undefined) {
                    result = 'notData'
                }
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    post: function (req, res, next) {
        var param = req.body;
        param.id = new Date().getTime();
        console.log(param)
        pool.getConnection(function (err, connection) {
            connection.query(sql.ticketAdd, ["" + param.id + "", param.title, Number(param.price), param.desc], function (err, result) {
                console.log(result)
                console.log(err)
                // if (result==undefined) { 
                //     result = 'notData'
                // } 
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    update: function (req, res, next) {
        var param = req.body;
        console.log(param)
        console.log([param.title, param.desc, timestampToTime(param.startDate), timestampToTime(param.endDate), "" + param.id + ""])
        pool.getConnection(function (err, connection) {
            connection.query(sql.ticketUpdate, [param.title, param.price, param.desc, "" + param.id + ""], function (err, result) {
                console.log(result)
                console.log(err)
                // if (result==undefined) { 
                //     result = 'notData'
                // } 
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    delete: function (req, res, next) {
        var param = req.body;
        pool.getConnection(function (err, connection) {
            connection.query(sql.ticketDelete, "" + param.id + "", function (err, result) {
                console.log(result)
                console.log(err)
                // if (result==undefined) { 
                //     result = 'notData'
                // } 
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
}

// 停车信息
var parking = {
    post: function (req, res, next) {
        var param = req.body;
        param.id = new Date().getTime();
        console.log(param)
        pool.getConnection(function (err, connection) {
            connection.query(sql.parkingAppoint, ["" + param.id + "", param.carNum, 1, 1, param.parkingStartTime + ':00', param.parkingEndTime + ':00'], function (err, result) {
                if (result) {
                    result = 'success'
                }
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    get: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            console.log(sql.parkingSelect)
            connection.query(sql.parkingSelect, req.query.tel, function (err, result) {
                console.log(result)
                if (result == undefined) {
                    result = 'notData'
                }
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    parkingByArea: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            connection.query(sql.parkingByArea, req.query.area, function (err, result) {
                console.log(result)
                if (result == undefined) {
                    result = 'notData'
                }
                var now = new Date()
                var results=[];
                result.forEach(item => {
                    var obj={};
                    console.log(now)
                    console.log(new Date(item.endTime))
                    console.log(now >new Date(item.endTime))
                    if (now > item.endTime) { // 未使用
                       obj={
                           num:item.num,
                           status:0
                       }
                    }
                    if (now <= item.endTime && now >= item.startTime) { // 正在使用
                        obj={
                            num:item.num,
                            carNum:item.carNum,
                            startTime:item.startTime,
                            endTime:item.endTime,
                            price:item.price,
                            status:2
                        }                 
                    }
                    if (now < item.startTime) { // 预约中
                        obj={
                            num:item.num,
                            carNum:item.carNum,
                            startTime:item.startTime,
                            endTime:item.endTime,
                            price:item.price,
                            status:1
                        } 
                    }
                    results.push(obj)
                });
                console.log(results)
                json(res, results);
                // 释放连接
                connection.release();
            });
        });
    },
}

// 电子票务
var buy = {
    post: function (req, res, next) {
        var param = req.body;
        param.id = new Date().getTime();
        param.status = timestampToTime(param.id) >= param.selectPlayDate ? 2 : 1
        console.log(timestampToTime(param.id))
        console.log(param.selectPlayDate)
        console.log(param.status)
        console.log(param)
        pool.getConnection(function (err, connection) {
            connection.query(sql.buyAdd, ["" + param.id + "", param.selectPlayDate, param.number, param.ticketPay, param.ticketId, param.uTel, param.status], function (err, result) {
                if (result) {
                    result = 'success'
                }
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    get: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            connection.query(sql.buySelect, req.query.tel, function (err, result) {
                console.log(result)
                if (result == undefined) {
                    result = 'notData'
                }
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    buySearch: function (req, res, next) {
        if(req.query.selectPlayDate){
            sql.buySearch ='select * from buy';
            sql.buySearch +=' where selectPlayDate ='+'"'+req.query.selectPlayDate+'"';
        }
        console.log(sql.buySearch)
        pool.getConnection(function (err, connection) {
            connection.query(sql.buySearch,  function (err, result) {
                console.log(result)
                if (result == undefined) {
                    result = 'notData'
                }
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
}

var file={
    upload: function (req, res, next) { 
        var des_file =  "uploadFiles/file/" + req.originalname;
        fs.readFile(req.path, function (error, data) {
          if (error) {
              return console.error(error);
          }
          fs.writeFile(des_file, data, function (err) {
            if (err) {
                // 接收失败
                console.log("----------接收失败----------\n");
                console.log(err);
            }else {
              // 接收成功
              // 删除缓存文件
              fs.unlink(req.path, function(err){
                  if (err){
                    console.log('文件:'+req.path+'删除失败！');
                      return console.error(err);
                  } 
              })
              // 将文件信息写入数据库
              var time = timestampToTime(new Date().getTime()); 
              // 前端传过来的参数
              var addSqlParams = [
                req.fieldname, 
                req.originalname, 
                req.filename,
                req.encoding,
                req.mimetype, 
                req.size, 
                des_file, 
                __dirname + '/' + req.path, 
                time
              ] 
              // 插入数据
              pool.getConnection(function (err, connection) {
                connection.query(sql.upload, addSqlParams, function (err, result) {
                    if (err) {
                        return console.error(err);
                    }else { 
                        var response = {
                          status:200,
                          message: '上传成功!',
                          data:{
                            id:result.insertId,
                            path:globalObj.rootDir+ '/' + des_file,
                            fileName:req.filename,
                            time:time,
                            type:req.mimetype,
                            size:req.size, 
                          }
                        };
                        res.json(response);
                        connection.release();
                    }
                })
              })
            }
          })
        })
         
      }
}

module.exports = {
    user,
    spots,
    activityInfo,
    ticket,
    parking,
    buy,
    file
};