module.exports = {
  apps: [
    {
      name: "nginx-ui",
      script: "npm run dev",
      args: "src/app.ts",
      instances: 1,
      exec_mode: "fork",
      watch: true,
      autorestart: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 5000
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000
      }
    }
  ]
};
