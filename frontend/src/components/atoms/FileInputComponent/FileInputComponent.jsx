import { useState } from 'react'
import './FileInputComponent.css'
import { useFileNameStore } from '../../../store/fileNameStore';
import { useEditorSocketStore } from '../../../store/editorSocketStore';

export const FileInputComponent = ({ x, y }) => {

    const [name, setName] = useState("");

    const { setFileName, setIsVisible, path, action, setAction } = useFileNameStore();

    const { editorSocket } = useEditorSocketStore();


    function handleSubmit() {
        if(action==="createFile") {
            const fileNameWithExtension = name.trim().includes('.') ? name : `${name}.txt`;
            const newPath = path.concat("/", fileNameWithExtension)
            setFileName(name);
            editorSocket.emit("createFile", {
                pathToFileOrFolder: newPath
            })
            setIsVisible(false);
            console.log("New file is created at ", newPath);
        }
        else if(action==="createFolder") {
            const newPath = path.concat("/", name.trim());
            setFileName(name);
            editorSocket.emit("createFolder", {
                pathToFileOrFolder: newPath
            })
            setIsVisible(false);
            console.log("New folder is created at ", newPath);
        }
        else {
            const oldPath = path;
            //const fileNameWithExtension = name.trim();
            const newPath = oldPath?.split(/[\\/]/).slice(0, -1).join('/').concat("/", name.trim());
            console.log("Old path: ", oldPath);
            console.log("New path: ", newPath);
            
            setFileName(name);
            editorSocket.emit("renameFile", {
                oldPath: oldPath,
                newPath: newPath
            })
            setAction(null);
            setIsVisible(false);
        }
    }

    return (
        <div 
            className="fileInputDiv"
            onMouseLeave={() => {
                setIsVisible(false)
            }}
            style={{
                left: x,
                top: y
            }}    
        >
            <input 
                type="text" 
                placeholder="Enter File Name" 
                required
                className='fileInputBox' 
                onChange={(e) => setName(e.target.value)}
            />

            <button
                className='fileInputButton'
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    )
}