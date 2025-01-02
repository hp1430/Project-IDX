# Project IDX

## Overview

Project IDX is a online code editor and development environment that allows developers to quickly prototype, build, and share web applications

## Features

- A browser-based code editor that supports coding apps
- See real-time changes to your application with a live preview window.
- An online terminal connected to a docker container in the backend.
- Complete folder structure of the project created.
- Create isolated sandbox development environments to test and prototype ideas.
- Online code editor like vs code

## Technologies Used

- **Frontend:** JavaScript, React
- **Backend:** Node.js, Express.js
- **Real-Time Communicarion:** WebSockets
- **Containerization:** Docker

## Setup and Installation

To get a copy of this project up and running locally, follow the steps below.

  
### Installation Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/hp1430/Project-IDX.git
    ```

2. Navigate into the project directory:
    ```bash
    cd Project-IDX
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4.  ```bash
    cd backend
    ```
    Create .env file at backend and create variables PORT, REACT_PROJECT_COMMAND='npm create vite@latest sandbox -- --template react' and TERMINAL_PORT;

5. ```bash
    cd frontend
    ```
    Create .env file at backend and create variable VITE_BACKEND_URL= http://localhost:[Your Backend Port]

6. Start the application:
    - Start Backend: 
    ```bash
    cd backend
    npm run dev
    ```
    - Start Frontend: 
    ```bash
    cd frontend
    npm run dev
    ```
    - Start Terminal: 
    ```bash
    cd backend
    node src/terminalApp.js
    ```

Your project should now be running locally!

# Steps to turn up docker container after creating project

1. Setup the docker image

```
docker build -t sandbox .
```

## Contributing

We welcome contributions to make Project IDX even better! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add feature'`).
5. Push to the branch (`git push origin feature-name`).
6. Create a new Pull Request.


## Contact

For any inquiries, you can contact Himanshu Parashar at (https://www.linkedin.com/in/hp1430) or open an issue on the repository.

---

*Happy Coding!*
