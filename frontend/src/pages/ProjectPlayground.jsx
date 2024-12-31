import { useParams } from "react-router-dom"
import { EditorComponent } from "../components/molecules/EditorComponent/EditorComponent";
import { TreeStructure } from "../components/organisms/TreeStructure/TreeStructure";
import { useEffect, useState } from "react";
import { useTreeStructureStore } from "../store/treeStructureStore";
import { useEditorSocketStore } from "../store/editorSocketStore";
import { io } from 'socket.io-client';
import { BrowserTerminal } from "../components/molecules/BrowserTerminal/BrowserTerminal";
import { useTerminalSocketStore } from "../store/terminalSocketStore";
import { Browser } from "../components/organisms/Browser/Browser";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { Divider } from "antd";

export const ProjectPlayground = () => {

    const {projectId: projectIdFromUrl} = useParams();

    const { setProjectId, projectId } = useTreeStructureStore();

    const { setEditorSocket } = useEditorSocketStore();

    const { terminalSocket, setTerminalSocket } = useTerminalSocketStore();

    const [loadBrowser, setLoadBrowser] = useState(false);


    useEffect(() => {
        if(projectIdFromUrl) {
            setProjectId(projectIdFromUrl);
            const editorSocketConnection = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
                query: {
                    projectId: projectIdFromUrl
                }
            });

            try {
                const ws = new WebSocket("ws://localhost:4000/terminal?projectId="+projectIdFromUrl);
            //    editorSocket.emit("getPort", { containerName: projectIdFromUrl });
                setTerminalSocket(ws);
            }
            catch(err) {
                console.log(err);
            }
            
            setEditorSocket(editorSocketConnection);
        }

        // if(terminalSocket) {
            
        // }
    }, [setProjectId, projectIdFromUrl, setEditorSocket, setTerminalSocket]);

    return (
        <>
            <div style={{display: "flex"}}>
                {projectId && (
                    <div
                        style={{
                            backgroundColor: "#333254",
                            paddingRight: "10px",
                            paddingTop: "0.3vh",
                            minWidth: "250px",
                            maxWidth: "25%",
                            height: "100vh",
                            overflow: "auto"
                        }}
                    >
                        <TreeStructure />
                    </div>
                )}
                <div
                    style={{
                        width: "100vw",
                        height: "100vh"
                    }}
                >
                    <Allotment>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                width: "100%",
                                backgroundColor: "#282a36",
                            }}
                        >
                            <Allotment
                                vertical={true}
                            >
                                <EditorComponent />
                                {/* <Divider style={{color: 'white', backgroundColor: '#333254'}} plain>Terminal</Divider> */}
                                <BrowserTerminal />
                            </Allotment>


                        </div>
                        <div>
                            <button onClick={() => setLoadBrowser(true)}>
                                Load Browser
                            </button>
                            {loadBrowser && projectIdFromUrl && terminalSocket && <Browser projectId={projectIdFromUrl}/>}
                        </div>
                    </Allotment>
                </div>
            </div>
            {/* <EditorButton isActive={false} />
            <EditorButton isActive={true} /> */}
        </>
    )
}