import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';
// @ts-ignore
import fakeCert from './fake.cert.txt' assert { type: "text" };
// @ts-ignore
import fakeKey from './fake.key.txt' assert { type: "text" };
import mimes from './mimes.ts';
import type { TranslationOptions, ServerOptions, Routes, RouteHandler } from './@types';

import translationAPI from './translation-api.ts';

const globalOptions: ServerOptions = {
  port: process.env.PORT === undefined ? 8000 : parseInt(process.env.PORT),
  host: process.env.HOST === undefined ? 'localhost' : process.env.HOST,
  key: process.env.KEY_PATH === undefined ? fakeKey : fs.readFileSync(process.env.KEY_PATH),
  cert: process.env.CERT_PATH === undefined ? fakeCert : fs.readFileSync(process.env.CERT_PATH),
  httpOnly: process.env.HTTP_ONLY === 'true',
};

const routes: Routes = {
  '/': (req: http.IncomingMessage, res: http.ServerResponse): void => {
    (routes['/index.html'] as RouteHandler)(req, res);
  },
  '/index.html': (req: http.IncomingMessage, res: http.ServerResponse): void => {
    (routes['/static'] as RouteHandler)(req, res, '/index.html');
  },
  '/settings.html': (req: http.IncomingMessage, res: http.ServerResponse): void => {
    (routes['/static'] as RouteHandler)(req, res, '/settings.html');
  },
  '/favicon.ico': (req: http.IncomingMessage, res: http.ServerResponse): void => {
    (routes['/static'] as RouteHandler)(req, res, '/favicon.ico');
  },
  '/static': (req: http.IncomingMessage, res: http.ServerResponse, ...pathSegments: string[]): void => {
    fs.readFile(`./static${pathSegments.join('')}`, (err: NodeJS.ErrnoException | null, data: Buffer) => {
      const ext = pathSegments[pathSegments.length - 1].split('.').slice(-1)[0];
      if (err) {
        res.writeHead(404);
        res.write('File not found!');
      } else {
        res.writeHead(200, { 'Content-Type': mimes[ext] });
        res.write(data);
      }
      res.end();
    });
  },
  '/api': {
    '/translate': (req: http.IncomingMessage, res: http.ServerResponse): void => {
      const body: any[] = [];
      req.on('data', function (chunk) {
        body.push(chunk);
      }).on('end', function () {
        const payload = Buffer.concat(body).toString();
        if (payload) {
          const translationOption: TranslationOptions = JSON.parse(payload);
          translationAPI[translationOption.backend](translationOption).then((result) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(result));
            res.end();
          });
          JSON.parse(payload);
        } else {
          res.writeHead(400);
          res.end('Bad Request');
        }
      });
    },
    '/complete': (req: http.IncomingMessage, res: http.ServerResponse): void => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ message: 'NOT_IMPLEMENTED' }));
      res.end();
    },
  }
};

const route = (segments: string[], node: Routes | RouteHandler): RouteHandler => {
  if (typeof node === 'function') {
    return (req: http.IncomingMessage, res: http.ServerResponse): void => node(req, res, ...segments);
  }
  if (segments[0] in node) {
    return route(segments.slice(1), node[segments[0]]);
  }
  return (req: http.IncomingMessage, res: http.ServerResponse): void => { res.end('404'); };
};

const requestListener: http.RequestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
  return route(req.url!.split(/(?=\/)/), routes)(req, res);
};

if (globalOptions.httpOnly) {
  http.createServer(requestListener).listen(globalOptions.port, globalOptions.port, () => {
    console.log(`Server running at http://${globalOptions.host}:${globalOptions.port}/`);
  });
} else {
  https.createServer({ key: globalOptions.key, cert: globalOptions.cert }, requestListener).listen(globalOptions.port, globalOptions.port, () => {
    console.log(`Server running at https://${globalOptions.host}:${globalOptions.port}/`);
  });
}