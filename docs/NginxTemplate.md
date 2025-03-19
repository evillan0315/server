Here’s a well-structured **Nginx template (`nginx_template.hbs`)** that dynamically configures reverse proxying, API routing, and WebSocket handling based on the provided configuration:  

```hbs
server {
    listen 80;
    server_name {{server_name}};

    {{#if main_proxy}}
    location / {
        proxy_pass {{main_proxy}};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    {{/if}}

    {{#each api_routes}}
    location {{@key}} {
        proxy_pass {{this}};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    {{/each}}

    {{#if websocket_proxy}}
    location /socket.io/ {
        proxy_pass {{websocket_proxy}};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
    {{/if}}

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

---

### **Explanation of Template Features:**
1. **Main Proxy (`main_proxy`)**  
   - If provided, all root-level traffic (`/`) is proxied to the specified backend service.

2. **API Routes (`api_routes`)**  
   - Uses `{{#each api_routes}}` to dynamically generate location blocks for API endpoints.

3. **WebSocket Proxy (`websocket_proxy`)**  
   - If enabled, routes `/socket.io/` to the WebSocket backend with proper upgrade headers.

4. **Error Handling**  
   - Custom error pages for `500`, `502`, `503`, and `504` errors.

---

### **Example Output**
For this input:
```json
{
  "server_name": "example.com",
  "main_proxy": "http://localhost:3000",
  "api_routes": {
    "/api/files": "http://localhost:4000",
    "/api/auth": "http://localhost:5000"
  },
  "websocket_proxy": "http://localhost:6000"
}
```
The generated Nginx config would be:
```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/files {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/auth {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io/ {
        proxy_pass http://localhost:6000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

---

This setup makes the template **highly dynamic, reusable, and scalable** for different use cases!.
