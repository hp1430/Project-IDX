import { useState } from "react"
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io"
import { FileIcon } from "../../atoms/FileIcon/FileIcon";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";

export const TreeNode = ({
    fileFolderData
}) => {

    const [visibility, setVisibility] = useState({});

    const { editorSocket } = useEditorSocketStore();

    const {
        setFile,
        setIsOpen: setFileContextMenuIsOpen,
        setX: setFileContextMenuX,
        setY: setFileContextMenuY
    } = useFileContextMenuStore();

    function toggleVisibility(name) {
        setVisibility({
            ...visibility,
            [name]: !visibility[name]
        })
    }

    function computeExtension(fileFolderData) {
        const names = fileFolderData.name.split(".");
        return names[names.length - 1];
    }

    function handleDoubleClick(fileFolderData) {
        editorSocket.emit("readFile", {
            pathToFileOrFolder: fileFolderData.path
        })
    }

    function handleContextMenuForFiles(e, path) {
        e.preventDefault();
        console.log("Right clicked on ", path)
        setFile(path);
        setFileContextMenuX(e.clientX);
        setFileContextMenuY(e.clientY);
        setFileContextMenuIsOpen(true);
    }

    return (
        (fileFolderData && <div
            style={{
                paddingLeft: "15px",
                color: "white"
            }}
        >
            {fileFolderData.children ? (    // If the current node is a folder
                // If the current node is a folder, render it as a button
                <button
                    onClick={() => toggleVisibility(fileFolderData.name)}
                    style={{
                        border: "none",
                        cursor: "pointer",
                        outline: "none",
                        color: "white",
                        background: "transparent",
                        padding: "15px",
                        fontSize: "16px",
                        marginTop: "10px"
                    }}
                >
                    {visibility[fileFolderData.name] ? <IoIosArrowDown /> : <IoIosArrowForward />}

                    {fileFolderData.name}
                </button>
            ) : (
                // If the current node is not a folder, render it as a p tag
                <div style={{ display: "flex", alignItems: "center", justifyContent: "start"}}>
                    <FileIcon extension={computeExtension(fileFolderData)} />
                    <p
                        style={{
                            paddingTop: "15px",
                            paddingBottom: "15px",
                            fontSize: "15px",
                            cursor: "pointer",
                            marginLeft: "15px",
                            color: "white",
                            marginTop: "8px"
                        }}
                        onContextMenu={(e) => handleContextMenuForFiles(e, fileFolderData.path)}
                        onDoubleClick={() => handleDoubleClick(fileFolderData)}
                    >
                        {fileFolderData.name}
                    </p>
                </div>
            )}
            {visibility[fileFolderData.name] && fileFolderData.children && (
                fileFolderData.children.map((child) => (
                    <TreeNode 
                        fileFolderData={child}
                        key={child.name}
                    />
                ))
            )}
        </div>)
    )
}