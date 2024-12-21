import './FileContextMenu.css'

import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { useFileNameStore } from '../../../store/fileNameStore';

export const FileContextMenu = ({
    x,
    y,
    path
}) => {

    const { setIsOpen } = useFileContextMenuStore();

    const { editorSocket } = useEditorSocketStore();

    const { setAction, setIsVisible, setX, setY } = useFileNameStore();

    function handleFileDelete(e) {
        e.preventDefault();
        console.log("Deleting file at ", path);
        editorSocket.emit("deleteFile", {
            pathToFileOrFolder: path
        })
    }

    function handleFileRename(e) {
        setAction("rename")
        setIsVisible(true)
        setX(e.clientX)
        setY(e.clientY)
    }
    return (
        <div
            onMouseLeave={() => {
                setIsOpen(false);
            }}
            className='fileContextOptionsWrapper'
            style={{
                left: x,
                top: y,
            }}
        >
            <button
                className='fileContextButton'
                onClick={handleFileDelete}
            >
                Delete File
            </button>
            <button 
                className='fileContextButton'
                onClick={handleFileRename}
            >
                Rename File
            </button>
        </div>
    )
}