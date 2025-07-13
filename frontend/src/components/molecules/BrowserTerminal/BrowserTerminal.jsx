import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import "@xterm/xterm/css/xterm.css";   // required styles
import { useEffect, useRef } from 'react';
import { AttachAddon } from '@xterm/addon-attach';
import { useTerminalSocketStore } from '../../../store/terminalSocketStore';

export const BrowserTerminal = () => {

    const terminalRef = useRef(null);

    const { terminalSocket } = useTerminalSocketStore();

    useEffect(() => {
        if (!terminalRef.current) return;

        const term = new Terminal({
            cursorBlink: true,
            theme: {
                background: "#282a37",
                foreground: "#f8f8f3",
                cursor: "#f8f8f3",
                cursorAccent: "#282a37",
                red: "#ff5544",
                green: "#50fa7c",
                yellow: "#f1fa8c",
                cyan: "#8be9fd",
            },
            fontSize: 16,
            fontFamily: "Consolas",
            convertEol: true,   // convert CRLF to LF
        });
        
        term.open(terminalRef.current);
        let fitAddon = new FitAddon();  //FitAddon is used to resize the terminal to fit the container
        term.loadAddon(fitAddon);
        
        // Add a small delay to ensure the terminal is properly mounted
        setTimeout(() => {
            try {
                fitAddon.fit();
            } catch (error) {
                console.warn('Failed to fit terminal:', error);
            }
        }, 100);

        if(terminalSocket) {
            terminalSocket.onopen = () => {
                try {
                    const attachAddon = new AttachAddon(terminalSocket);    // AttachAddon is used to attach the terminal to a socket/terminal(docker container)
                    term.loadAddon(attachAddon);
                } catch (error) {
                    console.error('Failed to attach terminal:', error);
                }
            }
            
            terminalSocket.onerror = (error) => {
                console.error('Terminal socket error:', error);
            }
        }

        return () => {
            try {
                term.dispose();
            } catch (error) {
                console.warn('Error disposing terminal:', error);
            }
        }
    }, [terminalSocket])

    return (
        <div
            ref={terminalRef}
            style={{
                width: "100vw",
            }}
            className='terminal'
            id='terminal-container'
        >

        </div>
    )
}