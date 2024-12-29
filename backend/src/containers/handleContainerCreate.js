import Docker from "dockerode";

const docker = new Docker();

export const listContainer = async () => {
    const containers = await docker.listContainers();
    console.log("List of containers", containers);
    // print 
}

export const handleContainerCreate = async (projectId, terminalSocket, req, tcpSocket, head) => {
    console.log("Project id received for container creation", projectId);
    try{
        const container = await docker.createContainer({
            Image: "sandbox",   // name given by us for the written dockerfile
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Cmd: ["/bin/bash"],
            Tty: true,
            User: "sandbox",
            ExposedPorts: {
                "5173/tcp": {}
            },
            Env: ["HOST=0.0.0.0"],
            HostConfig: {
                Binds: [    //mouting the project directory to the container
                    `${process.cwd()}/projects/${projectId}:/home/sandbox/app`
                ],
                PortBindings: {
                    "5173/tcp": [
                        {
                            "HostPort": "0"   // random port will be assigned by docker
                        }
                    ]
                }, 
            }
        });
        console.log("Container created successfully", container.id);

        await container.start();

        console.log("Container started successfully");

        //Below is the place where we upgrade the connection to websocket
        terminalSocket.handleUpgrade(req, tcpSocket, head, (establishedWsConn) => {
            console.log("at handle upgrade");
            terminalSocket.emit("connection", establishedWsConn, req, container);
            console.log(req.url);
        });
    }
    catch(error) {
        console.log("Error while creating container", error);
    }
}
