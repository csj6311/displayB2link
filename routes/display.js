'use strict'
/*=====================================
* 디스플레이데이터 콘트롤관련 페이지
*  - mongoDB 컨넥션은 모델을 지정하는 파일에 인클루드 되어있음
*  - commonFunc 는 전체게시판에서 사용되는 함수 인클루드
*  (현재 페이지 에서는 파일업로드 함수 인클루드)
* =====================================*/

var express = require('express');
var display = require('../model/display');
var chartdata = require('../model/chart');
var commonFunc = require('../common/function/common');
var Promise = require('bluebird');
var fs = require('fs');
var upload = commonFunc.upload;
var router = express.Router();


//===============================================================
// 디스플레이리스트 기능개선
// - 한페이지에서 디스플레이 리스트 롤링시킨다.
//===============================================================




router.get('/play/:divNo', function(req, res) {
    var divNo = req.params.divNo;
    //몽고디비 다른 모델과 조인하는 쿼리
    display.aggregate(
        [
            {
                $lookup :
                {
                    from:"chartmodels", //참조모델
                    localField:"chartData.year", // 참조필드
                    foreignField:"year", // 기준필드
                    as:"accounts" // 값을담는 key값
                }
            },
            {
                $match: // 조건절
                {
                    "divNo": divNo
                }
            }
        ]
    ).exec(function(err,displays){
        res.render("divPlay.ejs",{data : displays})
    })
});


//===============================================================
//디스플레이리스트 전체리스트 출력
//===============================================================

router.get('/list', function(req, res) {
    var divNo = 'all';
    display.find().sort({regDate:-1}).exec(function(err,displays){
        if(err){
            console.err(err);
            throw err;
        }
        res.render("divList.ejs",{datas:displays,divNo:divNo})
        console.log(displays)
    });
});

//===============================================================
//디스플레이리스트 데이터 전달
//===============================================================

router.get('/lists/:divNo', function(req, res) {
    var divNo;
    if(req.params.divNo == 'all'){
        divNo = {};
    }else{
        divNo = {'divNo' : req.params.divNo}
    }
    display.find(divNo).sort({regDate:-1}).exec(function(err,displays){
        if(err){

            throw err;
        }
        console.log(displays)
        res.send(displays)
    });
});

//===============================================================
//디스플레이리스트 츨력
//===============================================================

router.get('/list/:divNo', function(req, res) {
    var divNo = req.params.divNo;
    console.log(divNo)
    display.find({"divNo" : divNo}).sort({regDate:-1}).exec(function(err,displays){
        if(err){
            console.err(err);
            throw err;
        }
        res.render("divList.ejs",{datas:displays,divNo:divNo})
        console.log(displays)
    });
});

//===============================================================
//디스플레이리스트 데이터 입력
//===============================================================

router.post('/insert',upload.single('upl'), function(req,res,err){
    if(err){
        console.err(err);
        throw err;
    }
    if(req.body.pageType == 'data'){
        var displays = new display({
            divNo    : req.body.divNo,
            pageId   : req.body.pageId,
            pageType : req.body.pageType,
            use      : req.body.use,
            file     : "",
            filepath : "",
            chartData       : {
                year : req.body.year,
                month : req.body.month
            },
            regDate  : new Date()
        });
    }else{
        var displays = new display({
            divNo    : req.body.divNo,
            pageId   : req.body.pageId,
            pageType : req.body.pageType,
            use      : req.body.use,
            file     : req.file.filename,
            filepath : req.file.path,
            regDate  : new Date()
        });
    }

    displays.save(function(err,silence){
        if(err){
            console.log(err);
            throw err;
        }
        res.send(silence);
    });
});

//===============================================================
//디스플레이리스트 수정
//===============================================================

router.post('/update',upload.single('upl'), function(req,res,err){
    if(err){
        console.err(err);
        throw err;
    }
    if(req.file) {
        var uodateStuff = {
            divNo    : req.body.divNo,
            pageId   : req.body.pageId,
            pageType : req.body.pageType,
            use      : req.body.use,
            file     : req.file.filename,
            filepath : req.file.path,
            regDate  : new Date()
        }
    }else{
        var uodateStuff = {
            divNo    : req.body.divNo,
            pageId   : req.body.pageId,
            pageType : req.body.pageType,
            use      : req.body.use,
            regDate  : new Date()
        }
    }

    display.update({_id    : req.body._id},{$set: uodateStuff},{multi : true}).exec(function(err,silence){
        if(err){
            console.log(err);
            throw err;
        }
        res.sendStatus(304);
    });
});

//===============================================================
//디스플레이리스트 삭제
//===============================================================

router.post('/delete', function(req,res,err){
    if(err){
        console.err(err);
        throw err;
    }
    display.remove({_id    : req.body._id},function(err,silence){
        if(err){
            console.log(err);
            throw err;
        }
        res.sendStatus(304); // equivalent to res.status(200).send('OK')
    });
});

//===============================================================
// 디스플레이리스트 플레이
//===============================================================

router.get('/:divNo/:pageId', function(req, res) {

    var displaysCount = '';
    var displayDefaultNo = '';
    var displayFirstltNo = '';
    var pageID = req.params.pageId;
    var divNo = req.params.divNo;

    // 해당 디비전의 리스트의 촐갯수를 구한다.
    display.find({ 'divNo': divNo,'use' : 'Y' }).sort({pageId:-1}).exec(function(err,displays) {
        if (err) {
            console.err(err);
            throw err;
        }
        displaysCount = displays.length;
        displayFirstltNo = displays[0].pageId
    });

    // 해당 리스트의 페이지ID 의 데이터를 가져온다
    display.find({ 'divNo': divNo,'pageId' : pageID}).sort({regDate:-1}).exec(function(err,displays){
        if(err){
            console.err(err);
            throw err;
        }
        //해당데이터의 페이지타입 (image,chart) 인지 구별해 다른 템플릿으로 출력한다.
        if(displays == ''){
            //데이터가 없을경우 다시 첫페이지로 돌아간다.
            console.log("No Data!");
            var nextPageId = parseInt(pageID)+1;
            res.redirect('./'+displayFirstltNo);
        }else{
            try{
                chartdata.find({"year" : displays[0].chartData.year,"month" : displays[0].chartData.month}).exec(function(err,chartDatas){

                    displayDefaultNo = 1;

                    if(displays[0].pageType == 'data') {
                        var testest = {
                            "theme": "light",
                            "type": "serial",
                            "gridCount" : 5,
                            "dataProvider": [{
                                "divsion": "off",
                                "divsionGoal": chartDatas[0].goal.off,
                                "divsionSales": chartDatas[0].sales.off,
                                "totalRate": 100,
                                "AchievementRate": chardatasosu(chartDatas[0].sales.off,chartDatas[0].goal.off)
                            }, {
                                "divsion": "ap",
                                "totalRate": 100,
                                "divsionGoal": chartDatas[0].goal.ap,
                                "divsionSales": chartDatas[0].sales.ap,
                                "AchievementRate": chardatasosu(chartDatas[0].sales.ap,chartDatas[0].goal.ap)
                            }, {
                                "divsion": "b2b",
                                "totalRate": 100,
                                "divsionGoal": chartDatas[0].goal.b2b,
                                "divsionSales": chartDatas[0].sales.b2b,
                                "AchievementRate": chardatasosu(chartDatas[0].sales.b2b,chartDatas[0].goal.b2b)
                            }, {
                                "divsion": "b2c",
                                "totalRate": 100,
                                "divsionGoal": chartDatas[0].goal.b2c,
                                "divsionSales": chartDatas[0].sales.b2c,
                                "AchievementRate": chardatasosu(chartDatas[0].sales.b2c,chartDatas[0].goal.b2c)
                            }, {
                                "divsion": "ct",
                                "totalRate": 100,
                                "divsionGoal": chartDatas[0].goal.ct,
                                "divsionSales": chartDatas[0].sales.ct,
                                "AchievementRate": chardatasosu(chartDatas[0].sales.ct,chartDatas[0].goal.ct)
                            }, {
                                "divsion": "bd",
                                "totalRate": 100,
                                "divsionGoal": chartDatas[0].goal.bd,
                                "divsionSales": chartDatas[0].sales.bd,
                                "AchievementRate": chardatasosu(chartDatas[0].sales.bd,chartDatas[0].goal.bd)
                            }, {
                                "divsion": "sc",
                                "divsionGoal": chartDatas[0].goal.sc,
                                "divsionSales": chartDatas[0].sales.sc,
                                "totalRate": 100,
                                "AchievementRate": chardatasosu(chartDatas[0].sales.sc,chartDatas[0].goal.sc)
                            }],
                            "valueAxes": [{
                                "unit": "%",
                                "position": "left",
                                "title": "",
                                "autoGridCount" : false,
                                "minimum" : 0,
                                "guides": [{
                                    "fillAlpha": 0.5,
                                    "fillColor": "#1acbc3",
                                    "lineAlpha": 0,
                                    "toValue": 100,
                                    "value": 0
                                }],
                                "fontSize" : 20
                            }],
                            //"startDuration": 1, //애니메이션
                            "graphs": [{
                                "fontSize" : 20,
                                "labelText" : "[[value]]%",
                                "labelPosition" : 'top',
                                "color" : "#1e324a",
                                "fillColors" : "#1e324a",
                                "fillAlphas": 0.9,
                                "lineAlpha": 0.2,
                                "title": "2005",
                                "type": "column",
                                "clustered":true,
                                "valueField": "AchievementRate"
                            }],
                            "plotAreaFillAlphas": 0.1,
                            "categoryField": "divsion",
                            "categoryAxis": {
                                "gridPosition": "start",
                                "fontSize" : 30
                            },
                            "export": {
                                "enabled": true
                            },
                            "percentPrecision": 1,
                            "data_labels_always_on": true

                        }

                        console.log(chartDatas)
                        res.render("dataGraph.ejs", {
                            datas: displays,
                            totalImgCount: displaysCount,
                            pageidStart: displayDefaultNo,
                            pageid: pageID,
                            test : JSON.stringify(testest),
                            test1 : chartDatas
                        })
                    }else{

                        res.render("divDisplay.ejs", {
                            datas: displays,
                            totalImgCount: displaysCount,
                            pageidStart: displayDefaultNo,
                            pageid: pageID
                        })
                    }

                })
            }catch (e){
                console.log(e);
            }
        }
    });
});

module.exports = router;

//차트의 소숫점을 두자리로 정리한다.
function chardatasosu(param1,param2){
    var chardatasosu = ((param1/param2)*100).toFixed(2)
    return chardatasosu;
}
