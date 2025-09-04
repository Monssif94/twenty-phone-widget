# Twenty Phone Widget 📞

Widget téléphonique WebRTC intégré pour Twenty CRM utilisant Twilio SIP.

## 🚀 Fonctionnalités

- ✅ Appels sortants/entrants WebRTC
- 🎤 Contrôles d'appel (mute, hold, DTMF)
- 📊 Logging automatique dans Twenty CRM
- 🎨 Interface moderne et responsive
- 🔒 Configuration sécurisée des credentials

## 📋 Prérequis

- Node.js 20+
- Compte Twilio avec domaine SIP configuré
- Instance Twenty CRM avec API key

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/Monssif94/twenty-phone-widget.git
cd twenty-phone-widget

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your credentials
```

## ⚙️ Configuration

Créez un fichier `.env.local` avec :

```env
VITE_TWILIO_SIP_DOMAIN=your-domain.sip.twilio.com
VITE_TWILIO_SIP_USERNAME=your-username
VITE_TWILIO_SIP_PASSWORD=your-password
VITE_TWENTY_API_TOKEN=your-twenty-api-token
```

## 🚀 Développement

```bash
# Start dev server
npm run dev
# Open http://localhost:3000
```

## 📦 Build Production

```bash
npm run build
# Files in dist/ folder
```

## 🏗️ Architecture

```
src/modules/telephony/
├── components/         # React components
│   └── PhoneWidget/   # Main widget component
├── hooks/             # Custom React hooks
│   └── useTwilioPhone.ts
├── services/          # Business logic
│   └── TwilioService.ts
└── types/             # TypeScript types
```

## 🔧 Technologies

- React 19 + TypeScript
- JsSIP (WebRTC)
- Emotion (styled components)
- Vite (build tool)
- Twilio SIP

## 📱 Usage

Le widget apparaît automatiquement en bas à droite de l'écran :

1. Cliquez sur l'icône téléphone
2. Composez un numéro ou recevez un appel
3. Les appels sont automatiquement loggés dans Twenty CRM

## 🚀 Déploiement

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci --only=production
RUN npm run build
CMD ["npm", "run", "preview"]
```

### Nginx

```nginx
location / {
    root /var/www/twenty-widget/dist;
    try_files $uri /index.html;
}
```

## 🔒 Sécurité

- Ne jamais commiter `.env.local`
- Utiliser HTTPS en production
- Rotation régulière des API keys
- Firewall : ouvrir ports WSS (443) et RTP (10000-60000/UDP)

## 📝 License

MIT

## 👥 Contributeurs

- [@Monssif94](https://github.com/Monssif94)

---

**Production**: https://crm.autoformai.fr
**Staging**: https://staging-crm.autoformai.fr