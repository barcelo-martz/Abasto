# Convenciones del proyecto Abasto

## 1. Estructura del repositorio

- `apps/api`: backend (C#, ASP.NET Core, PostgreSQL/PostGIS)
- `apps/web`: sitio público (Next.js)
- `apps/panel`: panel por roles (Next.js)
- `packages/ui`: componentes y tokens de marca compartidos (`@abasto/ui`)
- `packages/api-client`: cliente tipado generado desde el OpenAPI (`@abasto/api-client`)
- `docs`: documentación (convenciones, arquitectura, decisiones técnicas)
- `infra`: Docker y despliegue

## 2. Estrategia de ramas

| Rama              | Propósito                        | Quién escribe en ella                        |
| ----------------- | -------------------------------- | -------------------------------------------- |
| `main`            | Versión estable y entregable     | Solo por Pull Request desde `develop`        |
| `develop`         | Integración del trabajo en curso | Solo por Pull Request desde ramas de trabajo |
| `<tipo>/<nombre>` | Una tarea concreta               | Desarrollo diario                            |

Regla de oro: **`main` nunca recibe algo que `develop` no tenga antes**. El único camino es rama de trabajo → `develop` → `main`.

Prefijos de rama de trabajo: `feature/`, `fix/`, `docs/`, `chore/`, `build/`, `ci/`, `refactor/`, `test/`.
Nombres en minúscula, con guiones. Ejemplos: `feature/api-init`, `fix/api-stock-calculation`, `docs/conventions`.

## 3. Flujo de trabajo

1. `git switch develop && git pull`
2. Crear la rama desde `develop`.
3. Realizar el cambio y hacer **un único commit**.
4. `git push -u origin <rama>` y abrir el PR con `base: develop`.
5. Fusionar con **Squash and merge**.
6. Limpieza local: `git switch develop && git pull && git fetch --prune && git branch -D <rama>`.

Si hay que corregir algo antes de fusionar, no se agrega otro commit:

```bash
git add <archivos>
git commit --amend --no-edit
git push --force-with-lease
```

Solo se hace en ramas de trabajo, nunca en `develop` ni en `main`.

## 4. Pull Requests

- Un PR = un commit = un cambio lógico que compila.
- El título del PR es exactamente el mensaje del commit.
- La descripción indica qué cambia y cómo probarlo.
- Antes de fusionar se revisa la lista del apartado 10.

| PR                          | Método de fusión      |
| --------------------------- | --------------------- |
| Rama de trabajo → `develop` | Squash and merge      |
| `develop` → `main`          | Create a merge commit |

## 5. Entrega a `main` y versiones

Al cerrar un hito se abre un PR `develop` → `main` (merge commit) y se etiqueta la versión:

```bash
git switch main && git pull
git tag -a vX.Y.Z -m "<descripción del hito>"
git push origin vX.Y.Z
```

Después se sincroniza `develop` para que no se atrase:

```bash
git switch develop && git pull
git fetch origin
git merge --ff-only origin/main
git push origin develop
```

Versionado semántico `vMAYOR.MENOR.PARCHE`: `v0.x.y` durante el desarrollo y `v1.0.0` para la versión entregada.

## 6. Mensajes de commit (Conventional Commits)

Formato: `tipo(alcance): descripción`

- Tipos: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `build`, `ci`, `style`.
- Alcances: `api`, `web`, `panel`, `ui`, `api-client`, `db`, `infra`, `docs`, `repo`.
- Descripción en imperativo, en minúscula, sin punto final.

Ejemplos:

- `feat(api): add medicine entity and repository`
- `fix(web): correct pharmacy search filter`
- `chore(repo): add pnpm workspace and root scripts`

## 7. Convenciones de nombrado

**Backend (C#)**

- Clases, métodos y propiedades: `PascalCase`.
- Variables locales y parámetros: `camelCase`.
- Campos privados: `_camelCase`.
- Interfaces con prefijo `I` (`IMedicineRepository`).
- Un archivo por clase, con el nombre de la clase.

**Frontend (TypeScript/React)**

- Componentes: `PascalCase` (`PharmacyCard.tsx`).
- Funciones, variables y hooks: `camelCase` (`useStock`).
- Constantes globales: `UPPER_SNAKE_CASE`.
- Carpetas y archivos que no son componentes: `kebab-case`.

**Base de datos (PostgreSQL)**

- Tablas y columnas en `snake_case`; tablas en plural (`pharmacies`, `stock_items`).
- Clave primaria `id`; clave foránea `<entidad>_id`.

**API REST**

- Rutas en minúscula, plural y con guiones: `/api/pharmacies/{id}/stock`.
- GET (leer), POST (crear), PUT/PATCH (actualizar), DELETE (borrar).

## 8. Estilo y formato

- `.editorconfig` en la raíz define codificación, saltos de línea e indentación.
- Frontend: Prettier. Backend: `dotnet format`.
- Los hooks de Git (Husky) validan el mensaje de commit y formatean los archivos preparados.

## 9. Gestor de paquetes y versiones

- Frontend con **pnpm** (workspaces). Un único `pnpm-lock.yaml`, en la raíz.
- La versión de Node se fija en `.nvmrc` y la del SDK de .NET en `global.json`.
- Comandos habituales desde la raíz: `pnpm db:up`, `pnpm dev`, `pnpm api:test`.

## 10. Variables de entorno y secretos

- Los secretos nunca se suben al repositorio.
- Cada archivo `.env` real está en `.gitignore`; solo se versiona su `.env.example`.
- Backend y base de datos comparten `infra/.env`; las apps web usan `.env.local`.

## 11. Documentación y revisión de código

- Comentarios solo para explicar el porqué, no el qué.
- Documentación XML (`///`) en las API públicas de C#; endpoints documentados con Swagger/OpenAPI.
- Lista de revisión de cada PR: compila, pasan las pruebas, sin código muerto, sin secretos, un solo commit, título con formato correcto.

## 12. Pruebas

- Backend: xUnit; nombre de las pruebas `Metodo_Escenario_Resultado`.
- Toda funcionalidad nueva incluye sus pruebas en el mismo PR.
