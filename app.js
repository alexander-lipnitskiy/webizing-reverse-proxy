// const http = require('http')
// const fs = require('fs')
// const httpPort = 8070

// http
//   .createServer((req, res) => {
//     fs.readFile('index.html', 'utf-8', (err, content) => {
//       if (err) {
//         console.log('We cannot open "index.html" file.')
//       }

//       res.writeHead(200, {
//         'Content-Type': '*/*; charset=utf-8',
//       })

//       res.end(content)
//     })
//   })
//   .listen(httpPort, () => {
//     console.log('Server listening on: http://localhost:%s', httpPort)
//   })

import history from 'connect-history-api-fallback';
import serveStatic from 'serve-static';
import express from 'express';
import proxy from 'express-http-proxy';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';

const staticFileMiddleware = express.static('public', {
    setHeaders: function setHeaders(res, path, stat) {
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);

        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
        res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range')
    }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(cors())
app.disable('etag');

app.use(async function (req, res, next) {
    if(req.get('Content-Type') == 'application/json' || req.get('Content-Type') == 'application/ld+json') {
        const response = await fetch(`http://td-server:4000${req.url}`, {cache: "no-cache"});
        const app = await response.json();
        res.send(app)
    }
    next()
})

//app.use(serveStatic(__dirname + "/dist"));
app.use(history())
app.use(staticFileMiddleware).listen(80, '0.0.0.0');
