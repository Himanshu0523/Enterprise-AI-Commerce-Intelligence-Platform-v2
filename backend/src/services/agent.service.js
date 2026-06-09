const axios = reqiure('axios');
const config = require('../config');


class AgentService {
    constructor() {
        this.baseUrl = config.agentServiceUrl;
        this.client = axios.create({
            baseURL: this.baseUrl,
            timeout: config.agentServiceTimeout,
            headers: {
                'Content-Type': 'application/json' ,
                'X-service': 'agent-service'
            }
        });

        this.client.interceptors.response.use(
            response => response,
            error => this.handleError(error)
        );
    }  

    async processQuery(userQuery , context = {}) {
        try {
            const response = await this.client.post(
                config.agentService.endpoints.processQuery,
                {
                    query: userQuery,
                    context: {
                        userId: context.userId || null,
                        sessionId: context.sessionId || null,
                        preferences: context.preferences || {},
                        timestamp: new Date().toISOString()
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Agent Services Error:', error.message);
            throw this.handleError(error);
        }
    }

    async getHealthStatus() {
        try {
            const response = await this.client.get(config.agentService.endpoints.health);
            return response.data;
        } catch (error) {
            console.error('Agent Services Error:', error.message);
            return { status: 'unhealthy', error: error.message };
        }
    }

    handleError(error) {
        if (error.response) {
            const { status, data } = error.response;
            throw new Error(`Agent Service Error: ${status} - ${data.message || 'Unknown error'}`);
        } else if (error.request) {
            throw new Error('Agent Service Error: No response received from the service');
        }
        throw new Error(`Agent Service Error: ${error.message}`);
    }
}

const agentService = new AgentService();

module.exports = agentService;