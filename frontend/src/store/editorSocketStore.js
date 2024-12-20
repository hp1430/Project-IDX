import { create } from "zustand";
import { useActiveFileTabStore } from "./activeFileTabStore";
import { useTreeStructureStore } from "./treeStructureStore";
import { useFolderContextMenuStore } from "./folderContextMenuStore";
import { useFileContextMenuStore } from "./fileContextMenuStore";

export const useEditorSocketStore = create((set) => ({
    editorSocket: null,
    setEditorSocket: (incomingSocket) => {

        const activeFileTabSetter = useActiveFileTabStore.getState().setActiveFileTab;
        const projectTreeStructureSetter = useTreeStructureStore.getState().setTreeStructure;
        const setIsOpenFolder = useFolderContextMenuStore.getState().setIsOpen;
        const setIsOpenFile = useFileContextMenuStore.getState().setIsOpen;

        incomingSocket?.on("readFileSuccess", (data) => {
            console.log("Read file success ", data);
            const fileExtension = data.path.split('.').pop();
            activeFileTabSetter(data.path, data.value, fileExtension);
        })

        incomingSocket?.on("writeFileSuccess", (data) => {
            console.log("Write file success ", data);
            // incomingSocket.emit("readFile", {
            //     pathToFileOrFolder: data.path
            // })
        })

        incomingSocket?.on("deleteFileSuccess", () => {
            setIsOpenFile(false);
            activeFileTabSetter(null);
            projectTreeStructureSetter();
        })

        incomingSocket?.on("DeleteFolderSuccess", () => {
            setIsOpenFolder(false);
            activeFileTabSetter(null);
            projectTreeStructureSetter();
        })

        incomingSocket?.on("creteFileSuccess", (data) => {
            console.log(data);
            projectTreeStructureSetter();
        })

        incomingSocket?.on("renameFileSuccess", () => {
            projectTreeStructureSetter();
        })

        incomingSocket?.on("createFolderSuccessfully", (data) => {
            console.log(data);
            projectTreeStructureSetter();
        });

        incomingSocket?.on("error", (data) => {
            console.log(data);
        })

        set({
            editorSocket: incomingSocket
        });
    }
}));