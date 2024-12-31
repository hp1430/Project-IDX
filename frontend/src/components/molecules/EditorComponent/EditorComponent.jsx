import Editor from "@monaco-editor/react"
import { useEffect, useState } from "react"
import { useActiveFileTabStore } from "../../../store/activeFileTabStore";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { extensionToFileType } from "../../../utils/extensionToFileType";

export const EditorComponent = () => {

    let timerId = null;

    const [editorState, setEditorState] = useState({
        theme: null
    });

    const { activeFileTab } = useActiveFileTabStore();

    const { editorSocket } = useEditorSocketStore();

    async function downloadTheme() {
        const response = await fetch('/Dracula.json');
        const data = await response.json();
        console.log(data);
        setEditorState({ ...editorState, theme: data});
    }

    function handleEditorTheme(editor, monaco) {
        monaco.editor.defineTheme('dracula', editorState.theme);
        monaco.editor.setTheme('dracula');
    }

    function handleChange(value) {
        if(timerId != null) {
            clearTimeout(timerId);      // debouncing
        }
        timerId = setTimeout(() => {
            const editorContent = value;
            editorSocket.emit("writeFile", {
                data: editorContent,
                pathToFileOrFolder: activeFileTab.path
            })
        }, 2000)
    }


    useEffect(() => {
        downloadTheme();
    }, []);

    return (
        <>
            {editorState.theme && 
                <Editor 
                    width={'100%'}
                    defaultLanguage={undefined}
                    defaultValue="// Welcome to the Playground"
                    options={{
                        fontSize: 18,
                        fontFamily: 'monospace'
                    }}
                    language={extensionToFileType(activeFileTab?.extension)}
                    onChange={handleChange}
                    value={activeFileTab?.value ? activeFileTab.value : "// Welcome to playground"}
                    onMount={handleEditorTheme}
                />
            }
        </>
    )
}