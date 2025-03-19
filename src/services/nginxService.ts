import fs from "fs-extra";
import handlebars from "handlebars";
import { exec } from "child_process";
import path from "path";
import { config } from "dotenv";

config(); // Load environment variables

interface NginxConfig {
    server_name: string;
    main_proxy?: string;
    api_routes: Record<string, string>; // Ensures route keys are strings with string values (URLs)
    websocket_proxy?: string;
}

class NginxService {
    private templatePath = process.env.NGINX_CONFIG_TEMPLATE || "src/templates/nginx_template.hbs";
    private nginxConfigDir = process.env.NGINX_CONFIG_DIR || "/etc/nginx/sites-available";

    private getConfigPath(serverName: string): string {
        return path.join(this.nginxConfigDir, serverName);
    }

    private validateConfig(configData: NginxConfig): boolean {
        if (!configData.server_name || Object.keys(configData.api_routes).length === 0) {
            console.error("Invalid Nginx configuration: Missing required fields.");
            return false;
        }
        return true;
    }

    generateConfig(configData: NginxConfig): string {
        try {
            if (!this.validateConfig(configData)) {
                throw new Error("Invalid configuration data.");
            }

            const templateContent = fs.readFileSync(this.templatePath, "utf8");
            const template = handlebars.compile(templateContent);
            return template(configData);
        } catch (error) {
            console.error("Error generating Nginx configuration:", error);
            throw error;
        }
    }

    async saveConfig(configData: NginxConfig): Promise<void> {
        try {
            if (!this.validateConfig(configData)) {
                throw new Error("Cannot save invalid configuration.");
            }

            const configPath = this.getConfigPath(configData.server_name);
            const output = this.generateConfig(configData);

            fs.writeFileSync(configPath, output);
            fs.chmodSync(configPath, 0o644); // Ensure correct file permissions
            console.log(`✅ Configuration saved at ${configPath}`);
        } catch (error) {
            console.error("Failed to save Nginx configuration:", error);
            throw error;
        }
    }

    async reloadNginx(serverName: string): Promise<string> {
        try {
            const configPath = this.getConfigPath(serverName);
            return await new Promise((resolve, reject) => {
                exec(
                    `sudo ln -sf ${configPath} /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx`,
                    (err, stdout, stderr) => {
                        if (err) {
                            console.error("Nginx reload error:", stderr);
                            reject(stderr);
                        } else {
                            console.log("🔄 Nginx reloaded successfully.");
                            resolve(stdout);
                        }
                    }
                );
            });
        } catch (error) {
            console.error("Failed to reload Nginx:", error);
            throw error;
        }
    }
}

export default new NginxService();

