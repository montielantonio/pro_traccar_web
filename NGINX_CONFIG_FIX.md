# Nginx Configuration Fix for API Endpoints

## Problem
The application is getting 404 errors for `/api/session` and other API endpoints. This happens because:
1. Vite proxy only works in development mode
2. In production, you need Nginx to proxy API requests to the backend server

## Solution: Update Your Nginx Configuration

Add the following location blocks to your Nginx configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name track.gpslinkusa.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name track.gpslinkusa.com;

    # SSL certificates (adjust paths as needed)
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # Root directory for static files (your built frontend)
    root /path/to/your/build;
    index index.html;

    # API endpoints - proxy to backend server
    location /api/ {
        proxy_pass http://localhost:8082;  # Adjust port if your backend uses different port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # WebSocket endpoint for real-time updates
    location /api/socket {
        proxy_pass http://localhost:8082;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }

    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
```

## Steps to Fix:

1. **Update your Nginx configuration** with the above settings
2. **Adjust the backend port** if your Traccar backend runs on a different port (default is 8082)
3. **Update the root path** to point to your built frontend files
4. **Test the configuration**: `sudo nginx -t`
5. **Reload Nginx**: `sudo systemctl reload nginx` or `sudo nginx -s reload`

## For Development Mode:

If you're running in development mode (port 3000), make sure:
1. Your Vite dev server is running: `npm run dev`
2. The backend server is accessible at `https://track.gpslinkusa.com`
3. CORS is properly configured on the backend

## Verify the Fix:

After updating Nginx, test these endpoints:
- `https://track.gpslinkusa.com/api/session` - Should return user session or 401
- `https://track.gpslinkusa.com/api/server` - Should return server info
- `wss://track.gpslinkusa.com/api/socket` - WebSocket should connect
