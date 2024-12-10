import { Route, Routes } from "react-router-dom"
import { CreateProject } from "./pages/CreateProject"
import { ProjectPlayground } from "./pages/ProjectPlayground"

export const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<CreateProject />} />
            <Route path="/projects/:projectId" element={<ProjectPlayground />} />
        </Routes>
    )
}