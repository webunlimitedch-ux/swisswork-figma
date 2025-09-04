# SwissWork - Freelance Marketplace Platform

Eine moderne, skalierbare Freelance-Marktplatz-Plattform für die Schweiz, entwickelt mit React, TypeScript, Vite und Supabase.

## 🚀 Features

- **Benutzerauthentifizierung**: Sichere Anmeldung/Registrierung mit Supabase Auth
- **Dual Account Types**: Privatpersonen und Unternehmen
- **Job Listings**: Erstellen, bearbeiten und durchsuchen von Stellenausschreibungen
- **Offer System**: Unternehmen können Angebote auf Jobs abgeben
- **Company Profiles**: Detaillierte Unternehmensprofile mit Portfolio
- **Responsive Design**: Optimiert für Desktop und Mobile
- **TypeScript**: Vollständige Typisierung für bessere Entwicklererfahrung
- **Performance**: Optimiert für schnelle Ladezeiten

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **Deployment**: Vercel-ready
- **State Management**: React Hooks, Custom Hooks
- **Form Validation**: Custom validation utilities
- **Icons**: Lucide React

## 📁 Projektstruktur

```
src/
├── components/           # React Components
│   ├── common/          # Wiederverwendbare Components
│   ├── layout/          # Layout Components
│   └── ui/              # UI Components (Radix-basiert)
├── hooks/               # Custom React Hooks
├── lib/                 # Bibliotheken und Konfiguration
├── types/               # TypeScript Type Definitionen
├── utils/               # Utility Funktionen
└── styles/              # Globale Styles
```

## 🚀 Schnellstart

### Voraussetzungen

- Node.js 18+
- npm oder yarn
- Supabase Account

### Installation

1. Repository klonen:
```bash
git clone <repository-url>
cd swisswork
```

2. Dependencies installieren:
```bash
npm install
```

3. Environment Variables konfigurieren:
```bash
cp .env.example .env
```

Fügen Sie Ihre Supabase Credentials hinzu:
```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. Development Server starten:
```bash
npm run dev
```

### Supabase Setup

1. Erstellen Sie ein neues Supabase Projekt
2. Führen Sie die SQL Migrationen aus (siehe `supabase/migrations/`)
3. Deployen Sie die Edge Functions (siehe `supabase/functions/`)
4. Konfigurieren Sie die Authentication Settings

## 🏗️ Build & Deployment

### Lokaler Build
```bash
npm run build
```

### Vercel Deployment

Das Projekt ist Vercel-ready. Einfach mit Ihrem Git Repository verbinden:

1. Repository zu Vercel hinzufügen
2. Environment Variables konfigurieren
3. Deploy!

Die `vercel.json` Konfiguration ist bereits optimiert.

## 🧪 Development

### Code Style

- **TypeScript**: Strikte Typisierung aktiviert
- **ESLint**: Code Quality Rules
- **Prettier**: Code Formatting
- **Conventional Commits**: Commit Message Standards

### Custom Hooks

- `useAuth`: Authentication State Management
- `useListings`: Listings Data Management
- Weitere Hooks für spezifische Features

### API Layer

Zentralisierte API Calls über `src/lib/api.ts`:
- Type-safe API Calls
- Error Handling
- Request/Response Transformation

## 📊 Performance

- **Code Splitting**: Automatisch durch Vite
- **Tree Shaking**: Unused Code Elimination
- **Asset Optimization**: Bilder und Fonts optimiert
- **Caching**: Vercel Edge Caching konfiguriert

## 🔒 Sicherheit

- **Authentication**: Supabase Auth mit JWT
- **Authorization**: Row Level Security (RLS)
- **Input Validation**: Client & Server-side
- **XSS Protection**: Sanitized Inputs
- **CSRF Protection**: Supabase built-in

## 🌐 Internationalisierung

Vorbereitet für i18n:
- Deutsche Texte als Standard
- Struktur für weitere Sprachen vorhanden

## 📱 Mobile Support

- **Responsive Design**: Mobile-first Approach
- **Touch Optimized**: Touch-friendly UI Elements
- **Performance**: Optimiert für mobile Verbindungen

## 🤝 Contributing

1. Fork das Repository
2. Feature Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Changes committen (`git commit -m 'Add amazing feature'`)
4. Branch pushen (`git push origin feature/amazing-feature`)
5. Pull Request erstellen

## 📄 Lizenz

Dieses Projekt ist unter der MIT Lizenz lizenziert.

## 🆘 Support

Bei Fragen oder Problemen:
1. GitHub Issues erstellen
2. Dokumentation prüfen
3. Community Discord beitreten

---

**SwissWork** - Der professionelle Marktplatz für Schweizer Dienstleistungen.