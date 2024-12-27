import Docker from "dockerode";

const docker = new Docker();

export const handleContainerCreate = async (projectId, socket) => {
    console.log("Project id received for container creation", projectId);
    try{
        const container = await docker.createContainer({
            Image: "sandbox",   // name given by us for the written dockerfile
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            CMD: ["/bin/bash"],
            Tty: true,
            User: "sandbox",
            HostConfig: {
                Binds: [    //mouting the project directory to the container
                    `${process.cwd()}/../projects/${projectId}:/home/sandbox/app`
                ],
                PortBindings: {
                    "5173/tcp": [
                        {
                            HostPort: "0"   // random port will be assigned by docker
                        }
                    ]
                },
                ExposedPorts: {
                    "5173/tcp": {}
                },
                Env: ["HOST=0.0.0.0"]
            }
        });
        console.log("Container created successfully", container.id);

        await container.start();

        console.log("Container started successfully");

        container.exec({
            Cmd: ["/bin/bash"],
            User: "sandbox",
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
        }, (err, exec) => {
            if(err) {
                console.log("Error while creating exec", err);
                return;
            }
            exec.start({ hijack: true }, (err, stream) => {
                if(err) {
                    console.log("Error while starting exec", err);
                    return;
                }
                processStream(stream, socket);
                socket.on("shell-input", (data) => {
                    stream.write(data);
                })
            })
        })
    }
    catch(error) {
        console.log("Error while creating container", error);
    }
}

function processStream(stream, socket) {
    let buffer = Buffer.from("");
    stream.on("data", (data) => {
        buffer = Buffer.concat([buffer, data]);
        socket.emit("shell-output", buffer.toString());
        buffer = Buffer.from("");
    })

    stream.on("end", () => {
        console.log("Stream ended");
        socket.emit("shell-output", "Stream ended");
    })

    stream.on("error", (error) => {
        console.log("Stream error", error);
        socket.emit("shell-output", "Stream error");
    })
}