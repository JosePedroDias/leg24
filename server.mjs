import { writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';

function getBody(req) {
    return new Promise((resolve, reject) => {
        const bodyParts = [];

        req.on('error', (err) => {
            console.log(err);
            reject(err);
        })

        req.on('data', (chunk) => {
            bodyParts.push(chunk);
        })

        req.on('end', () => {
            const body = Buffer.concat(bodyParts).toString();
            resolve(body);
        });
    });
}

createServer(async (req, res) => {
    const url = req.url;
    const fn = url.substring(1) ;
    //console.log(`${req.method} ${url}`);
    //console.log(req.headers);

    if (req.method !== 'POST') {
        res.writeHead(406);
        res.end();
        return;
    }

    try {
        const body = await getBody(req);
        const path = `./content/${fn}`;
        //console.log(`updating ${path} with ${body.length} bytes\n***\n${body.toString().substring(0, 100)}\n***...`);
        await writeFile(path, body);
        console.log(`updated ${path}`);
    } catch (err) {
        console.log(err);
        res.writeHead(406);
        res.end();
        return;
    }

    res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
    });
    res.end();
}).listen(9091, '0.0.0.0');
