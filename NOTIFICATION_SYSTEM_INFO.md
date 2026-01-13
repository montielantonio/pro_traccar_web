# Activity Notification System - Detailed Information

## Overview
**Yes, activity notifications are enabled** in this Traccar GPS tracking project. The system uses multiple notification methods to alert users about device activities, events, and alarms.

## Notification Methods Supported

The project supports the following notification channels (notificators):

### 1. **Web Notifications** (`notificatorWeb`)
- **Type**: In-browser notifications
- **Implementation**: Real-time WebSocket-based notifications
- **Location**: `src/SocketController.jsx`
- **Features**:
  - Snackbar notifications (Material-UI)
  - Real-time event display
  - Sound alerts for selected events/alarms

### 2. **Email Notifications** (`notificatorMail`)
- **Type**: Email alerts
- **Configuration**: Backend server configuration required
- **Usage**: Configured via Settings → Notifications

### 3. **SMS Notifications** (`notificatorSms`)
- **Type**: Text message alerts
- **Configuration**: Backend server configuration required
- **Usage**: Configured via Settings → Notifications

### 4. **Push Notifications** (`notificatorFirebase`, `notificatorTraccar`)
- **Type**: Mobile push notifications
- **Implementation**: 
  - Firebase Cloud Messaging (FCM)
  - Traccar native push notifications
- **Location**: `src/common/components/NativeInterface.js`
- **Features**:
  - Token-based registration
  - Native app integration
  - Background notifications

### 5. **Telegram Notifications** (`notificatorTelegram`)
- **Type**: Telegram bot messages
- **Configuration**: Backend server configuration required
- **Usage**: Configured via Settings → Notifications

### 6. **Pushover Notifications** (`notificatorPushover`)
- **Type**: Pushover service alerts
- **Configuration**: Backend server configuration required
- **Usage**: Configured via Settings → Notifications

### 7. **Command Notifications** (`notificatorCommand`)
- **Type**: Execute device commands
- **Usage**: Triggers device commands when events occur
- **Configuration**: Requires command ID selection

## Real-Time Notification System

### WebSocket Connection
- **File**: `src/SocketController.jsx`
- **Protocol**: WebSocket (ws:// or wss://)
- **Endpoint**: `/api/socket`
- **Features**:
  - Real-time event streaming
  - Automatic reconnection (60-second intervals)
  - Connection status monitoring
  - Handles device updates, position updates, and events

### Event Handling
```javascript
// Events are received via WebSocket and processed in real-time
handleEvents(events) {
  // 1. Add events to Redux store
  // 2. Play sound if configured
  // 3. Display snackbar notifications
  // 4. Update events drawer
}
```

## Sound Notifications

### Configuration
- **Location**: Settings → Preferences → Events
- **Preferences**:
  - `soundEvents`: Comma-separated list of event types to play sound for
  - `soundAlarms`: Comma-separated list of alarm types to play sound for (default: 'sos')
- **Sound File**: `src/resources/alarm.mp3`
- **Implementation**: `src/SocketController.jsx` (lines 38-49)

### Default Behavior
- **Sound Alarms**: Defaults to 'sos' (SOS alarm)
- **Sound Events**: Empty by default (user configurable)
- **Trigger**: Plays when event type matches `soundEvents` OR when alarm type matches `soundAlarms`

## Notification Types

### Event Types Supported
The system can notify about various event types:
- **Alarm Events**: SOS, Vibration, Movement, Overspeed, Low Battery, etc.
- **Geofence Events**: Enter/Exit geofence
- **Device Events**: Online/Offline, Maintenance, etc.
- **Motion Events**: Hard acceleration, braking, cornering
- **And many more...**

### Notification Configuration
- **Location**: Settings → Notifications
- **File**: `src/settings/NotificationPage.jsx`
- **Features**:
  - Create/edit notification rules
  - Select event types
  - Choose notification channels
  - Configure for specific devices or all devices
  - Set calendar-based schedules
  - Priority settings

## UI Components

### 1. Events Drawer
- **File**: `src/main/EventsDrawer.jsx`
- **Location**: Right-side drawer on main map
- **Features**:
  - Lists all recent events
  - Click to view event details
  - Delete individual events
  - Clear all events

### 2. Snackbar Notifications
- **File**: `src/SocketController.jsx` (lines 179-191)
- **Type**: Material-UI Snackbar
- **Duration**: Long duration (configurable)
- **Display**: Shows event message from `event.attributes.message`

### 3. Events List Page
- **File**: `src/reports/EventReportPage.jsx`
- **Location**: Reports → Events
- **Features**: Full event history and filtering

## Notification Settings Pages

### 1. Notifications List
- **File**: `src/settings/NotificationsPage.jsx`
- **Route**: `/settings/notifications`
- **Features**:
  - View all notification rules
  - See notification types, channels, and devices
  - Edit/delete notification rules

### 2. Notification Editor
- **File**: `src/settings/NotificationPage.jsx`
- **Route**: `/settings/notification/:id?`
- **Features**:
  - Create/edit notification rules
  - Select event types
  - Choose notification channels (notificators)
  - Configure for all devices or specific devices
  - Test notification channels
  - Set calendar schedules
  - Priority settings

## User Preferences

### Sound Settings
- **Location**: Settings → Preferences → Events
- **File**: `src/settings/PreferencesPage.jsx` (lines 268-281)
- **Options**:
  - **Sound Events**: Select which event types trigger sound
  - **Sound Alarms**: Select which alarm types trigger sound

## Native App Integration

### Push Notification Tokens
- **File**: `src/common/components/NativeInterface.js`
- **Features**:
  - Registers notification tokens from native apps
  - Stores tokens in user attributes
  - Supports multiple tokens per user (keeps last 3)
  - Handles native notification clicks

## Backend Integration

### API Endpoints Used
- `/api/socket` - WebSocket connection for real-time events
- `/api/notifications` - CRUD operations for notification rules
- `/api/notifications/types` - Get available event types
- `/api/notifications/notificators` - Get available notification channels
- `/api/notifications/test/:notificator` - Test notification channel
- `/api/events/:id` - Get event details

## Current Status

✅ **Web Notifications**: Enabled and working
✅ **Sound Alerts**: Enabled (default: SOS alarm)
✅ **Real-time Events**: Enabled via WebSocket
✅ **Events Drawer**: Available
✅ **Notification Rules**: Configurable via Settings
✅ **Push Notifications**: Supported (requires backend config)
✅ **Email/SMS/Telegram**: Supported (requires backend config)

## Configuration Requirements

### Frontend (Already Configured)
- WebSocket connection ✅
- Sound notifications ✅
- UI components ✅
- User preferences ✅

### Backend (Server Configuration Required)
- Email server settings
- SMS gateway configuration
- Firebase/Google Cloud credentials for push
- Telegram bot token
- Pushover API key
- Other third-party service credentials

## How to Configure Notifications

1. **Go to**: Settings → Notifications
2. **Click**: "+" button to create new notification
3. **Select**:
   - Event type (alarm, geofence, etc.)
   - Notification channels (web, email, SMS, etc.)
   - Devices (all devices or specific)
4. **Test**: Use "Test Notificators" button
5. **Save**: Notification rule is created

## Sound Notification Configuration

1. **Go to**: Settings → Preferences
2. **Scroll to**: Events section
3. **Configure**:
   - **Sound Events**: Select event types (e.g., "alarm", "geofenceEnter")
   - **Sound Alarms**: Select alarm types (e.g., "sos", "overspeed")
4. **Save**: Preferences are saved automatically

## Summary

The notification system is **fully enabled** and functional for:
- ✅ Real-time web notifications (WebSocket)
- ✅ Sound alerts (configurable)
- ✅ Visual notifications (Snackbar, Events Drawer)
- ✅ Notification rules management
- ✅ Multiple notification channels (requires backend setup)

The frontend is ready and working. Additional notification methods (Email, SMS, Push, Telegram, etc.) require backend server configuration to function.
