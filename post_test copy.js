/*jshint esversion: 6 */
var http = require('http');
var url = require('url');
var util = require('util');
var ejs = require('ejs');




var query_csgo = require('game-server-query');
var query_csgo_sise = require('game-server-query');
var query_mc = require('game-server-query');


// var express = require('express');
// var app = express();
// app.use(express.static(__dirname + '/public'));


function page(csgores, csgo_sise_res, mcres ) {
    return new Promise(
        (resolve, reject) => ejs.renderFile(
            'index.ejs',
            { csgo: csgores, csgo_sise: csgo_sise_res, mc: mcres },
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
    let mcstat = new Promise(
        (resolve, reject) => query_mc(
            { type: 'minecraftping', host: 'mc.combatserver.cn' },
            state => resolve(state)
        )
    );
    Promise.all([ csgostat, csgostat_sise, mcstat]).then(
        (stat) => 
            page(stat[0], stat[1], stat[2])
            .then((data) => res.end(data))
            .catch((err) => res.end(err))
    ).catch((err)=>console.log(err));
}).listen(3000);



























