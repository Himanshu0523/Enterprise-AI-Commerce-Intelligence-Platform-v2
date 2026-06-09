const express = require('express');
const router = express.Router();
const AgentService = require('../services/agent.service');


router.post('/process-query', async (req, res) => {
    try {
        const { query, context } = req.body;

        if(!query) {
            return res.status(400).json({ success: false, message: 'Query is required'});
        }
    

    const result = await AgentService.processQuery(query, {
        userId: context?.userId,
        sessionId: context?.sessionId,
        preferences: context?.preferences || {}
    });

    res.json({
        success: true,
        data: result
    });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'An error occurred while processing the query'
        });
    }
});