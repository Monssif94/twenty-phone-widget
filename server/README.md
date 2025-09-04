# Token Server for Twenty Phone Widget

This server generates Twilio Access Tokens for the Voice SDK.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `../.env.local`:
```env
VITE_TWILIO_ACCOUNT_SID=your-account-sid
VITE_TWILIO_API_KEY_SID=your-api-key-sid
VITE_TWILIO_API_KEY_SECRET=your-api-key-secret
VITE_TWILIO_TWIML_APP_SID=your-twiml-app-sid
VITE_TWILIO_PHONE_NUMBER=your-phone-number
```

3. Start the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

## Endpoints

- `POST /token` - Generate access token
- `GET /capabilities` - Get Twilio capabilities
- `POST /twiml/voice` - Handle outgoing calls
- `GET /health` - Health check

## Security

⚠️ **NEVER expose your API Key Secret to the client!**

This server must run in a secure environment and should implement:
- CORS restrictions
- Rate limiting
- Authentication (in production)
- HTTPS only (in production)

## Production Deployment

For production, consider:
1. Using environment variables from a secure vault
2. Implementing user authentication
3. Adding rate limiting
4. Using HTTPS with valid certificates
5. Implementing token refresh logic