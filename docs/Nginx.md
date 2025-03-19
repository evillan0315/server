# Nginx documenation and configurations


Here’s an updated **TypeScript-based Nginx configuration generator** that includes **WebSocket proxying** for `ws://localhost:5000`.  

---

## **Step 1: Update the Nginx Template**
Modify `nginx_template.hbs` to include WebSocket support:

```hbs
server {
    listen 80;
    server_name {{server_name}};

    {{#if main_proxy}}
    location / {
        proxy_pass http://{{main_proxy}};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    {{/if}}

    {{#each api_routes}}
    location {{@key}} {
        proxy_pass http://{{this}};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    {{/each}}

    {{#if websocket_proxy}}
    location /ws/ {
        proxy_pass {{websocket_proxy}};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    {{/if}}
}
```

---

## **Step 2: Update the TypeScript Script**
Modify `generate_nginx.ts`:

```typescript
import fs from "fs-extra";
import handlebars from "handlebars";
import { exec } from "child_process";

// Define the interface for our configuration
interface NginxConfig {
    server_name: string;
    main_proxy?: string;
    api_routes: Record<string, string>;
    websocket_proxy?: string;
}

// Load the Handlebars template
const templateContent = fs.readFileSync("nginx_template.hbs", "utf8");
const template = handlebars.compile(templateContent);

// Define configuration values dynamically
const configData: NginxConfig = {
    server_name: "example.com",
    main_proxy: "localhost:3000",
    api_routes: {
        "/api/": "localhost:5000/api",
        "/auth/": "localhost:5000/auth",
        "/profile/": "localhost:5000/profile"
    },
    websocket_proxy: "ws://localhost:5000"
};

// Generate the final Nginx configuration
const output = template(configData);

// Define the file paths
const nginxConfigPath = "/etc/nginx/sites-available/example";

// Write the generated configuration to the Nginx directory
fs.writeFileSync(nginxConfigPath, output);

console.log("✅ Nginx configuration with WebSocket support generated successfully!");

// Enable the configuration and reload Nginx
exec(
    `sudo ln -sf ${nginxConfigPath} /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx`,
    (err, stdout, stderr) => {
        if (err) {
            console.error(`❌ Error reloading Nginx: ${stderr}`);
            return;
        }
        console.log(`🔄 Nginx reloaded successfully:\n${stdout}`);
    }
);
```

---

## **Step 3: Compile & Run the Script**
Compile the TypeScript file:
```sh
npx tsc generate_nginx.ts
```
Run the compiled script:
```sh
node generate_nginx.js
```

---

## **What This Adds**
- **WebSocket support** at `/ws/` proxying `ws://localhost:5000`
- **Dynamic configuration generation**
- **Auto-applies and reloads Nginx**

This approach ensures **real-time WebSocket handling** along with HTTP proxying in Nginx. 🚀 Let me know if you need more customizations!

Here's the structured API setup using **Express** in TypeScript with a proper separation of concerns:  

📂 **Project Structure**:
```
/project-root
 ├── /src
 │   ├── /routes
 │   │   ├── nginx.routes.ts
 │   ├── /controllers
 │   │   ├── nginx.controller.ts
 │   ├── /services
 │   │   ├── nginx.service.ts
 │   ├── nginx_template.hbs
 │   ├── app.ts
 │   ├── server.ts
 ├── package.json
 ├── tsconfig.json
 ├── .gitignore
```

---

## **Step 1: Install Dependencies**
Run:
```sh
npm install express fs-extra handlebars child_process
npm install --save-dev typescript @types/express @types/node @types/fs-extra @types/handlebars
```

---

## **Step 2: Create the Service (Business Logic)**
📌 `src/services/nginx.service.ts`
```typescript
import fs from "fs-extra";
import handlebars from "handlebars";
import { exec } from "child_process";

interface NginxConfig {
    server_name: string;
    main_proxy?: string;
    api_routes: Record<string, string>;
    websocket_proxy?: string;
}

class NginxService {
    private templatePath = "src/nginx_template.hbs";
    private nginxConfigPath = "/etc/nginx/sites-available/example";

    generateConfig(configData: NginxConfig): string {
        const templateContent = fs.readFileSync(this.templatePath, "utf8");
        const template = handlebars.compile(templateContent);
        return template(configData);
    }

    async saveConfig(configData: NginxConfig): Promise<void> {
        const output = this.generateConfig(configData);
        fs.writeFileSync(this.nginxConfigPath, output);
    }

    async reloadNginx(): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(
                `sudo ln -sf ${this.nginxConfigPath} /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx`,
                (err, stdout, stderr) => {
                    if (err) {
                        reject(stderr);
                    } else {
                        resolve(stdout);
                    }
                }
            );
        });
    }
}

export default new NginxService();
```

---

## **Step 3: Create the Controller (Request Handling)**
📌 `src/controllers/nginx.controller.ts`
```typescript
import { Request, Response } from "express";
import NginxService from "../services/nginx.service";

class NginxController {
    async generateAndSaveConfig(req: Request, res: Response) {
        try {
            const configData = req.body;
            await NginxService.saveConfig(configData);
            res.status(200).json({ message: "✅ Nginx configuration generated successfully!" });
        } catch (error) {
            res.status(500).json({ message: "❌ Failed to generate configuration", error });
        }
    }

    async reloadNginx(req: Request, res: Response) {
        try {
            const result = await NginxService.reloadNginx();
            res.status(200).json({ message: "🔄 Nginx reloaded successfully!", result });
        } catch (error) {
            res.status(500).json({ message: "❌ Failed to reload Nginx", error });
        }
    }
}

export default new NginxController();
```

---

## **Step 4: Create the Routes**
📌 `src/routes/nginx.routes.ts`
```typescript
import { Router } from "express";
import NginxController from "../controllers/nginx.controller";

const router = Router();

router.post("/generate", NginxController.generateAndSaveConfig);
router.post("/reload", NginxController.reloadNginx);

export default router;
```

---

## **Step 5: Setup Express App**
📌 `src/app.ts`
```typescript
import express from "express";
import nginxRoutes from "./routes/nginx.routes";

const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies
app.use("/nginx", nginxRoutes);

export default app;
```

---

## **Step 6: Create the Server**
📌 `src/server.ts`
```typescript
import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

## **Step 7: Run the Server**
Compile TypeScript and start the server:
```sh
npx tsc
node dist/server.js
```

Or for **development** with automatic restarts:
```sh
npm install --save-dev nodemon ts-node
npx nodemon src/server.ts
```

---

## **API Endpoints**
| Method | Endpoint            | Description                        |
|--------|---------------------|------------------------------------|
| `POST` | `/nginx/generate`   | Generates and saves the config    |
| `POST` | `/nginx/reload`     | Reloads Nginx                     |

### Example Request:
```json
POST /nginx/generate
Content-Type: application/json

{
    "server_name": "example.com",
    "main_proxy": "localhost:3000",
    "api_routes": {
        "/api/": "localhost:5000/api",
        "/auth/": "localhost:5000/auth",
        "/profile/": "localhost:5000/profile"
    },
    "websocket_proxy": "ws://localhost:5000"
}
```

---

## **🎯 Features**
✅ **Structured API** with routes, controllers, and services  
✅ **Dynamic Nginx Configuration** using **Handlebars**  
✅ **REST API** to **generate, save, and reload** Nginx config  
✅ **Modular & Scalable**  

This makes it **easy to integrate and extend**! 🚀 Let me know if you need any tweaks!


## Integration with current application (Express + Typescript)

### **Updated `app.ts` with Nginx Routes**
📌 Modify your existing `app.ts` to include `nginxRoutes`:
```typescript
import express from "express";
import cors from "cors";
import http from "http";
import { config } from "dotenv";
import fileRoutes from "./routes/files";
import commandRoutes from "./routes/commands";
import authRoutes from "./routes/auth";
import nginxRoutes from "./routes/nginx.routes"; // Import Nginx routes
import { initializeWebSocket } from "./services/websocketService";
import { authenticate } from "./middlewares/authMiddleware";

config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use("/api", authenticate, fileRoutes);
app.use("/api", authenticate, commandRoutes);
app.use(authRoutes);
app.use("/api/nginx", authenticate, nginxRoutes); // Add Nginx routes

initializeWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
```

---

### **Ensure You Have the Following Files**
#### **Nginx Service**
📌 `src/services/nginx.service.ts`
```typescript
import fs from "fs-extra";
import handlebars from "handlebars";
import { exec } from "child_process";
import path from "path";
import { config } from "dotenv";

config(); // Load environment variables

interface NginxConfig {
    server_name: string;
    main_proxy?: string;
    api_routes: Record<string, string>;
    websocket_proxy?: string;
}

class NginxService {
    private templatePath = "src/nginx_template.hbs";
    private nginxConfigDir = process.env.NGINX_CONFIG_DIR || "/etc/nginx/sites-available";
    
    private getConfigPath(serverName: string): string {
        return path.join(this.nginxConfigDir, `${serverName}`);
    }

    generateConfig(configData: NginxConfig): string {
        const templateContent = fs.readFileSync(this.templatePath, "utf8");
        const template = handlebars.compile(templateContent);
        return template(configData);
    }

    async saveConfig(configData: NginxConfig): Promise<void> {
        const configPath = this.getConfigPath(configData.server_name);
        const output = this.generateConfig(configData);
        fs.writeFileSync(configPath, output);
    }

    async reloadNginx(serverName: string): Promise<string> {
        const configPath = this.getConfigPath(serverName);
        return new Promise((resolve, reject) => {
            exec(
                `sudo ln -sf ${configPath} /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx`,
                (err, stdout, stderr) => {
                    if (err) {
                        reject(stderr);
                    } else {
                        resolve(stdout);
                    }
                }
            );
        });
    }
}

export default new NginxService();

```

---

#### **Nginx Controller**
📌 `src/controllers/nginx.controller.ts`
```typescript
import { Request, Response } from "express";
import NginxService from "../services/nginx.service";

class NginxController {
    async generateAndSaveConfig(req: Request, res: Response) {
        try {
            const configData = req.body;
            await NginxService.saveConfig(configData);
            res.status(200).json({ message: "✅ Nginx configuration generated successfully!" });
        } catch (error) {
            res.status(500).json({ message: "❌ Failed to generate configuration", error });
        }
    }

    async reloadNginx(req: Request, res: Response) {
        try {
            const result = await NginxService.reloadNginx();
            res.status(200).json({ message: "🔄 Nginx reloaded successfully!", result });
        } catch (error) {
            res.status(500).json({ message: "❌ Failed to reload Nginx", error });
        }
    }
}

export default new NginxController();
```

---

#### **Nginx Routes**
📌 `src/routes/nginx.routes.ts`
```typescript
import { Router } from "express";
import NginxController from "../controllers/nginx.controller";

const router = Router();

router.post("/generate", NginxController.generateAndSaveConfig);
router.post("/reload", NginxController.reloadNginx);

export default router;
```

---

### **Now, Your API Supports These Endpoints:**
| Method | Endpoint            | Description                        |
|--------|---------------------|------------------------------------|
| `POST` | `/api/nginx/generate` | Generates and saves the config    |
| `POST` | `/api/nginx/reload`   | Reloads Nginx                     |

### **Test the API**
Try sending a **POST request** to generate a new Nginx configuration:

```json
POST /api/nginx/generate
Content-Type: application/json

{
    "server_name": "example.com",
    "main_proxy": "localhost:3000",
    "api_routes": {
        "/api/": "localhost:5000/api",
        "/auth/": "localhost:5000/auth",
        "/profile/": "localhost:5000/profile"
    },
    "websocket_proxy": "ws://localhost:5000"
}
```

🚀 **Now your API can dynamically generate and reload Nginx configurations!**
