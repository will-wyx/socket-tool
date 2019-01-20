#!/usr/bin/env node
const {Socket} = require('net');
const cli = require('cli');
const options = cli.parse(
    {
        port: ['p', 'port', 'int', 9999],
        host: ['h', 'host', 'string', '127.0.0.1'],
    },
    ['server', 'client']);

switch (cli.command) {
    case 'server':
        server();
        break;
    case 'client':
        client();
        break;
}

function server() {
    console.log('server')
}

function hexToBuffer(hex) {
    let bytes = [];
    hex = hex.toLowerCase();
    for (let i = 0, len = hex.length / 2; i < len; ++i) {
        let subhex = hex.substring(i * 2, i * 2 + 2);
        bytes.push(parseInt(subhex));
    }
    return Buffer.from(bytes);
}

function bufferToHex(buf) {
    let iter = buf.values();
    let hexArr = [];
    for(let item of iter) {
        hexArr.push(item.toString(16));
    }
    console.log(hexArr.join(''));
}

function sendHex(socket, hex) {
    let buf = hexToBuffer(hex);
    socket.write(buf);
}

function client() {
    let {port, host} = options;
    let socket = new Socket();
    socket.connect({port, host}, () => {
        console.log('connection');

        socket.on('data', (data) => {
            bufferToHex(data);
        });

        let hex = cli.args.shift();
        if (hex) {
            sendHex(socket, hex);
        } else {
            console.log('start');
        }
    });
    console.log('end');
}
