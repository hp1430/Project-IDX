import { create } from "zustand";

export const useFileNameStore = create((set) => ({
    x: null,
    y: null,
    fileName: null,
    isVisible: false,
    path: null,
    setX: (incomingX) => {
        set({
            x: incomingX
        });
    },
    setY: (incomingY) => {
        set({
            y: incomingY
        });
    },
    setFileName: (incomingFileName) => {
        set({
            fileName: incomingFileName
        });
    },
    setIsVisible: (incomingIsVisible) => {
        set({
            isVisible: incomingIsVisible
        });
    },
    setPath: (incomingPath) => {
        set({
            path: incomingPath
        });
    }
}))