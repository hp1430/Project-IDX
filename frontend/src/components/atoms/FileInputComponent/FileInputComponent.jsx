import { useState, useEffect } from 'react'
import './FileInputComponent.css'
import { useFileNameStore } from '../../../store/fileNameStore';
import { useEditorSocketStore } from '../../../store/editorSocketStore';

export const FileInputComponent = ({ x, y }) => {

    const [name, setName] = useState("");

    const { setFileName, setIsVisible, path } = useFileNameStore();

    const { editorSocket } = useEditorSocketStore();


    function handleSubmit() {
        const fileNameWithExtension = name.trim().includes('.') ? name : `${name}.txt`;
        const newPath = path.concat("/", fileNameWithExtension)
        setFileName(name);
        editorSocket.emit("createFile", {
            pathToFileOrFolder: newPath
        })
        setIsVisible(false);
        console.log("New file is created at ", newPath);
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