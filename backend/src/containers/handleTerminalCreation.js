export const handleTerminalCreation = (container, ws) => {
    container.exec({
        Cmd: ["/bin/bash"],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        User: "sandbox",
    }, (err, exec) => {
        if(err) {
            console.log("Error creating exec", err);
            return;
        }
        exec.start({
            hijack: true,
        }, (err, stream) => {
            if(err) {
                console.log("Error starting exec", err);
                return;
            }

            console.log("Inside exec");

            // Step 1: Stream processing
            processStreamOutput(stream, ws);

            // Step 2: Stream writing

            ws.on("message", (data) => {
                if(data==="getPort") {
                    container.inspect((err, data) => {
                        const port = data.NetworkSettings;
                    })
                    return;
                }
                else {
                    stream.write(data);
                }
            })
        })
    })
}

function processStreamOutput(stream, ws) {
    let nextDataType = null;    // Stores the type of next message
    let nextDataLength = null;  // Stores the length of next message
    let buffer = Buffer.from("");

    function processStreamData(data) {
        // This is the helper function to process incoming data chunks
        if(data) {
            buffer = Buffer.concat([buffer, data]);
        }

        if(!nextDataType) {
            // If the next data type is not known, then try to read the next 8 bytes to get the type and length of the message
            if(buffer.length >= 8) {
                const header = bufferSlicer(8);
                nextDataType = header.readUInt32BE(0);  // The first 4 bytes represent the type of the message
                nextDataLength = header.readUInt32BE(4);    // The next 4 bytes represent the length of the message

                processStreamData();    // Recursively call the function to process the remaining buffer
            }
        }
        else {
            // If the type and Length of the message is known, then try to read the message
            if(buffer.length >= nextDataLength) {
                const content = bufferSlicer(nextDataLength);   // Slice the buffer to get the message
                ws.send(content);   // Send the message to the client
                console.log("sending data to client", content.toString());
                nextDataType = null;    // Reset the type of the next message
                nextDataLength = null;  // Reset the length of the next message
                processStreamData();    // Recursively call the function to process the remaining buffer
            }
        }
    }

    function bufferSlicer(end) {
        // this function will slice the buffer and return the sliced buffer and the remaining buffer
        const output = buffer.slice(0, end);    //header of the chunk
        buffer = Buffer.from(buffer.slice(end, buffer.length)); // remaining part of the chunk

        return output;
    }

    stream.on("data", processStreamData);
}