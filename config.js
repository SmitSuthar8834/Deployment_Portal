// Configuration file for the Deployment Portal

module.exports = {
    // Server configuration
    server: {
        port: process.env.PORT || 3000,
        cors: {
            origin: process.env.CORS_ORIGIN || '*'
        }
    },

    // Environment configuration
    environments: [
        {
            name: 'development',
            displayName: 'Development',
            command_suffix: '-e dev'
        },
        {
            name: 'staging', 
            displayName: 'Staging',
            command_suffix: '-e stage'
        },
        {
            name: 'production',
            displayName: 'Production', 
            command_suffix: '-e prod'
        }
    ],

    // Clio command templates
    clio: {
        // Base command for installation
        installCommand: 'clio install-app',
        
        // Command to list packages (customize based on your Clio setup)
        listPackagesCommand: 'clio get-pkg-list',
        
        // Command to check environment status
        statusCommand: 'clio get-env-info',
        
        // Timeout for commands in milliseconds
        commandTimeout: 300000 // 5 minutes
    },

    // Mock data for demo purposes
    mockData: {
        enabled: true, // Set to false to use real Clio commands
        packages: [
            { 
                name: 'CustomerApp', 
                version: '1.2.3', 
                description: 'Customer management application',
                lastModified: '2024-01-15'
            },
            { 
                name: 'OrderSystem', 
                version: '2.1.0', 
                description: 'Order processing system',
                lastModified: '2024-01-10'
            },
            { 
                name: 'InventoryTracker', 
                version: '1.5.7', 
                description: 'Inventory management tracker',
                lastModified: '2024-01-08'
            },
            { 
                name: 'ReportingTool', 
                version: '3.0.1', 
                description: 'Business reporting tool',
                lastModified: '2024-01-12'
            }
        ]
    },

    // Security settings
    security: {
        // Enable authentication (implement as needed)
        enableAuth: false,
        
        // Rate limiting
        rateLimit: {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 10 // limit each IP to 10 requests per windowMs
        },
        
        // Allowed environments for deployment
        allowedEnvironments: ['development', 'staging', 'production']
    },

    // Logging configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        enableConsole: true,
        enableFile: false,
        filename: 'deployment.log'
    }
};
