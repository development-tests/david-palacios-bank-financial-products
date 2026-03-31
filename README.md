# Bank Financial Products

Aplicación frontend para la gestión de productos financieros.  
Desarrollada con **Angular 21**, **TypeScript**, **Jest** para pruebas unitarias y **CSS/SCSS puro** (sin frameworks de UI).  
Consume una API REST local provista por un backend Node.js.

## Requisitos previos

- [Node.js](https://nodejs.org/) v22.14.0 o superior
- [npm](https://www.npmjs.com/) v10.9.2 o superior
- Angular CLI (opcional, se puede usar `npx ng`)

## Instalación del frontend

1. Clona el repositorio:

```bash
 git clone https://github.com/development-tests/david-palacios-bank-financial-products
 cd bank-financial-products
```

2. Instala las dependencias:

```bash
 npm install
```

## Backend (API local)

El proyecto consume una API que debe ejecutarse localmente.
El backend se proporciona en el archivo `repo-interview-main.zip` (descargado de la prueba técnica). Siguiendo estos pasos:

1. Descomprime `repo-interview-main.zip` en una carpeta aparte.
2. Abre una terminal en esa carpeta.
3. Instala las dependencias del backend:

```bash
 npm install
```

4. Habilitar CORS – El backend necesita permitir peticiones desde el frontend (`http://localhost:4200`).
   Edita el archivo `src/main.ts` y añade la opción cors: true en la configuración del servidor:

```typescript
const app = createExpressServer({
  cors: true, // <-- agregar esta línea
  routePrefix: '/bp',
  controllers: [__dirname + '/controllers/*{.js,.ts}'],
});
```

Si el módulo cors no está instalado, instálalo con:

```bash
  npm install cors
```

5. Inicia el servidor:

```bash
  npm run start:dev
```

El servidor se ejecutará en `http://localhost:3002`.

6. Verifica que funciona accediendo a `http://localhost:3002/bp/products` (debe devolver un JSON con la lista de productos).

## Ejecutar el frontend

1. Asegúrate de que el backend esté corriendo (paso anterior).
2. En la carpeta del frontend, ejecuta:

```bash
ng serve
```

3. Abre el navegador en `http://localhost:4200`.

## Ejecutar pruebas unitarias

El proyecto usa Jest con cobertura mínima del 70%.

```bash
  npm run test
```

El comando ejecuta todas las pruebas y genera un reporte de cobertura en la carpeta `coverage/`.
Para ver el reporte detallado en el navegador, abre `coverage/lcov-report/index.html`.

Si deseas ejecutar las pruebas en modo watch (se actualizan automáticamente al cambiar archivos):

```bash
  npx jest --watch
```

## Estructura del proyecto

```text
  src/
  ├── app/
  │   ├── core/               # Servicios, interceptores
  │   ├── features/           # Componentes principales (product-list, product-form)
  │   ├── layouts/            # Layout compartido (header BANCO)
  │   ├── shared/             # Componentes reutilizables, modelos, validadores
  │   └── app.config.ts       # Configuración de Angular (rutas, HTTP interceptors)
  ├── assets/                 # Íconos, fuentes (si los hay)
  ├── environments/           # Variables de entorno (apiUrl)
  ├── styles.css              # Estilos globales
  └── index.html
```

## Tecnologías utilizadas

- Angular 21 – Framework frontend
- TypeScript 5.9 – Tipado estático
- Jest – Pruebas unitarias y coverage
- RxJS – Manejo de observables
- CSS/SCSS – Estilos sin librerías externas
- Font Awesome – Íconos (solo CDN, no es framework de UI)

## Características implementadas

- Listado de productos con logo, nombre, descripción, fechas de liberación y revisión.
- Búsqueda en tiempo real por nombre o descripción.
- Paginación con opciones de 5, 10, 20 registros por página.
- Creación de productos con validaciones:
  - ID: requerido, 3‑10 caracteres, único (validación asíncrona).
  - Nombre: requerido, 5‑100 caracteres.
  - Descripción: requerido, 10‑200 caracteres.
  - Logo: URL válida.
  - Fecha de liberación: igual o mayor a hoy.
  - Fecha de revisión: exactamente un año después de la liberación.

- Edición de productos (menú contextual en cada fila, ID deshabilitado).
- Eliminación de productos con modal de confirmación.
- Manejo global de errores HTTP mediante interceptor + notificaciones toast.
- Diseño responsive (tabla con scroll horizontal, formulario adaptable a móviles).
- Skeleton loader mientras se cargan los datos.
- Cobertura de pruebas >70% (Jest).

## Licencia

Este proyecto es parte de una prueba técnica y no tiene licencia definida.
