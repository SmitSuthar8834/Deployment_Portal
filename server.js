require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const ClioHandler = require('./clio-handler');
const config = require('./config');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(__dirname));

// Initialize Clio handler
const clioHandler = new ClioHandler();

// Endpoint to get the list of packages
app.get('/packages', async (req, res) => {
  try {
    const packages = await clioHandler.getAvailablePackages();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

// Endpoint to get Creatio environments
app.get('/environments', (req, res) => {
  const environments = clioHandler.getCreatioEnvironments();
  res.json(environments);
});

// Endpoint to get package types
app.get('/package-types', (req, res) => {
  const packageTypes = clioHandler.getPackageTypes();
  res.json(packageTypes);
});

// Endpoint to register new Creatio environment
app.post('/environments', async (req, res) => {
  try {
    const { name, url, login, password } = req.body;
    
    if (!name || !url || !login) {
      return res.status(400).json({ error: 'Name, URL, and login are required' });
    }

    const result = await clioHandler.registerEnvironment({ name, url, login, password });
    
    if (result.success) {
      res.json({ message: result.message, environment: result.environment });
    } else {
      res.status(500).json({ error: result.message });
    }
  } catch (error) {
    console.error('Environment registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to trigger Clio commands
app.post('/deploy', async (req, res) => {
  try {
    const { selectedPackage, targetEnvironment, packageType } = req.body;
    
    if (!selectedPackage || !targetEnvironment) {
      return res.status(400).json({ error: 'Package and environment are required' });
    }

    console.log(`Deploying ${selectedPackage} (${packageType || 'app'}) to ${targetEnvironment} environment`);
    
    const result = await clioHandler.executeDeploy(selectedPackage, targetEnvironment, packageType);
    
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

