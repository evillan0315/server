import os from "os";
import osu from "os-utils";

export class MonitorService {
  static async getSystemStats(): Promise<any> {
    return new Promise((resolve) => {
      osu.cpuUsage((cpuPercent: number) => {
        const freeMem = os.freemem();
        const totalMem = os.totalmem();
        const memUsedPercent = ((totalMem - freeMem) / totalMem) * 100;

        const load = os.loadavg();
        const processes = MonitorService.getProcesses();

        resolve({
          cpuUsage: (cpuPercent * 100).toFixed(2) + "%",
          memoryUsage: memUsedPercent.toFixed(2) + "%",
          loadAvg: {
            "1m": load[0].toFixed(2),
            "5m": load[1].toFixed(2),
            "15m": load[2].toFixed(2),
          },
          processes,
        });
      });
    });
  }

  static getProcesses(): { pid: string; command: string; cpu: string; mem: string }[] {
    return os
      .cpus()
      .map((_, index) => ({
        pid: `CPU${index}`,
        command: "Process",
        cpu: (Math.random() * 100).toFixed(2) + "%",
        mem: (Math.random() * 10).toFixed(2) + "%",
      }));
  }
}

