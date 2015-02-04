var async = require('async');
//市场信息
var market=require("../../server/model/www.cninfo.com.cn/market.js");
//企业和市场映射关系
var corpMap=require("../../server/model/www.cninfo.com.cn/corpmap.js");
//企业概况
var brief_shsz=require("../../server/model/www.cninfo.com.cn/brief_shsz.js");
//企业高管
var management=require("../../server/model/www.cninfo.com.cn/management.js");
//资产负债表
var balancesheet=require("../../server/model/www.cninfo.com.cn/balancesheet.js");
//利润表
var incomestatements=require("../../server/model/www.cninfo.com.cn/incomestatements.js");
//现金流量表
var cashflow=require("../../server/model/www.cninfo.com.cn/cashflow.js");
var t = require('../../server/tools/t.js');
var log = t.log;
/**
 * @description 可改进部分，市场信息一般不会变，企业和市场映射信息一般不会变，有可能会哟
 */
async.auto({
    /**
     * 获取市场信息:市场信息一般不会变
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getMarketInfo: function (callback) {
        //market.exec(callback);
        callback(null,"");
    },
    /**
     * 获取企业和市场的映射关系信息:一般不会变：转板，或新股时会有所变化
     * @param  {Function} callback [description]
     * @param  {[type]}   results  [description]
     * @return {[type]}            [description]
     */
    getCorpMap: ['getMarketInfo',function (callback, results) {
        //log(results.getMarketInfo);
        //corpMap.exec(callback);
        callback(null,"");
    }],
    /**
     * 获取公司概况信息:一般不会变
     * @param  {Function} callback [description]
     * @param  {[type]}   results  [description]
     * @return {[type]}            [description]
     */
    getBrief: ['getCorpMap', function(callback, results) {
        log("in getBrief!");
        //log(results.getCorpMap);
        //brief_shsz.exec(callback);
        callback(null,"");
        /*
        setTimeout(function(){
            console.log('1.2: wrote file');
            callback('myerr');
        }, 300);
        */
    }],
    /**
     * 获取公司高管信息：一般不会变
     * @param  {Function} callback [description]
     * @param  {[type]}   results  [description]
     * @return {[type]}            [description]
     */
    getManagement: ['getBrief', function(callback, results) {
        log("in getManagement!");
//        log(results.getBrief);
        //management.exec(callback);
        callback(null,"");
    }],
    /**
     * 资产负债表信息
     * @param  {Function} callback [description]
     * @param  {[type]}   results  [description]
     * @return {[type]}            [description]
     */
    getBalancesheet:['getManagement', function(callback, results) {
        log("in getBalancesheet!");
//        log(results.getManagement);
        balancesheet.exec(callback);
    }],
    /**
     * 利润表信息
     * @param  {Function} callback [description]
     * @param  {[type]}   results  [description]
     * @return {[type]}            [description]
     */
    getIncomestatements:['getBalancesheet', function(callback, results) {
        log("in getIncomestatements!");
//        log(results.getBalancesheet);
        incomestatements.exec(callback);
    }],
    /**
     * 现金流量表信息
     * @param  {Function} callback [description]
     * @param  {[type]}   results  [description]
     * @return {[type]}            [description]
     */
    getCashflow:['getIncomestatements', function(callback, results) {
        log("in getCashflow!");
        //log(results.getIncomestatements);
        cashflow.exec(callback);
    }]
}, function(err, results) {
    log('err: ', err);
    log('results: ', results);
    //给主进程报信
    process.send({
        id:"grapCorpInfo.js",
        state:"finish",
        err:"",
        //7天
        wait:7*24*3600*1000
    });
});