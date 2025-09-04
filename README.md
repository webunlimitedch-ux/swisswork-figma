# SwissWork - Schweizer Freelance Marktplatz

Eine moderne, skalierbare Freelance-Marktplatz-Plattform für die Schweiz, entwickelt mit Next.js 14, TypeScript und Supabase.

## 🚀 Features

- **Next.js 14** mit App Router und Server Components
- **TypeScript** für vollständige Typisierung
- **Supabase** für Authentication und Database
- **Tailwind CSS** für modernes Styling
- **Radix UI** für accessible UI Components
- **Responsive Design** für alle Geräte
- **Performance-optimiert** mit Code-Splitting

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Backend**: Supabase (Auth, Database, Real-time)
- **Deployment**: Vercel
- **Icons**: Lucide React

## 📁 Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Globale Styles
│   ├── layout.tsx         # Root Layout
│   ├── page.tsx           # Homepage
│   ├── auth/              # Authentication Pages
│   └── dashboard/         # Dashboard Pages
├── components/            # React Components
│   ├── ui/               # UI Components (shadcn/ui)
│   ├── layout/           # Layout Components
│   ├── sections/         # Page Sections
│   ├── auth/             # Auth Components
│   └── dashboard/        # Dashboard Components
├── lib/                  # Libraries & Configuration
│   ├── supabase/         # Supabase Client/Server
│   └── utils.ts          # Utility Functions
├── hooks/                # Custom React Hooks
├── providers/            # Context Providers
└── types/                # TypeScript Definitions
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
cp .env.local.example .env.local
```

Fügen Sie Ihre Supabase Credentials hinzu:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Development Server starten:
```bash
npm run dev
```

### Supabase Setup

1. Erstellen Sie ein neues Supabase Projekt
2. Führen Sie die SQL Migrationen aus
3. Konfigurieren Sie die Authentication Settings
4. Fügen Sie die Credentials zu `.env.local` hinzu

## 🏗️ Build & Deployment

### Lokaler Build
```bash
npm run build
npm start
```

### Vercel Deployment

1. Repository zu Vercel hinzufügen
2. Environment Variables konfigurieren
3. Deploy!

Das Projekt ist automatisch für Vercel optimiert.

## 📊 Performance Features

- **Server Components** für bessere Performance
- **Dynamic Imports** für Code-Splitting
- **Image Optimization** mit Next.js Image
- **Font Optimization** mit Next.js Fonts
- **Bundle Analyzer** für Bundle-Optimierung

## 🔒 Sicherheit

- **Supabase Auth** mit JWT
- **Row Level Security** (RLS)
- **Type-safe** API Calls
- **Input Validation** auf Client & Server
- **Security Headers** konfiguriert

## 🎨 UI/UX Features

- **Responsive Design** für alle Geräte
- **Dark Mode** Support (vorbereitet)
- **Accessibility** mit Radix UI
- **Loading States** und Error Boundaries
- **Toast Notifications** mit Sonner

## 🧪 Development

### Scripts

```bash
npm run dev          # Development Server
npm run build        # Production Build
npm run start        # Production Server
npm run lint         # ESLint
npm run type-check   # TypeScript Check
```

### Code Style

- **TypeScript** strikte Konfiguration
- **ESLint** für Code Quality
- **Prettier** für Code Formatting
- **Conventional Commits** empfohlen

## 📱 Mobile Support

- **Mobile-first** Design Approach
- **Touch-optimized** UI Elements
- **Progressive Web App** ready
- **Offline Support** (vorbereitet)

## 🌐 Internationalisierung

- **Deutsch** als Standard
- **i18n-ready** Struktur
- **Locale-aware** Formatierung

## 🤝 Contributing

1. Fork das Repository
2. Feature Branch erstellen
3. Changes committen
4. Pull Request erstellen

## 📄 Lizenz

MIT License - siehe LICENSE Datei

## 🆘 Support

- GitHub Issues für Bugs
- Discussions für Fragen
- Wiki für Dokumentation

---

**SwissWork** - Der professionelle Marktplatz für Schweizer Dienstleistungen.