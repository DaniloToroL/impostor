# Impostor - Secret Word Game

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma)

**A real-time multiplayer game where one player is the impostor and doesn't know the secret word. Can you figure out who it is?**

[Demo](#) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## About the Game

**Impostor** is a social deduction game for 3+ players. At the start of each round:
- All players receive a **secret word** from a category
- **Except one**: the **impostor**, who doesn't know what the word is

### How to Play

1. **Turns phase**: Each player must say something related to the word without revealing it directly
2. **Voting phase**: Everyone votes on who they think is the impostor
3. **Last chance**: The impostor has one chance to guess the word
4. **Results**: The impostor is revealed and scores are updated

### Scoring System

- If the impostor **guesses** the word correctly: the impostor earns 1 point
- If the impostor **fails**: all civilians earn 1 point

---

## Features

- **Real-time**: Automatic game state updates every 2 seconds
- **Room codes**: Share a 4-character code for your friends to join
- **Google authentication**: Quick and secure sign-in
- **Persistent ranking**: Points accumulate across games in the same room
- **Responsive**: Designed to work on mobile and desktop
- **Dark mode**: Full support for light/dark themes

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) with App Router |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js v5](https://authjs.dev/) |
| **Server State** | [TanStack Query](https://tanstack.com/query) |
| **Validation** | [Zod](https://zod.dev/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |

---

## Installation

### Prerequisites

- Node.js 18+
- PostgreSQL (local or remote)
- Google Cloud account for OAuth

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/impostor.git
   cd impostor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/impostor"
   AUTH_SECRET="generate-with-npx-auth-secret"
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open** [http://localhost:3000](http://localhost:3000)

---

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ / Google Identity API
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure:
   - Type: Web application
   - Authorized origins: `http://localhost:3000`
   - Redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run the linter |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Sync schema with database |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed the database with initial words |

---

## Project Structure

```
impostor/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (game)/            # Game routes (new, join, room)
│   └── api/               # API routes
├── components/
│   ├── game/              # Game-specific components
│   └── ui/                # Reusable UI components
├── lib/                   # Utilities and configuration
├── prisma/
│   ├── schema.prisma      # Data model
│   └── seed.ts            # Initial data
├── server/
│   ├── actions/           # Server Actions
│   └── queries/           # Database queries
└── types/                 # TypeScript types
```

---

## Contributing

Contributions are welcome! This project is open to improvements of all kinds.

### How to Contribute

1. **Fork** the repository
2. Create a **branch** for your feature (`git checkout -b feature/new-feature`)
3. **Commit** your changes (`git commit -m 'Add new feature'`)
4. **Push** to the branch (`git push origin feature/new-feature`)
5. Open a **Pull Request**

### Ideas for Contributions

- [ ] Add more categories and words
- [ ] Implement tiebreaker system with defense phase
- [ ] Add sounds and effects
- [ ] Real-time chat during the game
- [ ] Spectator mode
- [ ] Player statistics
- [ ] Support for multiple consecutive rounds
- [ ] Internationalization (i18n)

### Reporting Bugs

If you find a bug, please [open an issue](../../issues/new) with:
- Problem description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by the community

**[⬆ Back to top](#impostor---secret-word-game)**

</div>
