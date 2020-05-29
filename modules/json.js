//json.js
//封装接送模块
var json = function(res, result) {
    if (typeof result === 'undefined') {
        console.log('操作失败')
        res.json({
            code: '0',
            msg: '操作失败'
        });
    }
    else if (result === 'notData') {
        res.json({
            code: '400',
            msg: '没有数据'
        });
    } else if (result === 'success') {
        res.json({
            code: '200',
            msg: '成功'
        });
    }  else if (result === 'register') {
        res.json({
            code: '200',
            msg: '注册成功'
        });
    } else if (result === 'alreadyRegister') {
        res.json({
            code: '400',
            msg: '账户已经注册'
        });
    } else if (result === 'login') {
        res.json({
            code: '200',
            msg: '登录成功'
        });
    }else if (result === 'wrong') {
        res.json({
            code: '400',
            msg: '密码错误'
        });
    } else if (result === 'update') {
        res.json({
            code: '200',
            msg: '更改成功'
        });
    } else if (result.result != 'undefined' && result.result === 'select') {
        res.json({
            code: '200',
            msg: '查找成功',
            data: result.data
        });
    } else if (result.result != 'undefined' && result.result === 'selectall') {
        res.json({
            code: '200',
            msg: '全部查找成功',
            data: result.data
        });
    } else {
        res.json(result);
    }
  };
  module.exports = json;