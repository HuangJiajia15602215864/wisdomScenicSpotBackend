//sql.js
// SQL语句封裝
var user = {
  userInsert:'INSERT INTO user(id, tel,password,userType,nickName) VALUES(?,?,?,?,?)',
  userSelect: 'select * from user where tel=?',

  spotSelect:'select * from spots',
  spotAdd:'INSERT INTO spots(id, title, descs, startDate, endDate,image) VALUES(?,?,?,?,?,?)',
  spotUpdate:'UPDATE spots SET title=?, descs=?,startDate=?,endDate=?, image=?  WHERE id=?',
  spotDelete: 'DELETE FROM spots WHERE id=?',

  activitySelect:'select * from activityinfo',
  activityAdd:'INSERT INTO activityinfo(id, title, descs,image) VALUES(?,?,?,?)',
  activityUpdate:'UPDATE activityinfo SET title=?, descs=?, image=? WHERE id=?',
  activityDelete: 'DELETE FROM activityinfo WHERE id=?',

  ticketSelect:'select * from ticket',
  ticketAdd:'INSERT INTO ticket(id, title,price,descs) VALUES(?,?,?,?)',
  ticketUpdate:'UPDATE ticket SET title=?, price=?,descs=? WHERE id=?',
  ticketDelete:'DELETE FROM ticket WHERE id=?',
 

  parkingAppoint:'INSERT INTO parking(id, carNum,area,num,startTime,endTime) VALUES(?,?,?,?,?,?)',
  parkingSelect:'select * from parking WHERE uTel=?',
  parkingByArea:'select * from parking WHERE area=?',

  buyAdd:'INSERT INTO buy(id,selectPlayDate,number, ticketPay,ticketId,uTel,status) VALUES(?,?,?,?,?,?,?)',
  buySelect:'select * from buy WHERE uTel=?',
  buySearch:'select * from buy',

  update:'UPDATE userlist SET name=?, age=?,fileId=?,fileUrl=? WHERE id=?',
  delete: 'DELETE FROM userlist WHERE id=?',
  queryById: 'SELECT * FROM userlist WHERE id=?',
  queryByName: `SELECT * FROM userlist WHERE name LIKE CONCAT('%',?,'%')`,
  queryAll: 'SELECT * FROM userlist',
  upload:'INSERT INTO uploadfiles(fieldname, originalName, tmpName, encoding, mimetype, size, path, tmpPath, addTime) VALUES(?,?,?,?,?,?,?,?,?)'
};
module.exports = user;
