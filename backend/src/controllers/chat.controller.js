const agentServiceClient = require('../services/agentServiceClient');

class ChatController {
  async handleMessage(req, res) {
    try {
      const { message } = req.body;
      const userId = req.user.id;
      
      // Get user preferences from database
      const userPrefs = await UserPreference.findOne({ userId });
      
      // Process through agent service
      const result = await agentServiceClient.processQuery(message, {
        userId,
        sessionId: req.session.id,
        preferences: userPrefs || {}
      });
      
      // Format response for frontend
      const response = {
        message: result.data.explanation || 'Here are your recommendations',
        recommendations: result.data.recommendations || [],
        pricing: result.data.pricing || {},
        availability: result.data.availability || {}
      };
      
      res.json({
        success: true,
        data: response
      });
      
    } catch (error) {
      console.error('Chat Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process your request'
      });
    }
  }
}