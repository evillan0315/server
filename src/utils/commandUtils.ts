import { spawn } from "child_process";

export async function runCommand(command: string) {
  return new Promise((resolve) => {
    const childProcess = spawn(command, { shell: true });
    let output = "";
    childProcess.stdout.on("data", (data) => output += data.toString());
    childProcess.stderr.on("data", (data) => output += "ERROR: " + data.toString());

    childProcess.on("close", (code) => resolve({ output, exitCode: code }));
  });
}
