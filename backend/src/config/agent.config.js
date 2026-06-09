module.exports = {
    agentServices : {
        // Services URLs
        baseUrl : process.env.AGENT_SERVICE_URL || "http://localhost:8000",

        // API Endpoints
        endpoints : {
            createAgent : "/agents",
            getAgent : "/agents/:id",
            updateAgent : "/agents/:id",
            deleteAgent : "/agents/:id"
        },

        // Timeout settings
        timeout : 5000, // 5 seconds

        // Retry settings
        retry : {
            maxAttempts : 3,
            backoff : 'exponential',
            initialDelay : 1000,// 1 second
        } , 

        // Agents - specific settings
        agents: {
            customer: {
                model: 'llama-3',
                maxTokens: 500,
                temperature: 0.3
            },
            recommendation: {
                maxResults: 10,
                confidenceThreshold: 0.7
            },
            pricing: {
                currency: 'INR',
                includeTaxes: true
            }
        }
    }
};