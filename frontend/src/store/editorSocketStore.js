import { create } from "zustand";
import { useActiveFileTabStore } from "./activeFileTabStore";
import { useTreeStructureStore } from "./treeStructureStore";
import { useFolderContextMenuStore } from "./folderContextMenuStore";
import { useFileContextMenuStore } from "./fileContextMenuStore";
import { usePortStore } from "./portStore";
import { useActiveFilesStore } from "./activeFilesStore";

export const useEditorSocketStore = create((set) => ({
    editorSocket: null,
    setEditorSocket: (incomingSocket) => {

        const activeFileTabSetter = useActiveFileTabStore.getState().setActiveFileTab;
        const projectTreeStructureSetter = useTreeStructureStore.getState().setTreeStructure;
        const setIsOpenFolder = useFolderContextMenuStore.getState().setIsOpen;
        const setIsOpenFile = useFileContextMenuStore.getState().setIsOpen;
        const portSetter = usePortStore.getState().setPort;
        const filesSetter = useActiveFilesStore.getState().setActiveFiles;

        incomingSocket?.on("readFileSuccess", (data) => {
            console.log("Read file success ", data);
            const fileExtension = data.path.split('.').pop();
            activeFileTabSetter(data.path, data.value, fileExtension);

            let filePath = data.path;
            filePath = filePath.replace(/\\/g, "\\\\");
            
            const activeFiles = useActiveFilesStore.getState().activeFiles;

            const isFileAlreadyActive = activeFiles.some(file => file.path === data.path);
            
            if(!isFileAlreadyActive) {
                filesSetter({
                    name: filePath.split("\\").pop(),
                    path: data.path,
                    action: "add"
                })
            }
        })

        incomingSocket?.on("writeFileSuccess", (data) => {
            console.log("Write file success ", data);
            incomingSocket.emit("readFile", {
                pathToFileOrFolder: data.path
            })
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

        incomingSocket?.on("getPortSuccess", ({ port }) => {
            console.log("Port is ", port);
            portSetter(port);
        });

        set({
            editorSocket: incomingSocket
        });
    }
}));