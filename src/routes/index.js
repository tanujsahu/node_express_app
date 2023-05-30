import express from 'express';
import { users } from './user.js'
const app = express();

app.use('/users', users);

export const router = app;