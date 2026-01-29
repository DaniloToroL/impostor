# Impostor - Juego de Palabras Secretas

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma)

**Un juego multijugador en tiempo real donde un jugador es el impostor y no conoce la palabra secreta. ¿Podrás descubrir quién es?**

[Demo](#) · [Reportar Bug](../../issues) · [Solicitar Feature](../../issues)

</div>

---

## Acerca del Juego

**Impostor** es un juego de deducción social para 3+ jugadores. Al inicio de cada ronda:
- Todos los jugadores reciben una **palabra secreta** de una categoría
- **Excepto uno**: el **impostor**, que no sabe cuál es la palabra

### Cómo se juega

1. **Fase de turnos**: Cada jugador debe decir algo relacionado con la palabra sin revelarla directamente
2. **Fase de votación**: Todos votan quién creen que es el impostor
3. **Última oportunidad**: El impostor tiene una chance de adivinar la palabra
4. **Resultados**: Se revela quién era el impostor y se actualizan los puntos

### Sistema de puntos

- Si el impostor **adivina** la palabra: el impostor gana 1 punto
- Si el impostor **falla**: todos los civiles ganan 1 punto

---

## Características

- **Tiempo real**: Actualización automática del estado del juego cada 2 segundos
- **Salas con código**: Comparte un código de 4 caracteres para que tus amigos se unan
- **Autenticación con Google**: Inicio de sesión rápido y seguro
- **Ranking persistente**: Los puntos se acumulan entre partidas de la misma sala
- **Responsive**: Diseñado para funcionar en móviles y escritorio
- **Modo oscuro**: Soporte completo para tema claro/oscuro

---

## Tech Stack

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) con App Router |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) |
| **Estilos** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Base de datos** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Autenticación** | [NextAuth.js v5](https://authjs.dev/) |
| **Estado del servidor** | [TanStack Query](https://tanstack.com/query) |
| **Validación** | [Zod](https://zod.dev/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |

---

## Instalación

### Prerrequisitos

- Node.js 18+
- PostgreSQL (local o remoto)
- Cuenta de Google Cloud para OAuth

### Pasos

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/impostor.git
   cd impostor
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita `.env` con tus credenciales:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/impostor"
   AUTH_SECRET="genera-con-npx-auth-secret"
   AUTH_GOOGLE_ID="tu-google-client-id"
   AUTH_GOOGLE_SECRET="tu-google-client-secret"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Configura la base de datos**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

6. **Abre** [http://localhost:3000](http://localhost:3000)

---

## Configuración de Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ / Google Identity
4. Ve a **Credenciales** > **Crear credenciales** > **ID de cliente OAuth 2.0**
5. Configura:
   - Tipo: Aplicación web
   - Orígenes autorizados: `http://localhost:3000`
   - URIs de redirección: `http://localhost:3000/api/auth/callback/google`
6. Copia el Client ID y Client Secret a tu `.env`

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila la aplicación para producción |
| `npm run start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta el linter |
| `npm run db:generate` | Genera el cliente de Prisma |
| `npm run db:push` | Sincroniza el schema con la BD |
| `npm run db:migrate` | Ejecuta migraciones de Prisma |
| `npm run db:seed` | Llena la BD con palabras iniciales |

---

## Estructura del Proyecto

```
impostor/
├── app/                    # App Router de Next.js
│   ├── (auth)/            # Rutas de autenticación
│   ├── (game)/            # Rutas del juego (new, join, room)
│   └── api/               # API routes
├── components/
│   ├── game/              # Componentes específicos del juego
│   └── ui/                # Componentes UI reutilizables
├── lib/                   # Utilidades y configuración
├── prisma/
│   ├── schema.prisma      # Modelo de datos
│   └── seed.ts            # Datos iniciales
├── server/
│   ├── actions/           # Server Actions
│   └── queries/           # Consultas a BD
└── types/                 # Tipos TypeScript
```

---

## Contribuir

¡Las contribuciones son bienvenidas! Este proyecto está abierto a mejoras de todo tipo.

### Cómo contribuir

1. **Fork** el repositorio
2. Crea una **rama** para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un **Pull Request**

### Ideas para contribuir

- [ ] Añadir más categorías y palabras
- [ ] Implementar sistema de empates con fase de defensa
- [ ] Añadir sonidos y efectos
- [ ] Chat en tiempo real durante la partida
- [ ] Modo espectador
- [ ] Estadísticas de jugador
- [ ] Soporte para múltiples rondas seguidas
- [ ] Internacionalización (i18n)

### Reportar bugs

Si encuentras un bug, por favor [abre un issue](../../issues/new) con:
- Descripción del problema
- Pasos para reproducirlo
- Comportamiento esperado vs actual
- Screenshots si aplica

---

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

Hecho con ❤️ por la comunidad

**[⬆ Volver arriba](#impostor---juego-de-palabras-secretas)**

</div>
