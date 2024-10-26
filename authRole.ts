import express, { Request, Response, NextFunction } from 'express';
import { apiRoute } from "./src/routes";
import { configDotenv } from 'dotenv';
import cluster from 'cluster';
import os from 'os';
import { log } from 'console';

const app = express();

configDotenv();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
    log(`${req.method} - ${req.url}`);
    next();
});

app.get('/', (_req, res) => {
    res.send('Hello World');
});

app.use('/api/auth', apiRoute);

app.get('/disconnect-1-worker', (_req, res) => {
    if (cluster.workers) {
        const worker = Object.values(cluster.workers)[0];
        if (worker) {
            worker.disconnect();
            res.send('Worker disconnected');
        } else {
            res.send('No worker to disconnect');
        }
    } else {
        res.send('Cluster unavailable to disconnect');
    }
});

app.get('/destroy-1-worker', (_req, res) => {
    if (cluster.workers) {
        const worker = Object.values(cluster.workers)[0];
        if (worker) {
            worker.destroy();
            res.send('Worker destroyed');
        } else {
            res.send('No worker to destroy');
        }
    } else {
        res.send('Cluster unavailable to destroy');
    }
});

const port = process.env.PORT || 3000;

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({
        message: "Internal Server Error",
        error: err.message
    });
});

if (cluster.isPrimary) {
    const cores = os.cpus().length;

    for (let i = 0; i < cores; i++) {
        cluster.fork();
        log(`Worker ${i} started`);
    }

    cluster.on('exit', (worker, code, signal) => {
        log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
        log('Starting a new worker');
        cluster.fork();
    });

    cluster.on('disconnect', (worker) => {
        log(`Worker ${worker.process.pid} disconnected`);
    });
} else {
    const server = app.listen(port, () => {
        log(`Server is running on port ${port} with process id ${process.pid}`);
    });

    process.on('SIGTERM', () => {
        log(`Worker ${process.pid} is shutting down gracefully`);
        server.close(() => {
            log(`Worker ${process.pid} closed`);
        });
    });
}