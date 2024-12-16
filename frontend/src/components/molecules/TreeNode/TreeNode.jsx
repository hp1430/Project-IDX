import { useState } from "react"
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io"
import { FileIcon } from "../../atoms/FileIcon/FileIcon";
import { useEditorSocketStore } from "../../../store/editorSocketStore";

export const TreeNode = ({
    fileFolderData
}) => {

    const [visibility, setVisibility] = useState({});

    const { editorSocket } = useEditorSocketStore();

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
                        paddingTop: "15px",
                        fontSize: "16px"
                    }}
                >
                    {visibility[fileFolderData.name] ? <IoIosArrowDown /> : <IoIosArrowForward />}

                    {fileFolderData.name}
                </button>
            ) : (
                // If the current node is not a folder, render it as a p tag
                <div style={{ display: "flex", alignItems: "center"}}>
                    <FileIcon extension={computeExtension(fileFolderData)} />
                    <p
                        style={{
                            paddingTop: "5px",
                            fontSize: "15px",
                            cursor: "pointer",
                            marginLeft: "5px",
                            color: "white"
                        }}
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