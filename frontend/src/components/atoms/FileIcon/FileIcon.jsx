import { FaCss3, FaHtml5, FaJs } from "react-icons/fa"
import { GrReactjs } from "react-icons/gr"
import { IoIosSettings } from "react-icons/io";
import { SiGitignoredotio, SiVite } from "react-icons/si";
import { VscJson } from "react-icons/vsc";
import { IoInformationCircle } from "react-icons/io5";

export const FileIcon = ({ extension }) => {

    const iconStyle = {
        height: "20px",
        width: "20px"
    }

    const IconMapper = {
        "js": <FaJs color="yellow" style={iconStyle} />,
        "jsx": <GrReactjs color="#61dbfa" style={iconStyle} />,
        "css": <FaCss3 color="#3c99dc" style={iconStyle} />,
        "html": <FaHtml5 color="#e34c26" style={iconStyle} />,
        "env": <IoIosSettings color="balck" style={iconStyle}/>,
        "gitignore": <SiGitignoredotio color="orange" style={iconStyle} />,
        "json": <VscJson color="yellow" style={iconStyle} />,
        "md": <IoInformationCircle color="#008ae6" style={iconStyle} />,
        "svg": <SiVite color="yellow" style={iconStyle}/>
    }
    return (
        <>
            {IconMapper[extension]}
        </>
    )
}