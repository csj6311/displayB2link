# displayB2link
비투링크디스플레이


디비설정관련
해당디비 사용유저등록

db.createUser(
    {
        user: "displayadmin",
        pwd: "qlxnfldzm2014!",
        roles: [
            { role: "readWrite", db: "display" }
        ]
    }
)

// 개발환경
var devConfig = {
    host: '192.168.0.241',
    user: 'scm',
    pwd: 'b2linkscm!',
    db: 'scm',
    port: '27017'
};

// 디스플레이
var displayConfig = {
    host: '192.168.0.241',
    user: 'displayadmin',
    pwd: 'qlxnfldzm2014!',
    db: 'display',
    port: '27017'
};

// 운영환경
var realConfig = {
    host: '222.239.10.115',
    user: 'scm',
    pwd: 'qlxnlinkscm',
    db: 'scm',
    port: '27017'
};

var dbInfo = displayConfig;
var dbURI = 'mongodb://' + dbInfo.user + ':' + dbInfo.pwd + '@' + dbInfo.host + ':' + dbInfo.port + '/' + dbInfo.db;
var connection =  mongoose.connect(dbURI);
module.exports = connection;