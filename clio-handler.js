const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const config = require('./config');

class ClioHandler {
    constructor() {
        this.deploymentHistory = [];
        this.creatioEnvironments = config.creatioEnvironments;
    }

    // Execute Clio command for deployment
    async executeDeploy(packageName, environment, packageType = 'app') {
        try {
            // Find the Creatio environment configuration
            const envConfig = this.creatioEnvironments.find(env => env.name === environment);
            if (!envConfig) {
                throw new Error(`Unknown environment: ${environment}`);
            }

            // Build command based on package type
            let command;
            switch (packageType) {
                case 'app':
                    command = `${config.clio.installAppCommand} ${packageName} -e ${envConfig.environment}`;
                    break;
                case 'pkg':
                    command = `${config.clio.installPackageCommand} ${packageName} -e ${envConfig.environment}`;
                    break;
                default:
                    command = `${config.clio.installAppCommand} ${packageName} -e ${envConfig.environment}`;
            }

            console.log(`Executing: ${command}`);
            console.log(`Target URL: ${envConfig.url}`);
            console.log(`Environment: ${envConfig.displayName}`);
            
            // For demo purposes, we'll simulate the command
            // In real implementation, uncomment the line below:
            // const { stdout, stderr } = await execAsync(command, { timeout: config.clio.commandTimeout });
            
            // Simulated response with Creatio-specific details
            const stdout = `Successfully deployed ${packageName} to ${envConfig.displayName} (${envConfig.url})\nPackage Type: ${packageType}\nCommand: ${command}`;
            const stderr = '';

            // Log deployment
            this.deploymentHistory.push({
                package: packageName,
                environment: environment,
                timestamp: new Date().toISOString(),
                status: 'success',
                command: command,
                output: stdout
            });

            return {
                success: true,
                message: `Deployment completed successfully`,
                output: stdout,
                command: command
            };

        } catch (error) {
            // Log failed deployment
            this.deploymentHistory.push({
                package: packageName,
                environment: environment,
                timestamp: new Date().toISOString(),
                status: 'failed',
                error: error.message
            });

            return {
                success: false,
                message: `Deployment failed: ${error.message}`,
                error: error.message
            };
        }
    }

    // Get available packages (this could query your Clio setup)
    async getAvailablePackages() {
        try {
            // In real implementation, you might run: clio get-pkg-list
            // For demo, return mock Creatio packages
            return [
                { 
                    name: 'CrtCustomerMgmt', 
                    version: '1.2.3', 
                    description: 'Creatio Customer Management Package',
                    type: 'pkg',
                    lastModified: '2024-01-15'
                },
                { 
                    name: 'CrtOrderProcessing', 
                    version: '2.1.0', 
                    description: 'Order Processing Business Logic',
                    type: 'app',
                    lastModified: '2024-01-10'
                },
                { 
                    name: 'CrtInventoryTracker', 
                    version: '1.5.7', 
                    description: 'Inventory Management System',
                    type: 'pkg',
                    lastModified: '2024-01-08'
                },
                { 
                    name: 'CrtReportingTool', 
                    version: '3.0.1', 
                    description: 'Advanced Reporting Dashboard',
                    type: 'app',
                    lastModified: '2024-01-12'
                },
                { 
                    name: 'CrtIntegrationPack', 
                    version: '1.0.5', 
                    description: 'Third-party Integration Package',
                    type: 'template',
                    lastModified: '2024-01-20'
                }
            ];
        } catch (error) {
            console.error('Error fetching packages:', error);
            return [];
        }
    }

    // Get Creatio environments dynamically
    getCreatioEnvironments() {
        return this.creatioEnvironments.map(env => ({
            name: env.name,
            displayName: env.displayName,
            description: env.description,
            url: env.url
        }));
    }

    // Register new Creatio environment
    async registerEnvironment(envData) {
        try {
            const { name, url, login, password } = envData;
            
            // In real implementation:
            // const command = `${config.clio.registerEnvCommand} ${name} -u ${url} -l ${login} -p ${password}`;
            // const { stdout } = await execAsync(command);
            
            console.log(`Registering environment: ${name} at ${url}`);
            
            return {
                success: true,
                message: `Environment ${name} registered successfully`,
                environment: name
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to register environment: ${error.message}`,
                error: error.message
            };
        }
    }

    // Get package types
    getPackageTypes() {
        return config.packageTypes;
    }

    // Get deployment history
    getDeploymentHistory() {
        return this.deploymentHistory.slice().reverse(); // Return newest first
    }

    // Check environment status
    async checkEnvironmentStatus(environment) {
        try {
            // Example command to check environment
            // const { stdout } = await execAsync(`clio get-env-info -e ${environment}`);
            
            // Simulated response
            return {
                environment: environment,
                status: 'healthy',
                lastDeployment: new Date(Date.now() - Math.random() * 86400000).toISOString(),
                activePackages: Math.floor(Math.random() * 10) + 1
            };
        } catch (error) {
            return {
                environment: environment,
                status: 'error',
                error: error.message
            };
        }
    }
}

module.exports = ClioHandler;
