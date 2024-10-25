const cluster = require('cluster');
const os = require('os');
const http = require('http');
const { log } = require('console');

if (cluster.isPrimary) {
    const cpus = os.cpus().length;
    log(`Primary ${process.pid} is running and forking ${cpus} workers`);
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }

    process.on('message', (msg) => {
        console.log(`Message from worker ${msg}`);
    });

    process.on('worker',(worker: { process: { pid: any; }; }, code: any, signal: any) => {
        console.log(`Worker ${worker.process.pid} exited with code ${code} and signal ${signal}`);
    });

    process.on('SIGTERM', () => {
        console.log(`Worker ${process.pid} is shutting down gracefully...`);
        http.Server.close(() => {
            process.exit();
        });
    });

    cluster.on('exit', (worker: { process: { pid: any; }; }, code: any, signal: any) => {
        console.log(`Worker ${worker.process.pid} exited. Restarting...`);
        cluster.fork();
    })
}
else {
    
    http.createServer((_req: any, res: { end: (arg0: string) => void; }) => {
        res.end(`Response from worker ${process.pid}`);
    }).listen(3000, () => {
        console.log(`Server is running on ${process.pid}`);
    });
    console.log(`Worker process: ${process.pid}`);
}