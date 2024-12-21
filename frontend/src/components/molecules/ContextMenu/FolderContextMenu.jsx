import './FileContextMenu.css'

import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore"
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { useFileNameStore } from '../../../store/fileNameStore';

export const FolderContextMenu = ({
    x,
    y,
    path
}) => {

    const { setIsOpen } = useFolderContextMenuStore();

    const { editorSocket } = useEditorSocketStore();

    const { setX, setY, setIsVisible, setPath, setAction } = useFileNameStore();

    function handleFolderDelete(e) {
        e.preventDefault();
        console.log("Deleting File at ", path);
        editorSocket.emit("deleteFolder", {
            pathToFileOrFolder: path
        })
    }

    function handleFolderCreateFile(e) {
        setIsVisible(true);
        setX(e.clientX);
        setY(e.clientY);
        setPath(path);
        setAction("createFile");
    }

    function handleFolderRename(e) {
        setIsVisible(true);
        setX(e.clientX);
        setY(e.clientY);
        setPath(path);
        setAction("rename");
    }
    
    return (
        <div
            className="folderContextOptionWrapper"
            onMouseLeave={() => {
                setIsOpen(false)
            }}
            style={{
                left: x,
                top: y
            }}
        >
            <button
                className="folderContextButton"
                onClick={handleFolderCreateFile}
            >
                Create File</button>
            <button
                className="folderContextButton"
                onClick={handleFolderDelete}
            >
                Delete Folder</button>
            <button
                className="folderContextButton"
                onClick={handleFolderRename}
            >
                Rename Folder</button>
        </div>
    )
}