# Contributing Guide

Thank you for your interest in contributing to Impostor! This document will guide you through the process.

## Code of Conduct

Please be respectful and constructive in all your interactions. We want to maintain a welcoming community for everyone.

## How to Contribute

### Reporting Bugs

If you find a bug:

1. Search the [existing issues](../../issues) to see if it has already been reported
2. If not, [open a new issue](../../issues/new) including:
   - Descriptive title
   - Steps to reproduce the bug
   - Expected vs actual behavior
   - Your environment (browser, operating system)
   - Screenshots or videos if applicable

### Suggesting Features

Have an idea to improve the game?

1. Check the [existing issues](../../issues) in case it has already been suggested
2. [Open a new issue](../../issues/new) describing:
   - The problem it solves
   - How it would work
   - Mockups or diagrams if you have them

### Contributing Code

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/your-username/impostor.git
   ```
3. **Create a branch** for your change:
   ```bash
   git checkout -b feature/my-new-feature
   ```
4. **Make your changes** following the style guides
5. **Test** that everything works
6. **Commit** with descriptive messages:
   ```bash
   git commit -m "feat: add chat system in room"
   ```
7. **Push** to your fork:
   ```bash
   git push origin feature/my-new-feature
   ```
8. **Open a Pull Request** describing your changes

## Style Guides

### Code

- Use **TypeScript** for all code
- Follow the project's **ESLint** configuration
- Use **Prettier** for formatting (if configured)
- Name variables and functions in **English**

### Commits

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Format changes (doesn't affect code)
- `refactor:` Code refactoring
- `test:` Add or modify tests
- `chore:` Maintenance tasks

Examples:
```
feat: add timer to voting phase
fix: correct error when joining room with invalid code
docs: update installation instructions
```

### Pull Requests

- Describe **what** changes you made and **why**
- Reference related issues (`Closes #123`)
- Include screenshots for visual changes
- Make sure CI passes

## Areas Where You Can Help

### For Beginners

- Improve documentation
- Add more words to the seed
- Fix typos
- Improve accessibility

### For Intermediate

- Add tests
- Improve UI/UX
- Optimize performance
- Internationalization (i18n)

### For Advanced

- Tiebreaker system with defense phase
- WebSockets for real-time updates
- Chat during the game
- Statistics system

## Local Development

```bash
# Install dependencies
npm install

# Configure database
cp .env.example .env
# Edit .env with your credentials
npm run db:push
npm run db:seed

# Start development
npm run dev
```

## Questions?

If you have any questions, feel free to:
- Open an issue with the `question` label
- Comment on an existing PR

Thank you for contributing! 🎉
