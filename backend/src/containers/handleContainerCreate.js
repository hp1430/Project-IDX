import Docker from "dockerode";
import e from "express";

const docker = new Docker();

export const listContainer = async () => {
    const containers = await docker.listContainers();
    console.log("List of containers", containers);
    // print ports array from all containers
    containers.forEach((containerInfo) => {
        console.log(container.Ports);
    });
}

export const handleContainerCreate = async (projectId, terminalSocket, req, tcpSocket, head) => {
    console.log("Project id received for container creation", projectId);
    try{

        // Delete the container if it already exists with the same name
        const existingContainer = await docker.listContainers({
            name: projectId
        });

        if(existingContainer.length > 0) {
            console.log("Container already exists. Deleting the container");
            const container = docker.getContainer(existingContainer[0].Id);
            await container.remove({force: true});
        }

        const container = await docker.createContainer({
            Image: "sandbox",   // name given by us for the written dockerfile
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Cmd: ["/bin/bash"],
            name: projectId,
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
        // terminalSocket.handleUpgrade(req, tcpSocket, head, (establishedWsConn) => {
        //     console.log("at handle upgrade");
        //     terminalSocket.emit("connection", establishedWsConn, req, container);
        //     console.log(req.url);
        // });

        return container;
    }
    catch(error) {
        console.log("Error while creating container", error);
    }
}


export async function getContainerPort(containerName) {
    const container = await docker.listContainers({
        name: containerName
    });

    if(container.length > 0) {
        const containerInfo = await docker.getContainer(container[0].Id).inspect();
        console.log("Container info", containerInfo);
        try {
            return containerInfo?.NetworkSettings?.Ports["5173/tcp"][0].HostPort;
        }
        catch(err) {
            console.log("Port not present");
            return undefined;
        }
    }
}