/*jshint esversion: 6 */
var http = require('http');
var url = require('url');
var util = require('util');
var ejs = require('ejs');




var query_csgo = require('game-server-query');
var query_csgo_sise = require('game-server-query');
var query_csgo_sise_cp = require('game-server-query');
var query_csgo_sise_cp2 = require('game-server-query');
var query_csgo_sise_kz = require('game-server-query');
var query_csgo_sise_aim = require('game-server-query');
var query_csgo_sise_aim2 = require('game-server-query');
var query_mc = require('game-server-query');


// var express = require('express');
// var app = express();
// app.use(express.static(__dirname + '/public'));


function page( 
    csgores, 
    csgo_sise_res, 
    csgo_sise_cp_res, 
    csgo_sise_cp2_res, 
    csgo_sise_kz_res,
    csgo_sise_aim_res, 
    csgo_sise_aim2_res, 
    mcres ) {
    return new Promise(
        (resolve, reject) => ejs.renderFile(
            'index.ejs',
            { 
                csgo: csgores, 
                csgo_sise: csgo_sise_res,
                csgo_sise_cp: csgo_sise_cp_res,
                csgo_sise_cp2: csgo_sise_cp2_res,
                csgo_sise_kz: csgo_sise_kz_res,
                csgo_sise_aim: csgo_sise_aim_res,
                csgo_sise_aim2: csgo_sise_aim2_res,
                mc: mcres 
            },
            (err, data) => {
                if (err) {
                    reject("渲染模版出错: " + err);
                } else {
                    resolve(data);
                }
            }
        )
    )
}

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    let csgostat = new Promise(
        (resolve, reject) => query_csgo(
            { type: 'csgo', host: 'combatserver.cn' },
            state => resolve(state)
        )
    );
    let csgostat_sise = new Promise(
        (resolve, reject) => query_csgo_sise(
            { type: 'csgo', host: 'sise.combatserver.cn' },
            state => resolve(state)
        )
    );
    let csgostat_sise_cp = new Promise(
        (resolve, reject) => query_csgo_sise_cp(
            { type: 'csgo', host: 'sise.combatserver.cn:27016' },
            state => resolve(state)
        )
    );
    let csgostat_sise_cp2 = new Promise(
        (resolve, reject) => query_csgo_sise_cp2(
            { type: 'csgo', host: 'sise.combatserver.cn:27012' },
            state => resolve(state)
        )
    );
    let csgostat_sise_kz = new Promise(
        (resolve, reject) => query_csgo_sise_kz(
            { type: 'csgo', host: 'sise.combatserver.cn:27018' },
            state => resolve(state)
        )
    );
    let csgostat_sise_aim = new Promise(
        (resolve, reject) => query_csgo_sise_aim(
            { type: 'csgo', host: 'sise.combatserver.cn:27001' },
            state => resolve(state)
        )
    );
    let csgostat_sise_aim2 = new Promise(
        (resolve, reject) => query_csgo_sise_aim2(
            { type: 'csgo', host: 'sise.combatserver.cn:27002' },
            state => resolve(state)
        )
    );
    
    let mcstat = new Promise(
        (resolve, reject) => query_mc(
            { type: 'minecraftping', host: 'mc.combatserver.cn' },
            state => resolve(state)
        )
    );
    Promise.all([ csgostat, csgostat_sise, csgostat_sise_cp, csgostat_sise_cp2, csgostat_sise_kz, csgostat_sise_aim, csgostat_sise_aim2, mcstat]).then(
        (stat) => 
            page(stat[0], stat[1], stat[2], stat[3], stat[4], stat[5], stat[6], stat[7])
            .then((data) => res.end(data))
            .catch((err) => res.end(err))
    ).catch((err)=>console.log(err));
}).listen(3000);



























