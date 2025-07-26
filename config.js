// Configuration file for the Creatio Deployment Portal

module.exports = {
    // Server configuration
    server: {
        port: process.env.PORT || 3000,
        cors: {
            origin: process.env.CORS_ORIGIN || '*'
        }
    },

    // Creatio Environment configuration
    creatioEnvironments: [
        {
            name: 'development',
            displayName: 'Development',
            url: process.env.CREATIO_DEV_URL || 'https://dev.yourcompany.creatio.com',
            login: process.env.CREATIO_DEV_LOGIN || 'admin@dev.creatio.com',
            environment: 'dev',
            description: 'Development environment for testing'
        },
        {
            name: 'test',
            displayName: 'Test/QA',
            url: process.env.CREATIO_TEST_URL || 'https://test.yourcompany.creatio.com',
            login: process.env.CREATIO_TEST_LOGIN || 'admin@test.creatio.com',
            environment: 'test',
            description: 'Test environment for QA validation'
        },
        {
            name: 'staging',
            displayName: 'Staging',
            url: process.env.CREATIO_STAGING_URL || 'https://staging.yourcompany.creatio.com',
            login: process.env.CREATIO_STAGING_LOGIN || 'admin@staging.creatio.com',
            environment: 'staging',
            description: 'Pre-production staging environment'
        },
        {
            name: 'production',
            displayName: 'Production',
            url: process.env.CREATIO_PROD_URL || 'https://yourcompany.creatio.com',
            login: process.env.CREATIO_PROD_LOGIN || 'admin@yourcompany.creatio.com',
            environment: 'prod',
            description: 'Live production environment'
        }
    ],

    // Clio command templates for Creatio
    clio: {
        // Base commands
        installAppCommand: 'clio install-app',
        pushPackageCommand: 'clio push-pkg',
        installPackageCommand: 'clio install-pkg',
        compilePackageCommand: 'clio compile-pkg',
        
        // Environment management
        registerEnvCommand: 'clio reg-web-app',
        listEnvCommand: 'clio show-web-app-list',
        
        // Package management
        listPackagesCommand: 'clio get-pkg-list',
        createPackageCommand: 'clio create-pkg',
        
        // Development commands
        generateCommand: 'clio generate',
        restartCommand: 'clio restart-web-app',
        
        // Timeout for commands in milliseconds
        commandTimeout: 300000 // 5 minutes
    },

    // Creatio-specific package types
    packageTypes: [
        {
            type: 'app',
            displayName: 'Application Package',
            description: 'Complete Creatio application with business logic',
            command: 'install-app'
        },
        {
            type: 'pkg',
            displayName: 'Custom Package',
            description: 'Custom development package',
            command: 'install-pkg'
        },
        {
            type: 'template',
            displayName: 'Template Package',
            description: 'Reusable template package',
            command: 'install-pkg'
        }
    ],

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
