var express = require('express');
var mongoose = require('mongoose');
var chartdata = require('../model/chart');

var router = express.Router();

router.post('/update', function(req,res,err){

    var _id = mongoose.Types.ObjectId(req.body._id);
    var uodateStuff = {
            "year"     : req.body.year,
            "month"    : req.body.month,
            "goal.total"    : parseInt(req.body.offGoal)
                        +parseInt(req.body.apGoal)
                        +parseInt(req.body.b2bGoal)
                        +parseInt(req.body.b2cGoal)
                        +parseInt(req.body.ctGoal)
                        +parseInt(req.body.bdGoal)
                        +parseInt(req.body.scGoal),
            "goal.off" : parseInt(req.body.offGoal),
            "goal.ap"  : parseInt(req.body.apGoal),
            "goal.b2b" : parseInt(req.body.b2bGoal),
            "goal.b2c" : parseInt(req.body.b2cGoal),
            "goal.ct" : parseInt(req.body.ctGoal),
            "goal.bd" : parseInt(req.body.bdGoal),
            "goal.sc" : parseInt(req.body.scGoal),
            "regDate"  : new Date()
    };

    chartdata.update({"_id"    : _id}, {$set: uodateStuff},function(err) {
        if (err) {
            console.log(err);
        } else {
        res.sendStatus(304);
        }
    });
});

router.post('/delete', function(req,res,err){
    chartdata.remove({_id    : req.body._id},function(err,silence){
        if(err){
            console.log(err);
            throw err;
        }
        res.sendStatus(304);
    });
});

router.post('/achiveDelete', function(req,res,err){
    var id2 = mongoose.Types.ObjectId(req.body.achiveid);
    chartdata.update({'Achievement._id': id2}, {$pull: {'Achievement': {"_id" : id2}}},function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully added");
            res.sendStatus(304);
        }
    })
});

router.post('/achiveUpdate', function(req,res,err){
    var id2 = mongoose.Types.ObjectId(req.body.ahcivid);
    var updateStuff = {
        "Achievement.$.week" : req.body.week,
        "Achievement.$.off"  : req.body.offAchievement,
        "Achievement.$.ap"   : req.body.apAchievement,
        "Achievement.$.b2b"  : req.body.b2bAchievement,
        "Achievement.$.b2c"  : req.body.b2cAchievement,
        "Achievement.$.ct"   : req.body.ctAchievement,
        "Achievement.$.bd"   : req.body.bdAchievement,
        "Achievement.$.sc"   : req.body.scAchievement
    }
    //console.log(updateStuff)
    chartdata.update(
        {"Achievement._id" : id2},
        {
            $set: updateStuff
        },function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully added");
                res.sendStatus(304);
            }
        })
});


router.post('/insertAdd', function(req,res,err) {
    console.log("request=>",req.body);
    var id2 = mongoose.Types.ObjectId(req.body.id1);
    console.log(id2)
    var aaa = {
        "week": req.body.week,
        "off": req.body.offAchievement,
        "ap": req.body.apAchievement,
        "b2b": req.body.b2bAchievement,
        "b2c": req.body.b2cAchievement,
        "ct": req.body.ctAchievement,
        "bd": req.body.bdAchievement,
        "sc": req.body.scAchievement
    }
    console.log("chartdatas=>",aaa);

    chartdata.update({_id: id2}, {$push: {"Achievement" : aaa}},function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully added");
            res.sendStatus(304);
        }
    })
});


router.post('/insert', function(req,res,err){
    console.log(req.body);

    var chartdatas = new chartdata({
        year           : req.body.year,
        month          : req.body.month,
        week           : req.body.week,
        goal           : {
            total    : parseInt(req.body.offGoal)
            +parseInt(req.body.apGoal)
            +parseInt(req.body.b2bGoal)
            +parseInt(req.body.b2cGoal)
            +parseInt(req.body.ctGoal)
            +parseInt(req.body.bdGoal)
            +parseInt(req.body.scGoal),
            off : req.body.offGoal,
            ap  : req.body.apGoal,
            b2b : req.body.b2bGoal,
            b2c : req.body.b2cGoal,
            ct  : req.body.ctGoal,
            bd  : req.body.bdGoal,
            sc  : req.body.scGoal
        },
        Achievement     : [],
        salese:{},
        regDate   : new Date()
    });

    chartdatas.save(function(err,silence){
        if(err){
            console.log(err);
            throw err;
        }
        res.redirect('./list');
    });
});

router.post('/totalSales', function(req, res, next) {
    var _id = mongoose.Types.ObjectId(req.body._id);
    var _id1 = mongoose.Types.ObjectId(req.body._id);
    console.log(_id1)
    chartdata.aggregate( [
        {
            $match: {
                "_id" : _id
            }
        },
        {
            $unwind : "$Achievement"
        },
        {
            $group:
            {
                _id: {"_id" : "$_id"},
                count: { $sum: 1 },
                off : { $sum: "$Achievement.off" },
                ap  : { $sum: "$Achievement.ap" },
                b2b : { $sum: "$Achievement.b2b" },
                b2c : { $sum: "$Achievement.b2c" },
                ct  : { $sum: "$Achievement.ct" },
                bd  : { $sum: "$Achievement.bd" },
                sc  : { $sum: "$Achievement.sc" }
            }
        }
    ]).exec(function(err,chartdatas){
        if(err){
            console.err(err);
            throw err;
        }else if(chartdatas == ''){
            chartdata.update(
                {_id : _id1},
                {$set: {'sales': {
                    off     : 0,
                    ap      : 0,
                    b2b     : 0,
                    b2c: 0,
                    ct: 0,
                    bd: 0,
                    sc: 0,
                    total: 0
                }
                }},function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Successfully added");
                        res.sendStatus(304);
                    }
                })
            console.log("데이터가 없음")
        }else{
        console.log("request=>",chartdatas);
        var salesDate = {
            off     : chartdatas[0].off,
            ap      : chartdatas[0].ap,
            b2b     : chartdatas[0].b2b,
            b2c     : chartdatas[0].b2c,
            ct      : chartdatas[0].ct ,
            bd      : chartdatas[0].bd,
            sc      : chartdatas[0].sc,
            total   : chartdatas[0].off+chartdatas[0].ap+chartdatas[0].b2b+chartdatas[0].b2c+chartdatas[0].ct+chartdatas[0].bd+chartdatas[0].sc
        }
        console.log("salesDate=>",_id1);
        chartdata.update(
            {_id : _id1},
            {$set: {'sales': salesDate}},function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully added");
                    res.sendStatus(304);
                }
            })
        }
    });
});

router.get('/list', function(req, res, next) {
    chartdata.find().sort({regDate:-1}).exec(function(err,chartdatas){
        if(err){
            console.err(err);
            throw err;
        }
        res.render("chartList.ejs",{chartdatas:chartdatas})
    });
});

router.get('/lists', function(req, res, next) {
    chartdata.find().sort({regDate:-1}).exec(function(err,chartdatas){
        if(err){
            console.err(err);
            throw err;
        }
        res.send(chartdatas)
    });
});

module.exports = router;
