import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import apiRouter from './routes/index.js';
import { PORT } from './config/serverConfig.js';
import chokidar from 'chokidar';
import path from 'path';
import { handleEditorSocketEvents } from './socketHandlers/editorHandler.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        method: ['GET', 'POST'],
    }
});

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

io.on('connection', (socket) => {
    console.log('A user connected');
});

app.use('/api', apiRouter);

app.get('/ping', (req, res) => {
    return res.json({message: 'pong'});
})

const editorNamespace = io.of('/editor')

editorNamespace.on("connection", (socket) => {
    console.log("editor connected");

    // somehow we will get projectId from frontend

    let projectId = socket.handshake.query['projectId'];

    console.log("Project id received after connection", projectId);

    if(projectId) {
        var watcher = chokidar.watch(`./projects/${projectId}`, {
            ignored: (path) => path.includes("node_modules"),
            persistent: true,   // keeps the watcher in running state till the app is running
            awaitWriteFinish: {
                stabilityThreshold: 2000    // Ensures stability of files before triggering events
            },
            ignoreInitial: true // Ignores the initial files in the directory
        });

        watcher.on("all", (event, path) => {
            console.log(event, path);
        })
    }

    handleEditorSocketEvents(socket);

    socket.on("disconnect", async () => {
        await watcher.close();
        console.log("Editor disconnected");
    })

})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})