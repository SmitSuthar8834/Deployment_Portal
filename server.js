const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const ClioHandler = require('./clio-handler');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(__dirname));

// Initialize Clio handler
const clioHandler = new ClioHandler();

// Available environments
const environments = ['development', 'staging', 'production'];

// Endpoint to get the list of packages
app.get('/packages', async (req, res) => {
  try {
    const packages = await clioHandler.getAvailablePackages();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

// Endpoint to get the list of environments
app.get('/environments', (req, res) => {
  res.json(environments);
});

// Endpoint to trigger Clio commands
app.post('/deploy', async (req, res) => {
  try {
    const { selectedPackage, targetEnvironment } = req.body;
    
    if (!selectedPackage || !targetEnvironment) {
      return res.status(400).json({ error: 'Package and environment are required' });
    }

    console.log(`Deploying ${selectedPackage} to ${targetEnvironment} environment`);
    
    const result = await clioHandler.executeDeploy(selectedPackage, targetEnvironment);
    
    if (result.success) {
      res.json({
        message: result.message,
        output: result.output,
        command: result.command
      });
    } else {
      res.status(500).json({
        error: result.message,
        details: result.error
      });
    }
  } catch (error) {
    console.error('Deployment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get deployment history
app.get('/history', (req, res) => {
  const history = clioHandler.getDeploymentHistory();
  res.json(history);
});

// Endpoint to check environment status
app.get('/status/:environment', async (req, res) => {
  try {
    const { environment } = req.params;
    const status = await clioHandler.checkEnvironmentStatus(environment);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check environment status' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

