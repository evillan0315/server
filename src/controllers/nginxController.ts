import { Request, Response } from "express";
import fs from "fs-extra";
import { exec } from "child_process";
import path from "path";
import NginxService from "../services/nginxService";
import { config } from "dotenv";

config(); // Load environment variables

const NGINX_CONFIG_DIR = process.env.NGINX_CONFIG_DIR || "/etc/nginx/sites-available";
const NGINX_ENABLED_DIR = "/etc/nginx/sites-enabled"; // Symlink directory

/**
 * Generate and save an Nginx configuration
 */
export const generateNginxConfig = async (req: Request, res: Response) => {
    try {
        const { domain, backendUrl, websocketPath, apiRoutes } = req.body;
        if (!domain || !backendUrl) {
            return res.status(400).json({ error: "Missing required parameters: domain, backendUrl" });
        }

        const configPath = path.join(NGINX_CONFIG_DIR, domain);
        const configContent = NginxService.generateConfig({ 
            server_name: domain, 
            main_proxy: backendUrl, 
            websocket_proxy: websocketPath, 
            api_routes: apiRoutes || {} 
        });

        await fs.writeFile(configPath, configContent);

        // Enable site by creating a symlink in sites-enabled
        const enabledPath = path.join(NGINX_ENABLED_DIR, domain);
        await fs.symlink(configPath, enabledPath);

        return res.json({ message: "Nginx configuration generated and enabled successfully." });
    } catch (error) {
        return res.status(500).json({ error: "Failed to generate Nginx configuration", details: error.message });
    }
};

/**
 * Retrieve the current Nginx configuration for a domain
 */
export const getNginxConfig = async (req: Request, res: Response) => {
    try {
        const { domain } = req.params;
        if (!domain) {
            return res.status(400).json({ error: "Missing required parameter: domain" });
        }

        const configPath = path.join(NGINX_CONFIG_DIR, domain);
        if (!fs.existsSync(configPath)) {
            return res.status(404).json({ error: "Configuration not found for the specified domain." });
        }
        console.log(configPath, 'configPath');
        const configContent = await fs.readFile(configPath, "utf8");
        return res.json({ config: configContent });
    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve Nginx configuration", details: error.message });
    }
};

/**
 * Update the Nginx configuration for a specific domain
 */
export const updateNginxConfig = async (req: Request, res: Response) => {
    try {
        const { domain, newConfig } = req.body;
        if (!domain || !newConfig) {
            return res.status(400).json({ error: "Missing required parameters: domain, newConfig" });
        }

        const configPath = path.join(NGINX_CONFIG_DIR, domain);
        await fs.writeFile(configPath, newConfig);

        return res.json({ message: "Nginx configuration updated successfully." });
    } catch (error) {
        return res.status(500).json({ error: "Failed to update Nginx configuration", details: error.message });
    }
};

/**
 * Reload Nginx to apply the new configuration
 */
export const reloadNginx = async (req: Request, res: Response) => {
    exec("sudo systemctl reload nginx", (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: "Failed to reload Nginx", details: stderr });
        }
        return res.json({ message: "Nginx reloaded successfully.", output: stdout });
    });
};

