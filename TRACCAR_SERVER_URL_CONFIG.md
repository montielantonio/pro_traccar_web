# Traccar Server URL Configuration

## Problem
The error "Failed to construct 'URL': Invalid URL" occurs because:
1. The Traccar backend server doesn't know its public URL
2. Some code is trying to construct URLs with an empty or undefined `serverUrl`

## Solution

### 1. Configure Traccar Backend Public URL

The Traccar backend needs to know its public URL. This is configured in the Traccar server configuration file.

#### Location
The configuration file is typically located at:
- Linux: `/opt/traccar/conf/traccar.xml`
- Windows: `C:\Program Files\Traccar\conf\traccar.xml`

#### Configuration
Add or update the `<entry key='web.url'>` setting in your `traccar.xml`:

```xml
<entry key='web.url'>https://track.gpslinkusa.com</entry>
```

#### Full Example Configuration
```xml
<?xml version='1.0' encoding='UTF-8'?>
<!DOCTYPE properties SYSTEM 'http://java.sun.com/dtd/properties.dtd'>
<properties>
    <!-- ... other settings ... -->
    
    <!-- Public URL for the web interface -->
    <entry key='web.url'>https://track.gpslinkusa.com</entry>
    
    <!-- ... other settings ... -->
</properties>
```

### 2. Restart Traccar Server

After updating the configuration:

**Linux:**
```bash
sudo systemctl restart traccar
```

**Windows:**
- Restart the Traccar service from Services manager
- Or restart the Traccar application

### 3. Verify Configuration

1. Check that `/api/server` endpoint returns the correct URL:
   ```bash
   curl https://track.gpslinkusa.com/api/server
   ```

2. The response should include a `url` field with your public URL.

### 4. Frontend Fix

The frontend code has been updated to:
- Use `window.location.origin` as a fallback when `serverUrl` is empty
- Safely construct URLs even when the server URL is not configured

### 5. Clear Browser Cache

After making changes:
1. Clear your browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. If using a service worker, unregister it and reload

## Additional Notes

- The `web.url` setting tells Traccar what URL to use when generating links or absolute URLs
- This is especially important for:
  - Email notifications
  - Share links
  - API responses that include URLs
  - Service worker registration

## Troubleshooting

If the error persists:

1. **Check Nginx Configuration**: Ensure Nginx is correctly proxying `/api` requests
2. **Check Traccar Logs**: Look for errors in Traccar server logs
3. **Verify SSL**: Ensure SSL certificates are valid
4. **Check Browser Console**: Look for specific error messages

## Related Files

- Frontend URL helper: `src/common/util/urlHelper.js`
- Fetch utility: `src/common/util/fetchOrThrow.js`
- Nginx config guide: `NGINX_CONFIG_FIX.md`
