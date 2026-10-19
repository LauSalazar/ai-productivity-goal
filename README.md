# Enfoque Uno

Aplicación de productividad enfocada en lograr un objetivo principal activo, planificarlo con ayuda de IA y mantener un seguimiento diario del progreso.

## ¿Qué hace la app?

- Crea y gestiona un único objetivo principal activo.
- Genera un plan de acción con entrevistas diagnósticas usando OpenAI (o cae a un plan por defecto si no se provee API key).
- Desglosa el objetivo en hitos, tareas y seguimiento de progreso.
- Incluye un modo de enfoque con temporizador Pomodoro y notas tipo brain dump.
- Permite registrar reflexiones diarias y ver métricas de enfoque.
- Guarda datos localmente en el navegador con localStorage para mantener la app ligera y simple de desplegar.
- Soporta español e inglés.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Drizzle ORM
- PostgreSQL (preparado para integración, aunque la app en ejecución principal usa almacenamiento local del navegador)

## Requisitos

- Node.js 20 o superior
- npm
- Opcional: una clave de OpenAI para generar planes más personalizados

## Instalación

```bash
npm install
npm run dev
```

La aplicación quedará disponible en: http://localhost:3000

## Scripts

```bash
npm run dev      # desarrollo local con Next.js
npm run build    # compilación de producción
npm run start    # preview del build exportado con serve
npm run lint     # validación ESLint
npm run typecheck # validación de tipos
```

## Variables de entorno

Crea un archivo `.env.local` si necesitas configuraciones locales. Para GitHub Pages, la app puede funcionar sin backend ni variables complejas.

```env
NEXT_PUBLIC_BASE_PATH=
```

- Si la app se despliega en un repositorio con nombre `mi-repo`, define:

```env
NEXT_PUBLIC_BASE_PATH=/mi-repo
```

## Despliegue en GitHub Pages

Esta app está pensada para un despliegue estático porque no depende de un servidor backend para la experiencia principal. La información del usuario se guarda en `localStorage`, así que no requiere una base de datos en producción.

### Configuración necesaria

1. En `next.config.ts` se activa el export estático y se configuran rutas base para GitHub Pages.
2. El proyecto genera la salida en la carpeta `out`.
3. GitHub Pages sirve ese contenido desde la rama `gh-pages` o a través del workflow de GitHub Actions.

### Despliegue con GitHub Actions

Este repositorio incluye un workflow en `.github/workflows/deploy-pages.yml` que:

- instala dependencias,
- compila la app en modo estático,
- sube el artefacto a GitHub Pages,
- publica la app en la sección Pages del repositorio.

### Pasos para activarlo

1. Subir este proyecto a GitHub.
2. Ir a la sección Settings > Pages.
3. En Source, seleccionar `GitHub Actions`.
4. Hacer push a la rama principal (`main`).
5. La acción iniciará el deploy automáticamente.

### Si quieres desplegar manualmente

```bash
npm install
npm run build
```

Luego sube el contenido de la carpeta `out` a tu rama de Pages o usa el workflow incluido.

## Nota importante sobre la IA

La integracion con OpenAI se realiza desde el navegador. La API key se almacena solo en `localStorage` y se usa solo para generar el plan inicial del objetivo.

## Estructura principal

```text
src/
  app/
  components/
  db/
  lib/
```

## Licencia

Este proyecto se entrega como ejemplo de aplicación de productividad con enfoque en metas y planificación personal.
