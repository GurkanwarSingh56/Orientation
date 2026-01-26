# Technovate - Technical Innovation Club Website

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)

A modern, responsive website for Technovate - where technology meets innovation. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX** - Clean, professional design with smooth animations
- **Fully Responsive** - Optimized for mobile, tablet, and desktop
- **Interactive Components** - Animated counters, typewriter effects, and hover interactions
- **Performance Optimized** - Built with Next.js App Router for optimal performance
- **Type Safe** - Full TypeScript support for better developer experience
- **Customizable** - Easy to customize colors, content, and components

## 🎯 Sections

- **Hero** - Eye-catching landing with animated typewriter effect
- **Stats** - Dynamic counters showcasing club achievements
- **About** - Mission, vision, and what the club offers
- **Features** - Key offerings (workshops, hackathons, projects, etc.)
- **Events** - Upcoming and past events with detailed cards
- **Team** - Team members with social links
- **Footer** - Contact information and quick links

## 📁 Project Structure

```
technovate-website/
├── public/                        # Static assets
│   ├── images/
│   ├── icons/
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── (public)/             # Public routes group
│   │   │   ├── layout.tsx        # Public layout
│   │   │   ├── page.tsx          # Home page
│   │   │   ├── about/
│   │   │   ├── events/
│   │   │   ├── team/
│   │   │   ├── projects/
│   │   │   ├── blog/
│   │   │   └── contact/
│   │   │
│   │   ├── (auth)/               # Authentication routes
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── verify-email/
│   │   │
│   │   ├── (dashboard)/          # Protected member routes
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   └── settings/
│   │   │
│   │   ├── (admin)/              # Admin-only routes
│   │   │   ├── layout.tsx
│   │   │   ├── admin/
│   │   │   ├── admin/members/
│   │   │   ├── admin/events/
│   │   │   ├── admin/projects/
│   │   │   ├── admin/blog/
│   │   │   └── admin/settings/
│   │   │
│   │   ├── api/                  # API routes
│   │   │   ├── auth/
│   │   │   ├── events/
│   │   │   ├── members/
│   │   │   └── upload/
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── layout/               # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── AdminSidebar.tsx
│   │   │
│   │   ├── home/                 # Home page specific
│   │   │   ├── Hero.tsx
│   │   │   ├── Stats.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Features.tsx
│   │   │   └── CTA.tsx
│   │   │
│   │   ├── events/               # Event components
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventList.tsx
│   │   │   ├── EventDetails.tsx
│   │   │   └── EventForm.tsx
│   │   │
│   │   ├── team/                 # Team components
│   │   │   ├── TeamMember.tsx
│   │   │   └── TeamGrid.tsx
│   │   │
│   │   ├── auth/                 # Auth components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── AuthGuard.tsx
│   │   │
│   │   ├── dashboard/            # Dashboard components
│   │   │   ├── StatsCard.tsx
│   │   │   ├── ActivityFeed.tsx
│   │   │   └── MemberCard.tsx
│   │   │
│   │   └── ui/                   # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Dropdown.tsx
│   │       ├── Loading.tsx
│   │       └── Badge.tsx
│   │
│   ├── lib/                      # Utility functions
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── validations.ts
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useEvents.ts
│   │   ├── useMembers.ts
│   │   └── useDebounce.ts
│   │
│   ├── context/                  # React Context
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── types/                    # TypeScript types
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── event.ts
│   │   ├── member.ts
│   │   └── api.ts
│   │
│   ├── config/                   # Configuration files
│   │   ├── constants.ts
│   │   ├── navigation.ts
│   │   └── site.ts
│   │
│   └── middleware.ts             # Next.js middleware
│
├── .env.local                    # Environment variables
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Package Manager:** [pnpm](https://pnpm.io/)
- **Icons:** SVG (Heroicons style)

## 📦 Installation

### Prerequisites

- Node.js 18+ installed
- pnpm installed globally

```bash
npm install -g pnpm
```

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/technovate-website.git
cd technovate-website
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Create environment file**

```bash
cp .env.example .env.local
```

4. **Run development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Available Scripts

```bash
# Development
pnpm dev          # Start development server

# Production
pnpm build        # Build for production
pnpm start        # Start production server

# Linting
pnpm lint         # Run ESLint

# Security
bash scripts/security-check.sh  # Run security checks before pushing
```

## 🔒 Security

**Before pushing to GitHub, always run:**
```bash
bash scripts/security-check.sh
```

This will verify:
- ✅ No secret files are accidentally committed
- ✅ .env.local is properly ignored
- ✅ No API keys in staged files
- ✅ .gitignore is properly configured

See [SECURITY.md](SECURITY.md) for detailed security guidelines.

**Important Files (Never commit):**
- `.env.local` - Your actual environment variables
- `service-account-key.json` - Firebase admin credentials
- Any files with real API keys or secrets

**Safe Files (Can commit):**
- `.env.example` - Template with placeholder values
- `firestore.rules` - Database security rules
- `SECURITY.md` - Security documentation


## 🎨 Customization

### Images and Assets

#### Background Images (`public/images/backgrounds/`)
Place background images for the website here.

**Usage:**
- Hero section backgrounds
- Section backgrounds
- Pattern overlays

**Recommended Formats:**
- JPEG for photos (optimized for web)
- PNG for images with transparency
- WebP for better compression

**Recommended Sizes:**
- Hero backgrounds: 1920x1080px or larger
- Section backgrounds: 1920x600px

**Example Usage:**
```tsx
<div style={{ backgroundImage: 'url(/images/backgrounds/herobg.jpg)' }}>
```

#### Team Member Images (`public/images/team/`)
Place team member profile photos here.

**Usage:**
- Team section on homepage
- About page
- Individual member profiles

**Recommended Format:**
- Square images (1:1 aspect ratio)
- Size: 400x400px or 800x800px for high-DPI displays
- Format: JPEG or PNG
- File naming: lowercase with hyphens (e.g., `john-doe.jpg`)

**Example:**
```tsx
<img src="/images/team/john-doe.jpg" alt="John Doe" />
```

### Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  tech: {
    dark: '#0a192f',      // Background color
    light: '#172a45',     // Card background
    accent: '#64ffda',    // Accent color
  }
}
```

### Content

- **Update text content:** Edit component files in `src/components/`
- **Add team members:** Modify `src/components/Team.tsx`
- **Update events:** Modify `src/components/Events.tsx`
- **Change navigation:** Edit `src/components/Navbar.tsx`

### Animations

Custom animations are defined in `src/app/globals.css`. You can modify or add new animations:

```css
@keyframes yourAnimation {
  /* Your animation keyframes */
}
```

## 📱 Responsive Design

The website is fully responsive with breakpoints:

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

## 🔒 Future Enhancements

- [ ] Authentication system (NextAuth.js)
- [ ] Member dashboard
- [ ] Admin panel for content management
- [ ] Blog system with CMS
- [ ] Event registration system
- [ ] Project showcase with filtering
- [ ] Contact form with email integration
- [ ] Newsletter subscription
- [ ] Search functionality
- [ ] Dark/Light mode toggle

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

