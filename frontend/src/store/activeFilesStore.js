import { create } from "zustand";

export const useActiveFilesStore = create((set, get) => {
    return {
        activeFiles: [],
        setActiveFiles: ({ name, path, isActive, action }) => {
            const files = get().activeFiles
            if(action==="add") {
                set({
                    activeFiles: [...files, {
                        name: name,
                        path: path,
                        isActive: isActive
                    }]
                })
            }
            else if(action==="remove") {
                const newActiveFiles = files.filter(file => file.path !== path);
                set({
                    activeFiles: newActiveFiles
                })
            }
        }
    }
});