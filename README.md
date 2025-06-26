# Custom Load Balancer

A Node.js-based custom load balancer implementation that distributes incoming HTTP requests across multiple backend servers using a round-robin algorithm with health monitoring capabilities.

## 🚀 Features

- **Round-Robin Load Balancing**: Distributes requests evenly across available servers
- **Health Monitoring**: Automatic health checks every 10 seconds
- **Fault Tolerance**: Automatically removes unhealthy servers from rotation
- **Auto-Recovery**: Automatically adds recovered servers back to the pool
- **Zero Downtime**: Continues serving requests even when some servers fail

## 📋 Architecture

The load balancer consists of several key components:

### Core Components

1. **Load Balancer (`index.js`)**: Main application that receives requests and forwards them to backend servers
2. **Server List (`serverList.js`)**: Configuration file containing the list of backend servers
3. **Test Servers (`testServers.js`)**: Sample backend servers for testing the load balancer

### Load Balancing Algorithm

- **Round-Robin**: Requests are distributed in a circular fashion across all healthy servers
- **Failover**: If a server fails, the request is automatically retried with the next server in rotation

### Health Monitoring

- **Active Health Checks**: Every 10 seconds, the load balancer checks the health of:
  - Current servers in rotation
  - Previously failed servers (for auto-recovery)
- **Automatic Removal**: Unhealthy servers are immediately removed from the active pool
- **Automatic Recovery**: Failed servers are automatically re-added when they become healthy

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Custom-Load-Balancer
```

2. Install dependencies:
```bash
npm install
```

## 🏃‍♂️ Usage

### Step 1: Start Backend Servers

Start multiple test servers on different ports:

```bash
# Terminal 1 - Start server on port 8000
PORT=8000 node testServers.js

# Terminal 2 - Start server on port 8001
PORT=8001 node testServers.js

# Terminal 3 - Start server on port 8002
PORT=8002 node testServers.js
```

### Step 2: Configure Server List

Update `serverList.js` if needed to match your server configuration:

```javascript
const serverList = [
    "http://localhost:8000",
    "http://localhost:8001",
    "http://localhost:8002"
]
```

### Step 3: Start Load Balancer

```bash
# Start the load balancer (runs on port 80)
sudo node index.js
```

*Note: Port 80 requires sudo privileges on most systems*

### Step 4: Test the Load Balancer

Make requests to the load balancer:

```bash
curl http://localhost
# or visit http://localhost in your browser
```

You'll see responses from different backend servers in round-robin fashion:
- `Response from the PORT: 8000`
- `Response from the PORT: 8001`
- `Response from the PORT: 8002`

## 🔧 Configuration

### Changing Load Balancer Port

Edit `index.js` line 8 to change the load balancer port:

```javascript
app.listen(3000, function (err) {  // Changed from 80 to 3000
```

### Adding/Removing Backend Servers

Update the `serverList.js` file:

```javascript
const serverList = [
    "http://localhost:8000",
    "http://localhost:8001",
    "http://localhost:8002",
    "http://localhost:8003",  // Add new server
    // Remove servers by deleting lines
]
```

### Health Check Interval

Modify the health check interval in `index.js`:

```javascript
setInterval(() => {
    healthCheckCurrentServer();
    healthCheckDownServers();
}, 5000);  // Changed from 10000ms to 5000ms (5 seconds)
```

## 🔍 How It Works

### Request Flow

1. **Incoming Request**: Client sends HTTP request to load balancer
2. **Server Selection**: Load balancer selects next server using round-robin algorithm
3. **Request Forwarding**: Request is forwarded to selected backend server
4. **Response Handling**: Backend server response is returned to client
5. **Error Handling**: If server fails, request is automatically retried with next available server

### Health Monitoring Flow

1. **Periodic Checks**: Every 10 seconds, health checks are performed
2. **Current Server Check**: Verifies health of servers currently in rotation
3. **Failed Server Recovery**: Checks if previously failed servers have recovered
4. **Pool Management**: Updates the active server pool based on health status

### Fault Tolerance

- **Immediate Failover**: Failed requests are instantly retried with next server
- **Server Removal**: Unhealthy servers are removed from rotation pool
- **Graceful Degradation**: System continues operating with remaining healthy servers
- **Auto Recovery**: Servers are automatically re-added when they recover

## 📊 Monitoring

The load balancer provides console logging for:

- Server health status
- Request routing information
- Server failures and recoveries
- Active server pool changes

Example logs:
```
Server listening on Port 80
Running health check for http://localhost:8000
server http://localhost:8000 is healthy
running http://localhost:8001
health of server http://localhost:8002 failed
adding server http://localhost:8002 back in serverList
```

## 🚨 Common Issues

### Port 80 Permission Denied
```bash
# Use sudo or change to a different port (e.g., 3000)
sudo node index.js
```

### Backend Servers Not Starting
```bash
# Make sure ports are not already in use
lsof -i :8000
# Kill existing processes if needed
kill -9 <PID>
```

### Load Balancer Can't Connect to Servers
- Verify backend servers are running
- Check server URLs in `serverList.js`
- Ensure no firewall blocking connections

## 🛡️ Production Considerations

For production deployment, consider:

- **HTTPS Support**: Add SSL/TLS termination
- **Configuration Management**: Use environment variables for configuration
- **Logging**: Implement structured logging with log levels
- **Metrics**: Add performance and health metrics
- **Security**: Implement rate limiting and security headers
- **Scalability**: Consider using PM2 or Docker for process management

## 📝 Dependencies

- **express**: Web framework for the load balancer
- **axios**: HTTP client for making requests to backend servers
- **nodemon**: Development dependency for auto-restarting during development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC License - see package.json for details
