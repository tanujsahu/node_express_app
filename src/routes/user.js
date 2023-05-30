import express from 'express';
import { createToken, verifyToken } from '../constant/common.js'
const app = express();

app.post('/', (req, res) => {
    res.status(200).send({ message: 'create new User', data: req.body });
});

app.get('/', verifyToken, (req, res) => {
    const data = req.body.encryptedToken;
    console.log("get user", data);
    res.status(200).send({ message: 'get user list', data: req.body });
});

app.put('/:_id', (req, res) => {
    res.status(200).send('Update User');
});

app.delete('/:_id', (req, res) => {
    console.log("deleet*****", req.params);
    res.status(200).send('Deleted User');
});

app.post('/login', createToken, (req, res) => {
    console.log("user login*****", req.body);
    res.status(200).send({ message: 'login User', data: req.body });
});

export const users = app;