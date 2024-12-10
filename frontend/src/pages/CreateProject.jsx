import { Button, Layout } from "antd";
import { useCreateProject } from "../hooks/apis/mutations/useCreateProject"
import { useNavigate } from "react-router-dom";

const layoutStyle = {
    borderRadius: 8,
    overflow: "hidden",
    width: 'calc(50% - 8px)',
    maxWidth: 'calc(50% - 8px)'
};

const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInLine: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff'
};

const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#0958d9',
  };
  const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
  };

export const CreateProject = () => {

    const { Header, Footer, Content } = Layout;


    const { createProjectMutation } = useCreateProject();

    const navigate = useNavigate();

    async function handleCreateProject() {
        console.log("Going to trigger the api");
        try {
            const response = await createProjectMutation();
            console.log("Now we should redirect to the editor")
            navigate(`/projects/${response.data}`);
        }
        catch(error) {
            console.log("Error while creating the project ", error);
        }
    }
    return (
        <Layout style={ layoutStyle }>
            <Header style={headerStyle}>
                <h1>Create Project</h1>
            </Header>
            <Content style={contentStyle}>
                <Button
                    onClick={ handleCreateProject }
                >
                    Create Playground
                </Button>
            </Content>
            <Footer style={footerStyle}>
                Footer
            </Footer>
        </Layout>
    )
}