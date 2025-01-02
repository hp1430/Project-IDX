import { useActiveFilesStore } from "../../../store/activeFilesStore"
import { EditorButton } from "../../atoms/EditorButton/EditorButton";

export const ActiveFiles = () => {

    const { activeFiles } = useActiveFilesStore();
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                backgroundColor: "#282a36",
                borderBottom: "1px solid #44475a"
            }}
        >
            {
                activeFiles?.map((file, index) => {
                    return (
                        <EditorButton  
                            name={file.name} 
                            path={file.path}
                            key={file.path || index}
                        />
                    )
                })
            }
        </div>
    )
}