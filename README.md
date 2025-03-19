# Project Documentation

**Author:** Eddie Villanueva

## Overview
This project is a backend server built with Express and TypeScript that provides file management, command execution, WebSocket communication, authentication using AWS Cognito OAuth 2.0, and dynamic Nginx configuration management.

## Features
- File system operations (listing, reading, creating files)
- Command execution via API and WebSocket
- WebSocket support for real-time interaction
- Secure SSH connection handling (future implementation)
- OAuth 2.0 authentication with AWS Cognito
- Secure token exchange for user login
- User information retrieval via AWS Cognito API
- **Dynamic Nginx configuration management** for proxy setup and WebSocket support
- **DynamoDB integration** for storing command execution logs

## Folder Structure
```
PROJECT_NAME/
│── src/
│   ├── routes/              # API route handlers
│   │   ├── files.ts         # Handles file operations
│   │   ├── commands.ts      # Handles command execution
│   │   ├── auth.ts          # Handles authentication routes
│   │   ├── nginx.ts         # Handles Nginx configuration management
│   ├── controllers/         # Controller logic
│   │   ├── fileController.ts
│   │   ├── commandController.ts
│   │   ├── authController.ts
│   │   ├── nginxController.ts
│   ├── services/            # Service logic
│   │   ├── websocketService.ts # WebSocket server logic
│   │   ├── sshService.ts    # SSH connection logic
│   │   ├── authService.ts   # Handles OAuth token exchange
│   │   ├── nginxService.ts  # Manages Nginx configuration
│   │   ├── dynamoService.ts # Handles DynamoDB interactions
│   ├── utils/               # Utility functions
│   │   ├── fileUtils.ts     # File management functions
│   │   ├── commandUtils.ts  # Command execution helpers
│   ├── config/              # Configuration files
│   │   ├── serverConfig.ts  # Server configuration
│   │   ├── cognitoConfig.ts # AWS Cognito configuration
│   ├── app.ts               # Express server entry point
│── .env                     # Environment variables
│── package.json             # Project dependencies
│── tsconfig.json            # TypeScript configuration
│── README.md                # Project documentation
```

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/node-api-ts/node-api-ts.git
   cd node-api-ts
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env` and configure necessary values.
4. Run the project:
   ```sh
   npm run dev
   ```

## API Endpoints
- `GET /api/files` - Fetch directory structure or file content.
- `GET /api/files/download` - Download a specific file.
- `POST /api/files` - Create or update a file.
- `POST /run` - Execute a shell command.
- `GET /login` - Redirects the user to AWS Cognito login page.
- `GET /signin` - Sign in Page.
- `POST /Login` - 
- `GET /auth/callback` - Handles OAuth callback and retrieves tokens.
- `GET /logout` - Logs out the user and destroys session.
- `POST /nginx` - Generates and saves an Nginx configuration.
- `POST /nginx/reload` - Reloads Nginx with the new configuration.
- `POST /api/commands/store` - Stores executed command in DynamoDB.
- `GET /api/commands` - Retrieves stored commands from DynamoDB.
- `POST /api/auth/token` - Exchanges authorization code for an access token.
- `GET /api/auth/user` - Retrieves authenticated user information.

---

## API Endpoints  

### **File Management**  
- `GET /api/files` – Fetch directory structure or file content.  
  - **Query Parameters:**  
    - `path` (optional) – Path of the directory or file to retrieve.  
  - **Response:**  
    ```json
    {
      "files": ["file1.txt", "file2.txt"],
      "directories": ["folder1", "folder2"]
    }
    ```  
- `GET /api/files/download` – Download a specific file.  
  - **Query Parameters:**  
    - `filePath` (required) – Path of the file to download.  
- `POST /api/files` – Create or update a file.  
  - **Request Body:**  
    ```json
    {
      "filePath": "path/to/file.txt",
      "content": "Updated file content"
    }
    ```  
  - **Response:**  
    ```json
    { "message": "File saved successfully" }
    ```  

### **Command Execution**  
- `POST /run` – Execute a shell command.  
  - **Request Body:**  
    ```json
    {
      "command": "ls -la"
    }
    ```  
  - **Response:**  
    ```json
    {
      "output": "total 0\n-rw-r--r-- 1 user user 0 file.txt"
    }
    ```  

### **Authentication & OAuth**  
- `GET /login` – Redirects the user to the AWS Cognito login page.  
- `GET /signin` – Displays a custom sign-in page.  
- `POST /Login` – Authenticates user credentials and returns an access token.  
  - **Request Body:**  
    ```json
    {
      "username": "user@example.com",
      "password": "password123"
    }
    ```  
  - **Response:**  
    ```json
    {
      "accessToken": "jwt-token-here",
      "refreshToken": "refresh-token-here"
    }
    ```  
- `GET /auth/callback` – Handles OAuth callback and retrieves tokens.  
- `GET /logout` – Logs out the user and destroys the session.  

### **Nginx Configuration Management**  
- `POST /nginx` – Generates and saves an Nginx configuration.  
- `POST /nginx/reload` – Reloads Nginx with the new configuration.  

### **Command Storage & Retrieval (DynamoDB)**  
- `POST /api/commands/store` – Stores executed command in DynamoDB.  
  - **Request Body:**  
    ```json
    {
      "command": "ls -la",
      "timestamp": "2025-03-17T12:00:00Z"
    }
    ```  
  - **Response:**  
    ```json
    { "message": "Command stored successfully" }
    ```  
- `GET /api/commands` – Retrieves stored commands from DynamoDB.  
  - **Response:**  
    ```json
    {
      "commands": [
        {
          "command": "ls -la",
          "timestamp": "2025-03-17T12:00:00Z"
        }
      ]
    }
    ```  

### **Token Exchange & User Info**  
- `POST /api/auth/token` – Exchanges an authorization code for an access token.  
  - **Request Body:**  
    ```json
    {
      "code": "auth-code-from-cognito"
    }
    ```  
  - **Response:**  
    ```json
    {
      "accessToken": "jwt-token-here",
      "expiresIn": 3600
    }
    ```  
- `GET /api/auth/user` – Retrieves authenticated user information.  
  - **Response:**  
    ```json
    {
      "username": "user@example.com",
      "email": "user@example.com",
      "roles": ["admin", "user"]
    }
    ```  

Would you like any additional enhancements, such as error handling details? 😊

## WebSocket Support
- Connect via WebSocket for real-time command execution.
- WebSocket proxying through Nginx at `/ws/` for real-time applications.

## DynamoDB Integration
- Stores executed shell commands with timestamps.
- Provides a history of executed commands for auditing.

## Nginx Configuration Management
- Generate and save dynamic Nginx configuration based on API input.
- Reload Nginx with new configurations.
- WebSocket proxy support for real-time applications.

## Nginx Configuration Generator
The project includes a TypeScript-based Nginx configuration generator using Handlebars templates. It supports:
- **Dynamic proxying** for main API routes and authentication endpoints.
- **WebSocket support** at `/ws/` for real-time interactions.
- **Automatic Nginx configuration updates and reloads**.


1. **Enhance Environment Variables Section**  
   - Add a short list of required `.env` variables (e.g., AWS Cognito credentials, database connection strings).  
   - Example format:  
     ```sh
     COGNITO_CLIENT_ID=
     COGNITO_CLIENT_SECRET=
     DYNAMODB_TABLE_NAME=
     ```

2. **Include Contribution Guidelines**  
   - If others might contribute, a "Contributing" section with PR guidelines and code style rules would help.

3. **Expand API Endpoint Details**  
   - Mention required request parameters, response formats, and error handling.  
   - Example:  
     ```
     POST /api/files
     Request Body:
     {
       "filePath": "path/to/file.txt",
       "content": "File contents..."
     }
     Response:
     {
       "message": "File saved successfully"
     }
     ```

4. **Security Considerations**  
   - Briefly outline security best practices (e.g., JWT expiration, CSRF protection, Nginx SSL enforcement).  



## License
This project is licensed under the MIT License.


