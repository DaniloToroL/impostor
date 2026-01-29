# Guía de Contribución

¡Gracias por tu interés en contribuir a Impostor! Este documento te guiará a través del proceso.

## Código de Conducta

Por favor, sé respetuoso y constructivo en todas tus interacciones. Queremos mantener una comunidad acogedora para todos.

## Cómo Contribuir

### Reportar Bugs

Si encuentras un bug:

1. Busca en los [issues existentes](../../issues) para ver si ya fue reportado
2. Si no existe, [abre un nuevo issue](../../issues/new) incluyendo:
   - Título descriptivo
   - Pasos para reproducir el bug
   - Comportamiento esperado vs actual
   - Tu entorno (navegador, sistema operativo)
   - Screenshots o videos si aplica

### Sugerir Features

¿Tienes una idea para mejorar el juego?

1. Revisa los [issues existentes](../../issues) por si ya fue sugerido
2. [Abre un nuevo issue](../../issues/new) describiendo:
   - El problema que resuelve
   - Cómo funcionaría
   - Mockups o diagramas si los tienes

### Contribuir Código

1. **Fork** el repositorio
2. **Clona** tu fork:
   ```bash
   git clone https://github.com/tu-usuario/impostor.git
   ```
3. **Crea una rama** para tu cambio:
   ```bash
   git checkout -b feature/mi-nueva-funcionalidad
   ```
4. **Haz tus cambios** siguiendo las guías de estilo
5. **Prueba** que todo funcione
6. **Commit** con mensajes descriptivos:
   ```bash
   git commit -m "feat: añade sistema de chat en sala"
   ```
7. **Push** a tu fork:
   ```bash
   git push origin feature/mi-nueva-funcionalidad
   ```
8. **Abre un Pull Request** describiendo tus cambios

## Guías de Estilo

### Código

- Usa **TypeScript** para todo el código
- Sigue la configuración de **ESLint** del proyecto
- Usa **Prettier** para formateo (si está configurado)
- Nombra variables y funciones en **inglés**
- Comentarios pueden ser en español o inglés

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan código)
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests
- `chore:` Tareas de mantenimiento

Ejemplos:
```
feat: añade temporizador a la fase de votación
fix: corrige error al unirse a sala con código inválido
docs: actualiza instrucciones de instalación
```

### Pull Requests

- Describe **qué** cambios hiciste y **por qué**
- Referencia issues relacionados (`Closes #123`)
- Incluye screenshots para cambios visuales
- Asegúrate de que el CI pase

## Áreas donde puedes ayudar

### Para principiantes

- Mejorar documentación
- Añadir más palabras al seed
- Corregir typos
- Mejorar accesibilidad

### Para intermedios

- Añadir tests
- Mejorar UI/UX
- Optimizar rendimiento
- Internacionalización (i18n)

### Para avanzados

- Sistema de empates con fase de defensa
- WebSockets para tiempo real
- Chat durante la partida
- Sistema de estadísticas

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar BD
cp .env.example .env
# Edita .env con tus credenciales
npm run db:push
npm run db:seed

# Iniciar desarrollo
npm run dev
```

## ¿Preguntas?

Si tienes dudas, no dudes en:
- Abrir un issue con la etiqueta `question`
- Comentar en un PR existente

¡Gracias por contribuir! 🎉
