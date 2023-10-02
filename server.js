import express from 'express'
import crypto from 'hypercore-crypto'
import b4a from 'b4a'
import tasks from './tasks.js'
import run from './run.js'
import fs from 'fs'
import ipc from 'hyper-ipc-secure'
const kp = crypto.keyPair(crypto.data(b4a.from('seedy')));
const node = ipc()

import hypetask from 'hypetask'
import hypefetch from 'hypefetch'
import hypetest from 'hypetest'
hypetask(kp, node, node.getSub(kp, process.env.SERVERNAME), node.getSub(kp, 'task'))
hypefetch(kp, node, node.getSub(kp, process.env.SERVERNAME), node.getSub(kp, 'fetch'))
hypetest(kp, node, node.getSub(kp, process.env.SERVERNAME), node.getSub(kp, 'fetch'))


function createFolderIfNotExists(folderPath) {
    if (!fs.existsSync(folderPath)) {
        // If the folder doesn't exist, create it
        fs.mkdirSync(folderPath);
        console.log(`Folder "${folderPath}" created.`);
    } else {
        console.log(`Folder "${folderPath}" already exists.`);
    }
}
createFolderIfNotExists('saves');
const app = express()
const port = process.env.PORT || 3011
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://svelvet.lan.247420.xyz');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/task', tasks(node, kp))
app.use('/run', run(node, kp))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})