// JSON Server middleware for validation and CORS
module.exports = (req, res, next) => {
  // Enable CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  // Handle DELETE requests for events
  if (req.method === 'DELETE' && req.url.includes('/events/')) {
    const eventId = req.url.split('/events/')[1];
    
    if (!eventId) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Event ID is required for deletion'
      });
    }

    // Check if event exists
    const fs = require('fs');
    const path = require('path');
    const dbPath = path.join(__dirname, 'db.json');
    
    try {
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      const eventExists = dbData.events.some(event => event.id === eventId);
      
      if (!eventExists) {
        return res.status(404).json({
          error: 'Not found',
          message: `Event with ID ${eventId} not found`
        });
      }

      // Remove event from database
      dbData.events = dbData.events.filter(event => event.id !== eventId);
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
      
      return res.status(200).json({
        message: 'Event deleted successfully',
        deletedEventId: eventId
      });
      
    } catch (error) {
      return res.status(500).json({
        error: 'Server error',
        message: 'Failed to delete event'
      });
    }
  }

  // Handle PUT requests for events
  if (req.method === 'PUT' && req.url.includes('/events/')) {
    const eventId = req.url.split('/events/')[1];
    const updatedEvent = req.body;
    
    if (!eventId) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Event ID is required for update'
      });
    }

    // Check if event exists and update it
    const fs = require('fs');
    const path = require('path');
    const dbPath = path.join(__dirname, 'db.json');
    
    try {
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      const eventIndex = dbData.events.findIndex(event => event.id === eventId);
      
      if (eventIndex === -1) {
        return res.status(404).json({
          error: 'Not found',
          message: `Event with ID ${eventId} not found`
        });
      }

      // Update the event
      updatedEvent.id = eventId; // Ensure ID is preserved
      updatedEvent.createdAt = dbData.events[eventIndex].createdAt; // Preserve original creation date
      updatedEvent.updatedAt = new Date().toISOString(); // Update timestamp
      updatedEvent.isLive = updatedEvent.status === 'live'; // Update live status
      
      dbData.events[eventIndex] = updatedEvent;
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
      
      return res.status(200).json(updatedEvent);
      
    } catch (error) {
      return res.status(500).json({
        error: 'Server error',
        message: 'Failed to update event'
      });
    }
  }

  // Add validation for POST/PUT requests
  if (req.method === 'POST' || req.method === 'PUT') {

    if (req.url.includes('/events')) {
      const event = req.body;
      
      // Validate required fields
      const requiredFields = ['title', 'description', 'sport', 'homeTeam', 'awayTeam', 'startTime', 'status', 'odds'];
      const missingFields = requiredFields.filter(field => !event[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          error: 'Validation failed',
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      // Validate sport type
      const validSports = ['football', 'basketball', 'tennis', 'volleyball'];
      if (!validSports.includes(event.sport)) {
        return res.status(400).json({
          error: 'Validation failed',
          message: `Invalid sport type. Must be one of: ${validSports.join(', ')}`
        });
      }

      // Validate status
      const validStatuses = ['upcoming', 'live', 'finished'];
      if (!validStatuses.includes(event.status)) {
        return res.status(400).json({
          error: 'Validation failed',
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }

      // Validate odds
      if (!event.odds || typeof event.odds !== 'object') {
        return res.status(400).json({
          error: 'Validation failed',
          message: 'Odds must be an object'
        });
      }

      // Validate odds values
      const odds = event.odds;
      if (odds.home < 1.01 || odds.home > 100) {
        return res.status(400).json({
          error: 'Validation failed',
          message: 'Home odds must be between 1.01 and 100'
        });
      }

      if (odds.away < 1.01 || odds.away > 100) {
        return res.status(400).json({
          error: 'Validation failed',
          message: 'Away odds must be between 1.01 and 100'
        });
      }

      if (odds.draw && (odds.draw < 1.01 || odds.draw > 100)) {
        return res.status(400).json({
          error: 'Validation failed',
          message: 'Draw odds must be between 1.01 and 100'
        });
      }

      // Validate string lengths
      if (event.title.length < 2 || event.title.length > 100) {
        return res.status(400).json({
          error: 'Validation failed',
          message: 'Title must be between 2 and 100 characters'
        });
      }

      if (event.description.length < 2 || event.description.length > 200) {
        return res.status(400).json({
          error: 'Validation failed',
          message: 'Description must be between 2 and 200 characters'
        });
      }

      if (event.homeTeam.length < 2 || event.homeTeam.length > 50) {
        return res.status(400).json({
          error: 'Validation failed',
          message: 'Home team name must be between 2 and 50 characters'
        });
      }

      if (event.awayTeam.length < 2 || event.awayTeam.length > 50) {
        return res.status(400).json({
          error: 'Validation failed',
          message: 'Away team name must be between 2 and 50 characters'
        });
      }

      // For POST requests (new events), add ID and timestamps
      if (req.method === 'POST' && req.url.includes('/events')) {
        // Generate unique ID
        const fs = require('fs');
        const path = require('path');
        const dbPath = path.join(__dirname, 'db.json');
        
        try {
          const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
          const existingIds = dbData.events.map(e => parseInt(e.id)).filter(id => !isNaN(id));
          const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
          event.id = (maxId + 1).toString();
        } catch (error) {
          event.id = Date.now().toString();
        }

        // Add timestamps
        event.createdAt = new Date().toISOString();
        event.updatedAt = new Date().toISOString();
        event.isLive = event.status === 'live';
      }


     
  }

  // Add timestamp to responses
  if (req.method === 'GET') {
    const originalSend = res.send;
    res.send = function(data) {
      const response = {
        data: JSON.parse(data),
        timestamp: new Date().toISOString(),
        status: 'success'
      };
      return originalSend.call(this, JSON.stringify(response));
    };
  }


  next();
}};
