import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import apiRouter from './routes/index.js';
import { PORT } from './config/serverConfig.js';
import chokidar from 'chokidar';
import { handleEditorSocketEvents } from './socketHandlers/editorHandler.js';
import { handleContainerCreate, listContainer } from './containers/handleContainerCreate.js';
import { WebSocketServer } from 'ws';
import { handleTerminalCreation } from './containers/handleTerminalCreation.js';

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

    socket.on("getPort", () =>{
        console.log("get port event received");
        listContainer();
    })

    handleEditorSocketEvents(socket, editorNamespace);

    socket.on("disconnect", async () => {
        await watcher.close();
        console.log("Editor disconnected");
    })

})


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

const webSocketForTerminal = new WebSocketServer({ 
    noServer: true  // we will handle the server ourselves
});

server.on("upgrade", (req, tcp, head) => {
    /**
     * req: Incoming http request
     * socket: TCP Socket
     * head: Buffer containing the first packet of the upgraded stream
     */
    // This callback will be called when a client tries to connect to the server through websocket

    const isTerminal = req.url.includes("/terminal");

    if(isTerminal) {
        console.log("request url received", req.url);
        const projectId = req.url.split("=")[1];
        console.log("Project id received for terminal", projectId);

        handleContainerCreate(projectId, webSocketForTerminal, req, tcp, head);
    }
});

webSocketForTerminal.on("connection", (ws, req, container) => {
    console.log("Terminal connected");
    handleTerminalCreation(container, ws);

    ws.on("getPort", () => {
        console.log("get port event received");
    })
    ws.on("close", () => {
        container.remove({force: true}, (err, data) => {
            if(err) {
                console.log("Error removing container", err);
            }
            else {
                console.log("Container removed successfully", data);
            }
        });
    })
});