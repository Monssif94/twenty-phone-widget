# 📞 Twenty Phone Widget

Widget téléphonique WebRTC intégré pour Twenty CRM utilisant Twilio Voice SDK.

## ✨ Fonctionnalités

- 📱 **Appels WebRTC** directement depuis le navigateur
- 🔄 **Intégration Twenty CRM** native avec thème sombre
- 📲 **Appels entrants/sortants** avec gestion complète
- 🎛️ **Contrôles d'appel** : Mute, Hold, DTMF, Hangup
- 🎨 **Design System Twenty** parfaitement intégré
- 🔒 **Authentification sécurisée** avec tokens JWT
- 🌍 **Edge Location EU** (Dublin) pour latence optimale

## 🚀 Installation Rapide

### Prérequis

- Node.js 18+
- Compte Twilio avec Voice activé
- Instance Twenty CRM (optionnel)

### 1. Cloner le repository

```bash
git clone https://github.com/Monssif94/twenty-phone-widget.git
cd twenty-phone-widget
```

### 2. Installer les dépendances

```bash
# Frontend
npm install

# Token Server
cd server
npm install
cd ..
```

### 3. Configuration

Créer `.env.local` à partir du template :

```bash
cp .env.example .env.local
```

Éditer `.env.local` avec vos credentials Twilio :

```env
# Twilio Voice SDK Configuration
VITE_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_TWILIO_API_KEY_SID=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_TWILIO_API_KEY_SECRET=your-api-key-secret
VITE_TWILIO_TWIML_APP_SID=APxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_TWILIO_PHONE_NUMBER=+33100000000
VITE_TOKEN_SERVER_URL=http://localhost:3001

# Twenty CRM (optionnel)
VITE_TWENTY_API_TOKEN=your-twenty-api-token
```

### 4. Démarrer les serveurs

```bash
# Terminal 1 - Token Server (Port 3001)
cd server
npm start

# Terminal 2 - Widget Frontend (Port 3000)
npm run dev
```

### 5. Accéder au widget

Ouvrir http://localhost:3000 dans votre navigateur.

## 🏗️ Architecture

```
twenty-phone-widget/
├── src/
│   ├── modules/telephony/
│   │   ├── components/         # Composants React
│   │   ├── hooks/              # React Hooks
│   │   ├── services/           # Services métier
│   │   ├── theme/              # Thèmes Twenty CRM
│   │   └── types/              # TypeScript types
│   └── App.tsx
├── server/                     # Serveur de tokens
│   └── token-server.js
└── public/
    └── sounds/
```

## 🐳 Docker

```bash
# Build
docker-compose build

# Lancement
docker-compose up -d

# Logs
docker-compose logs -f
```

## 🚢 Déploiement

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour les instructions complètes.

```bash
# Déploiement automatique
chmod +x deploy.sh
./deploy.sh
```

## 🔒 Sécurité

- **Ne jamais** exposer l'API Key Secret côté client
- Utiliser HTTPS en production
- Implémenter l'authentification sur le token server
- Limiter les CORS aux domaines autorisés

## 📄 License

MIT

## 💬 Support

- [Issues GitHub](https://github.com/Monssif94/twenty-phone-widget/issues)
- [Documentation Twilio](https://www.twilio.com/docs/voice/sdks/javascript)
- [Twenty CRM](https://twenty.com)

---

**Développé avec ❤️ pour Twenty CRM**