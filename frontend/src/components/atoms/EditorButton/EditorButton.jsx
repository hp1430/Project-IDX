import { useActiveFilesStore } from '../../../store/activeFilesStore';
import { useActiveFileTabStore } from '../../../store/activeFileTabStore';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import './EditorButton.css';
import { CloseOutlined } from '@ant-design/icons';

export const EditorButton = ({ name:fileName, path }) => {

    const { activeFileTab, setActiveFileTab } = useActiveFileTabStore();
    const { editorSocket } = useEditorSocketStore();
    const { setActiveFiles } = useActiveFilesStore();

    function handleClick() {
        editorSocket.emit("readFile", {
            pathToFileOrFolder : path
        });
    }

    function isActive() {
        return activeFileTab?.path === path;
    }

    function handleRemoveFileFromEditorButtons() {
        setActiveFiles({
            name: fileName,
            path: path,
            isActive: false,
            action: "remove"
        })
        setActiveFileTab(null);
        console.log("File removed successfully...")
    }
    return (
        <div
            style={{
                display: 'flex',
            }}
        >
            <button
                className="editor-button"
                style={{
                    color: isActive() ? 'white' : '#959eba',
                    backgroundColor: isActive() ? '#303242' : '#4a4859',
                    borderTop: isActive() ? '2px solid #f7b9dd' : 'none'
                }}
                onClick={handleClick}
            >
                {fileName}
                
            </button>
            <div>
            <CloseOutlined 
                    className="close-icon"
                    style={{
                        color: isActive() ? 'white' : '#959eba',
                        backgroundColor: isActive() ? '#303242' : '#4a4859',
                        borderTop: isActive() ? '2px solid #f7b9dd' : 'none',
                    }}
                    onClick={handleRemoveFileFromEditorButtons}
                />
            </div>
        </div>
    )
}