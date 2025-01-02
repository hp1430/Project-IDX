import { Button, Layout } from "antd";
import { useCreateProject } from "../hooks/apis/mutations/useCreateProject";
import { useNavigate } from "react-router-dom";

const layoutStyle = {
  minHeight: "100vh",
  backgroundColor: "#1e1e2f",
  color: "#e0e0e0",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const headerStyle = {
  textAlign: "center",
  color: "#ffffff",
  height: 80,
  lineHeight: "80px",
  backgroundColor: "#252539",
  fontSize: "2rem",
  fontWeight: "bold",
  borderBottom: "2px solid #33334d",
};

const contentStyle = {
  flex: 1,
  textAlign: "center",
  padding: "20px",
  color: "#e0e0e0",
  backgroundColor: "#1e1e2f",
  fontSize: "1.1rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const buttonStyle = {
  padding: "12px 24px",
  fontSize: "1rem",
  fontWeight: "bold",
  backgroundColor: "#4096ff",
  color: "#fff",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 10px rgba(64, 150, 255, 0.5)",
  marginTop: "20px",
};

const footerStyle = {
  textAlign: "center",
  color: "#ffffff",
  backgroundColor: "#252539",
  padding: "20px",
  fontSize: "1rem",
  borderTop: "2px solid #33334d",
};

export const CreateProject = () => {
  const { Header, Footer, Content } = Layout;

  const { createProjectMutation } = useCreateProject();

  const navigate = useNavigate();

  async function handleCreateProject() {
    console.log("Going to trigger the API");
    try {
      const response = await createProjectMutation();
      console.log("Now we should redirect to the editor");
      console.log(response);
      navigate(`/projects/${response.data}`);
    } catch (error) {
      console.log("Error while creating the project ", error);
    }
  }

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <h1>Create Project</h1>
      </Header>
      <Content style={contentStyle}>
        <h2>Welcome to the Project Creator</h2>
        <p>
          Easily create and manage your projects with our intuitive interface. Click
          the button below to start building your next big idea!
        </p>
        <p>
          Our platform provides you with all the tools you need to collaborate,
          edit, and deploy your projects seamlessly. Whether you're working alone
          or with a team, we’ve got you covered.
        </p>
        <Button style={buttonStyle} onClick={handleCreateProject}>
          Create Playground
        </Button>
      </Content>
      <Footer style={footerStyle}>
        <p>Made with ❤️ by Himanshu Parashar</p>
      </Footer>
    </Layout>
  );
};
