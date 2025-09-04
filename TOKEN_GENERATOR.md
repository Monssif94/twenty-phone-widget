# 🔑 Twilio Access Token Generator

## Problème identifié
**JsSIP ne fonctionne PAS avec Twilio** car Twilio ne supporte pas SIP over WebSocket publiquement.

## Solution : Twilio Voice SDK
Utiliser le SDK officiel **@twilio/voice-sdk** qui nécessite un Access Token généré côté serveur.

## Code du serveur pour générer les tokens

Créez ce endpoint sur votre serveur (Node.js/Express) ou N8N :

```javascript
// Installer les dépendances
// npm install twilio dotenv

const twilio = require('twilio');

// Configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID; // ACxxxx...
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your auth token
const apiKey = process.env.TWILIO_API_KEY; // SKxxxx...
const apiSecret = process.env.TWILIO_API_SECRET; // Your API secret
const twimlAppSid = process.env.TWILIO_APP_SID; // APxxxx...

// Endpoint pour générer le token
app.post('/api/twilio/token', (req, res) => {
  const identity = req.body.identity || 'agent1';
  
  // Create access token
  const AccessToken = twilio.jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;

  const token = new AccessToken(
    accountSid,
    apiKey,
    apiSecret,
    {
      identity: identity,
      ttl: 3600 // 1 hour
    }
  );

  // Create voice grant
  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: twimlAppSid,
    incomingAllow: true
  });

  // Add grant to token
  token.addGrant(voiceGrant);

  res.json({
    token: token.toJwt(),
    identity: identity
  });
});
```

## Configuration N8N Webhook

Si vous utilisez N8N à https://workflows.autoformai.fr :

1. Créer un workflow "Generate Twilio Token"
2. Ajouter un node Webhook (POST)
3. Ajouter un node Function avec le code ci-dessus
4. Retourner le token en JSON

## Étapes pour configurer Twilio Console

### 1. Créer une API Key
```bash
# Via CLI
twilio api:core:keys:create --friendly-name "Twenty Widget Key"

# Ou dans la console
# https://console.twilio.com/console/project/api-keys
```

### 2. Créer une TwiML App
```bash
# Via CLI
twilio api:core:applications:create \
  --friendly-name "Twenty Phone Widget" \
  --voice-url "https://workflows.autoformai.fr/webhook/twiml-handler" \
  --voice-method POST

# Ou dans la console
# https://console.twilio.com/console/voice/twiml/apps
```

### 3. Configuration TwiML pour les appels sortants

Créer un webhook qui retourne ce TwiML :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="+33159130001">
    {{To}}
  </Dial>
</Response>
```

## Utilisation dans le widget

```javascript
// Dans le composant React
const getAccessToken = async () => {
  const response = await fetch('https://workflows.autoformai.fr/webhook/twilio-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: 'agent1' })
  });
  const data = await response.json();
  return data.token;
};

// Initialiser le service
const token = await getAccessToken();
await twilioService.initialize(token);
```

## Variables d'environnement nécessaires

```env
# Plus besoin de SIP domain !
VITE_TWILIO_TOKEN_URL=https://workflows.autoformai.fr/webhook/twilio-token
VITE_TWILIO_PHONE_NUMBER=+33159130001
VITE_TWENTY_API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Commandes utiles

```bash
# Créer API Key
twilio api:core:keys:create --friendly-name "Widget Key"

# Lister les TwiML Apps
twilio api:core:applications:list

# Tester un token
twilio api:core:accounts:fetch --auth-token [generated-token]
```

## Ressources
- [Twilio Voice SDK Documentation](https://www.twilio.com/docs/voice/sdks/javascript)
- [Access Tokens](https://www.twilio.com/docs/iam/access-tokens)
- [TwiML Apps](https://www.twilio.com/docs/voice/api/applications)