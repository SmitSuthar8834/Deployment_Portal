# Deployment Portal

A simple Node.js web application that provides a GUI-based self-service deployment portal for Clio commands.

## Features

- 🎯 **Package Selection**: Choose from available packages with version information
- 🌍 **Environment Selection**: Deploy to development, staging, or production environments
- 🚀 **One-Click Deployment**: Trigger Clio commands through a simple web interface
- 📊 **Deployment History**: Track all deployment activities
- 📈 **Environment Status**: Check the health of target environments

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

3. **Access the Portal**
   Open your browser and navigate to: `http://localhost:3000`

## Project Structure

```
deployment-portal/
├── server.js          # Main Express server
├── clio-handler.js    # Clio command execution logic
├── index.html         # Frontend web interface
├── package.json       # Node.js dependencies
└── README.md         # This file
```

## API Endpoints

- `GET /packages` - Get list of available packages
- `GET /environments` - Get list of target environments
- `POST /deploy` - Trigger deployment
- `GET /history` - Get deployment history
- `GET /status/:environment` - Check environment status

## Customization

### Adding Real Clio Commands

Edit `clio-handler.js` and uncomment the actual command execution lines:

```javascript
// Replace this simulation:
const stdout = `Successfully deployed ${packageName} to ${environment}`;

// With actual command execution:
const { stdout, stderr } = await execAsync(command);
```

### Configuring Packages

Update the `getAvailablePackages()` method in `clio-handler.js` to fetch from your actual package repository.

### Environment Configuration

Modify the `environments` array in `server.js` to match your deployment environments.

## Usage

1. **Select Package**: Choose from the dropdown list of available packages
2. **Select Environment**: Choose your target deployment environment
3. **Deploy**: Click the "Deploy Package" button to trigger the deployment
4. **Monitor**: Watch the deployment status and results in real-time

## Security Considerations

- This demo uses simulated commands for safety
- In production, implement proper authentication and authorization
- Validate all inputs and sanitize commands
- Use environment variables for sensitive configuration
- Consider rate limiting for deployment endpoints

## Example Clio Commands

The application is configured to execute commands like:

```bash
clio install-app CustomerApp -e dev
clio install-app OrderSystem -e prod
```

Customize these commands in `clio-handler.js` to match your Clio setup.

## Troubleshooting

- **Port 3000 in use**: Change the PORT variable in `server.js`
- **Packages not loading**: Check your Clio installation and package list
- **Deployment failures**: Verify Clio commands and environment access
