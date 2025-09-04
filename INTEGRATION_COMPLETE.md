# 🎉 Widget Téléphonique Twenty CRM - Intégration Complète

## ✅ Status: FONCTIONNEL

Le widget téléphonique est maintenant pleinement intégré avec Twilio Voice SDK et Twenty CRM.

## 🚀 Configuration Active

### Credentials Twilio
- **Account SID:** [Configuré dans .env.local]
- **API Key:** [Configuré dans .env.local]
- **TwiML App:** [Configuré dans .env.local]
- **Numéro Principal:** +33159130001
- **Edge Location:** Dublin (EU_IRELAND)

### Serveurs en Cours d'Exécution
1. **Widget Frontend:** http://localhost:3000
2. **Token Server:** http://localhost:3001

## 📱 Fonctionnalités Disponibles

### Appels Sortants ✅
- Cliquez sur l'icône téléphone en bas à droite
- Entrez un numéro (format: 0612345678 ou +33612345678)
- Cliquez sur "Appeler"

### Appels Entrants ✅
- Les appels vers +33159130001 sont routés vers le widget
- Une popup apparaît pour répondre ou rejeter

### Contrôles d'Appel ✅
- **Mute/Unmute:** Couper/réactiver le micro
- **Hold:** Mettre en attente
- **DTMF:** Clavier numérique pendant l'appel
- **Hangup:** Raccrocher

## 🎨 Design System Twenty CRM

### Version Sombre Active
Le widget utilise le thème sombre de Twenty CRM avec :
- Fond: #171717 (gray85)
- Texte: #ebebeb (gray20)
- Accent: #5e90f2 (blue)
- Bordures subtiles: #222222 (gray70)

## 🔧 Architecture Technique

### Frontend (React + Vite)
```
src/modules/telephony/
├── components/
│   └── PhoneWidget/
│       └── PhoneWidgetTwentyDark.tsx  # Widget avec thème sombre
├── hooks/
│   └── useTwilioVoice.ts              # Hook React pour Twilio
├── services/
│   └── TwilioVoiceService.ts          # Service Twilio Voice SDK
└── theme/
    └── twentyDarkTheme.ts              # Thème Twenty CRM
```

### Backend (Node.js + Express)
```
server/
└── token-server.js                     # Génération d'access tokens
```

## 📋 Pour Tester

1. **Vérifier les serveurs:**
   - Frontend: http://localhost:3000
   - Token Server: http://localhost:3001/health

2. **Passer un appel test:**
   - Ouvrez le widget (icône téléphone)
   - Entrez votre numéro mobile
   - Cliquez sur "Appeler"

3. **Recevoir un appel:**
   - Appelez le +33159130001
   - Le widget affichera l'appel entrant

## 🐛 Debugging

### Logs Frontend (Console Browser)
- Device registered = Connexion OK
- Making call to = Appel sortant
- Incoming call = Appel entrant

### Logs Token Server
```bash
# Voir les logs du serveur
curl http://localhost:3001/health
```

## 📦 Déploiement Production

1. **Variables d'environnement à configurer:**
   - VITE_TOKEN_SERVER_URL (URL du serveur de tokens)
   - Toutes les clés Twilio dans .env.local

2. **Build:**
   ```bash
   npm run build
   ```

3. **Docker:**
   ```bash
   docker-compose up -d
   ```

## 🔒 Sécurité

⚠️ **IMPORTANT:** Ne jamais exposer les credentials Twilio côté client !
- Le API_KEY_SECRET reste uniquement sur le serveur
- Les tokens ont une durée de vie de 1h
- Renouvellement automatique avant expiration

## 📞 Support

Pour toute question sur l'intégration :
- Documentation Twilio: https://www.twilio.com/docs/voice/sdks/javascript
- Twenty CRM: https://twenty.com/developers

---

**Status:** ✅ Intégration complète et fonctionnelle
**Date:** 2025-01-04
**Version:** 1.0.0