
import express from 'express';
import routes from './routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/public', express.static('public'));

app.use('/api', routes);


export default app;