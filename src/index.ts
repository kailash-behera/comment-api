import express, { NextFunction, Request, Response } from 'express';
import http from 'node:http';
import compression from 'compression';
import cors from 'cors';
import { AppException } from './exceptions';
import 'dotenv/config';
import routes from './routes';

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:4200' }));

app.use(compression());

app.use(express.json());

app.use('/api', routes('v1'));

// For Handel App Exceptions
app.use((err: AppException, req: Request, res: Response, next: NextFunction) => {
    return res.status(err.statusCode).json({ error: err.message || 'Something Went Wrong !' });
});

// For Handel Invalid Routes
app.use((req: Request, res: Response) => {
    return res.status(404).json({ error: `No resource found on '${req.path}'.` });
});

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    console.log("server running on http://localhost:4001/");
});