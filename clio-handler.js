const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const config = require('./config');

class ClioHandler {
    constructor() {
        this.deploymentHistory = [];
        // Dynamically configure environments using .env
        this.creatioEnvironments = [
            {
                name: 'development',
                displayName: 'Development',
                url: process.env.CREATIO_DEV_URL,
                login: process.env.CREATIO_DEV_LOGIN,
                password: process.env.CREATIO_DEV_PASSWORD,
                description: 'Development environment for testing'
            },
            {
                name: 'test',
                displayName: 'Test',
                url: process.env.CREATIO_TEST_URL,
                login: process.env.CREATIO_TEST_LOGIN,
                password: process.env.CREATIO_TEST_PASSWORD,
                description: 'Test environment for validations'
            },
            {
                name: 'staging',
                displayName: 'Staging',
                url: process.env.CREATIO_STAGING_URL,
                login: process.env.CREATIO_STAGING_LOGIN,
                password: process.env.CREATIO_STAGING_PASSWORD,
                description: 'Staging environment for pre-production'
            },
            {
                name: 'production',
                displayName: 'Production',
                url: process.env.CREATIO_PROD_URL,
                login: process.env.CREATIO_PROD_LOGIN,
                password: process.env.CREATIO_PROD_PASSWORD,
                description: 'Production environment'
            }
        ];

        // Mock data flag
        this.mockDataEnabled = process.env.MOCK_DATA_ENABLED === 'true';
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
                    command = `${config.clio.installAppCommand} ${packageName} -e ${envConfig.name}`;
                    break;
                case 'pkg':
                    command = `${config.clio.installPackageCommand} ${packageName} -e ${envConfig.name}`;
                    break;
                default:
                    command = `${config.clio.installAppCommand} ${packageName} -e ${envConfig.name}`;
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

    // Get available packages from all configured environments
    async getAvailablePackages() {
        try {
            if (this.mockDataEnabled) {
                // Return mock Creatio packages for demo
                return [
                    { 
                        name: 'CrtCustomerMgmt', 
                        version: '1.2.3', 
                        description: 'Creatio Customer Management Package',
                        type: 'pkg',
                        lastModified: '2024-01-15',
                        size: '2.4 MB'
                    },
                    { 
                        name: 'CrtOrderProcessing', 
                        version: '2.1.0', 
                        description: 'Order Processing Business Logic',
                        type: 'app',
                        lastModified: '2024-01-10',
                        size: '5.2 MB'
                    },
                    { 
                        name: 'CrtInventoryTracker', 
                        version: '1.5.7', 
                        description: 'Inventory Management System',
                        type: 'pkg',
                        lastModified: '2024-01-08',
                        size: '3.1 MB'
                    },
                    { 
                        name: 'CrtReportingTool', 
                        version: '3.0.1', 
                        description: 'Advanced Reporting Dashboard',
                        type: 'app',
                        lastModified: '2024-01-12',
                        size: '4.8 MB'
                    },
                    { 
                        name: 'CrtIntegrationPack', 
                        version: '1.0.5', 
                        description: 'Third-party Integration Package',
                        type: 'template',
                        lastModified: '2024-01-20',
                        size: '1.9 MB'
                    },
                    { 
                        name: 'CrtSalesAutomation', 
                        version: '2.3.1', 
                        description: 'Sales Process Automation',
                        type: 'app',
                        lastModified: '2024-01-18',
                        size: '6.7 MB'
                    },
                    { 
                        name: 'CrtMarketingCampaigns', 
                        version: '1.8.4', 
                        description: 'Marketing Campaign Management',
                        type: 'pkg',
                        lastModified: '2024-01-22',
                        size: '3.5 MB'
                    }
                ];
            } else {
                // Real implementation: Query packages from Creatio environments
                console.log('Fetching packages from Creatio environments...');
                
                // Example command: clio get-pkg-list
                // const { stdout } = await execAsync('clio get-pkg-list');
                // Parse the output and return structured data
                
                // For now, return empty array when not in mock mode
                // You would parse the actual Clio output here
                return [];
            }
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
            const { name, displayName, url, login, password, description } = envData;
            
            // Check if environment already exists
            const existingEnv = this.creatioEnvironments.find(env => env.name === name);
            if (existingEnv) {
                return {
                    success: false,
                    message: `Environment '${name}' already exists`,
                    error: 'Environment name conflict'
                };
            }
            
            // In real implementation:
            // const command = `${config.clio.registerEnvCommand} ${name} -u ${url} -l ${login} -p ${password}`;
            // const { stdout } = await execAsync(command);
            
            console.log(`Registering environment: ${name} (${displayName}) at ${url}`);
            
            // Add to runtime environments list
            const newEnv = {
                name: name,
                displayName: displayName || name,
                url: url,
                login: login,
                password: password,
                description: description || `${displayName} environment`
            };
            
            this.creatioEnvironments.push(newEnv);
            
            return {
                success: true,
                message: `Environment '${displayName}' registered successfully`,
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

    // Remove environment
    async removeEnvironment(envName) {
        try {
            const envIndex = this.creatioEnvironments.findIndex(env => env.name === envName);
            
            if (envIndex === -1) {
                return {
                    success: false,
                    message: `Environment '${envName}' not found`,
                    error: 'Environment not found'
                };
            }
            
            // Prevent removal of default environments from .env
            const defaultEnvs = ['development', 'test', 'staging', 'production'];
            if (defaultEnvs.includes(envName)) {
                return {
                    success: false,
                    message: `Cannot remove default environment '${envName}'. Please modify .env file instead.`,
                    error: 'Cannot remove default environment'
                };
            }
            
            // In real implementation:
            // const command = `${config.clio.removeEnvCommand} ${envName}`;
            // const { stdout } = await execAsync(command);
            
            console.log(`Removing environment: ${envName}`);
            
            // Remove from runtime environments list
            this.creatioEnvironments.splice(envIndex, 1);
            
            return {
                success: true,
                message: `Environment '${envName}' removed successfully`,
                environment: envName
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to remove environment: ${error.message}`,
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
