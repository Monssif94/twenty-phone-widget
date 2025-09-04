/**
 * Twilio Access Token Server
 * Generates access tokens for Twilio Voice SDK
 */

const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config({ path: '../.env.local' });

const app = express();
const PORT = 3001;

// Twilio credentials from environment
const ACCOUNT_SID = process.env.VITE_TWILIO_ACCOUNT_SID;
const API_KEY_SID = process.env.VITE_TWILIO_API_KEY_SID;
const API_KEY_SECRET = process.env.VITE_TWILIO_API_KEY_SECRET;
const TWIML_APP_SID = process.env.VITE_TWILIO_TWIML_APP_SID;
const PHONE_NUMBER = process.env.VITE_TWILIO_PHONE_NUMBER;

// Validate credentials
if (!ACCOUNT_SID || !API_KEY_SID || !API_KEY_SECRET || !TWIML_APP_SID) {
  console.error('Missing required Twilio credentials!');
  console.error('Please check your .env.local file');
  process.exit(1);
}

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'Twilio Token Server',
    timestamp: new Date().toISOString()
  });
});

// Generate access token endpoint
app.post('/token', (req, res) => {
  try {
    // Get identity from request or generate one
    const identity = req.body.identity || `user-${Date.now()}`;
    
    console.log(`Generating token for identity: ${identity}`);
    
    // Create access token
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;
    
    // Create new access token
    const accessToken = new AccessToken(
      ACCOUNT_SID,
      API_KEY_SID,
      API_KEY_SECRET,
      {
        identity: identity,
        ttl: 3600 // Token valid for 1 hour
      }
    );
    
    // Create Voice grant for outgoing calls
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: TWIML_APP_SID,
      incomingAllow: true // Allow incoming calls
    });
    
    // Add grant to token
    accessToken.addGrant(voiceGrant);
    
    // Generate the token
    const token = accessToken.toJwt();
    
    console.log(`Token generated successfully for ${identity}`);
    
    res.json({
      success: true,
      token: token,
      identity: identity,
      phoneNumber: PHONE_NUMBER
    });
    
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate access token',
      message: error.message
    });
  }
});

// Get Twilio capabilities endpoint
app.get('/capabilities', (req, res) => {
  res.json({
    accountSid: ACCOUNT_SID,
    phoneNumber: PHONE_NUMBER,
    twimlAppSid: TWIML_APP_SID,
    features: {
      outgoingCalls: true,
      incomingCalls: true,
      sms: false,
      voicemail: false
    }
  });
});

// TwiML endpoint for handling outgoing calls
app.post('/twiml/voice', (req, res) => {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();
  
  const to = req.body.To;
  const from = PHONE_NUMBER;
  
  console.log(`Handling outgoing call from ${from} to ${to}`);
  
  if (to) {
    // Create dial with caller ID
    const dial = response.dial({
      callerId: from,
      timeout: 30,
      action: '/twiml/voice/status',
      method: 'POST'
    });
    
    // Check if it's a client call or phone number
    if (to.startsWith('client:')) {
      dial.client(to.replace('client:', ''));
    } else {
      dial.number(to);
    }
  } else {
    response.say('Numéro de téléphone invalide.', { language: 'fr-FR' });
  }
  
  res.type('text/xml');
  res.send(response.toString());
});

// Call status callback
app.post('/twiml/voice/status', (req, res) => {
  console.log('Call status:', {
    CallSid: req.body.CallSid,
    CallStatus: req.body.CallStatus,
    CallDuration: req.body.CallDuration,
    From: req.body.From,
    To: req.body.To
  });
  
  res.sendStatus(200);
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   Twilio Token Server Started         ║
║                                       ║
║   Port: ${PORT}                          ║
║   URL: http://localhost:${PORT}          ║
║                                       ║
║   Endpoints:                          ║
║   POST /token - Generate access token ║
║   GET /capabilities - Get features    ║
║   POST /twiml/voice - Handle calls    ║
║                                       ║
║   Status: ✅ Ready                    ║
║   Phone: ${PHONE_NUMBER}              ║
╚═══════════════════════════════════════╝
  `);
});