import { NodeSSH } from "node-ssh";
import fs from 'fs';
const ssh = new NodeSSH();

export async function executeRemoteCommand(host: string, username: string, privateKeyPath: string, command: string) {
  await ssh.connect({ host, username, privateKey: privateKeyPath });
  const result = await ssh.execCommand(command);
  return result.stdout || result.stderr;
}
export async function connectSSH() {
  try {
    console.log("Checking SSH environment variables...");
    console.log("SSH_HOST:", process.env.SSH_HOST);
    console.log("SSH_USER:", process.env.SSH_USER);
    console.log("SSH_PASS:", process.env.SSH_PASS ? "Set" : "Not Set");
    console.log("SSH_KEY_PATH:", process.env.SSH_KEY_PATH || "Not Set");

    const sshConfig: any = {
      host: process.env.SSH_HOST || "your-ssh-server.com",
      username: process.env.SSH_USER || "your-username",
    };

    // Check for PEM key file
    if (process.env.SSH_KEY_PATH) {
      const keyPath = process.env.SSH_KEY_PATH;
      if (!fs.existsSync(keyPath)) {
        throw new Error("PEM file not found at ");
      }
      sshConfig.privateKey = fs.readFileSync(keyPath, "utf-8");
      console.log("Using PEM key authentication: ");
    } else if (process.env.SSH_PASS) {
      sshConfig.password = process.env.SSH_PASS;
      console.log("Using password authentication");
    } else {
      throw new Error("No SSH authentication method provided.");
    }

    await ssh.connect(sshConfig);
    console.log("SSH Connection Established");
    return ssh;
  } catch (err) {
    console.error("SSH Connection Failed:", err);
    return null;
  }
}
