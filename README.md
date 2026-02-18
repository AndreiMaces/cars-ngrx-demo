# CarsNgrx

Demo Angular + NgRx: listă mașini, detaliu mașină cu piese, autentificare. Backend mock REST (Express) cu date din `db.json`.

**DEMO:** [https://ngrx-cars.macesandrei.com](https://ngrx-cars.macesandrei.com)
Login with the following credentials:

Username: **admin**
Password: **admin1234**

---

## Cum a fost creat proiectul

Proiectul a fost generat cu **Angular CLI 21** și extins cu **NgRx** (Store, Effects, Router Store, NgRx Data).

### Pornire

```bash
# Nou proiect Angular (dacă pornești de la zero)
ng new cars-ngrx --style=css --routing --ssr=false

# Dependențe NgRx
npm install @ngrx/store @ngrx/effects @ngrx/router-store @ngrx/store-devtools @ngrx/entity @ngrx/data
```

### Structura aplicației

- **Rute:** `''` → redirect la `/auth`; `/auth` (login); `/cars` (listă + detaliu mașini, protejat cu guard).
- **Backend:** server Express în `server/index.js` (REST: `/api/login`, `/api/cars`, `/api/carParts`), date din `db.json`.
- **UI:** Tailwind CSS, dark mode, componente standalone.

---

## NgRx – arhitectura state-ului

State-ul este gestionat cu **@ngrx/store**, **@ngrx/effects**, **@ngrx/router-store** și **@ngrx/data** pentru entități (mașini și piese).

### 1. Store principal și reduceri

- **`app.config.ts`** – configurează:
  - `provideStore(reducers, { metaReducers, runtimeChecks })`
  - `provideStoreDevtools()` – Redux DevTools
  - `provideEffects(AuthEffects)`
  - `provideRouterStore()` – state pentru router
  - `provideEntityData()` – NgRx Data pentru `Car` și `CarPart`
  - `DefaultDataServiceConfig` – URL-uri API: `api/cars/`, `api/carParts/`

- **`reducers/index.ts`** – `ActionReducerMap`:
  - `auth` → `authReducer`
  - `router` → `routerReducer`
  - (NgRx Data își adaugă singur `entityCache`)

- **`reducers/index.ts`** – `AppState` și (în dev) un `loggingReducer` ca metaReducer.

### 2. Auth (Store + Effects + Selectors)

- **Actions** (`auth/auth.actions.ts`): `login({ user })`, `logout()`.
- **Reducer** (`auth/reducers/index.ts`): `AuthState = { user: User | null }`, inițializat din `localStorage`; la `login` salvează user, la `logout` pune `user: null`.
- **Effects** (`auth/auth.effects.ts`):
  - la `login`: salvează user în `localStorage`, navigare la `/cars`;
  - la `logout`: șterge `localStorage`, navigare la `/auth`.
- **Selectors** (`auth/auth.selectors.ts`): `selectAuthState`, `isLoggedIn`, `isLoggedOut`.
- **Guards:** `isAuthenticatedGuard` (pentru `/cars`), `isNotAuthenticatedGuard` (pentru `/auth`), folosind `Store` + `isLoggedIn`.

### 3. NgRx Data – mașini și piese

- **Entity metadata** (`features/cars/`):
  - `car-entity-metadata.ts` – `Car`
  - `car-part-entity-metadata.ts` – `CarPart`
- **Config** în `app.config.ts`: URL-uri pentru colecții și entități (`api/cars/`, `api/carParts/`).
- **Folosire:** componentele folosesc `EntityCollectionService` (injectate) pentru `getAll()`, `getByKey()`, `add()`, `update()`, `delete()`; NgRx Data se ocupă de requesturi HTTP, cache și state în `entityCache`.

### 4. Router Store

- `provideRouterStore({ stateKey: 'router', routerState: RouterState.Minimal })` – state-ul rutei este în store pentru sync cu URL și pentru selectors pe rută.

---

## Rulare locală

```bash
# Instalare
npm install

# Frontend (port 4200, proxy /api → 3000)
npm start
# sau: ng serve

# Backend mock (port 3000)
npm run server
# sau cu delay artificial: npm run server:delay
```

Deschide [http://localhost:4200](http://localhost:4200). La login folosește useri din `db.json` (ex.: username + parola din seed).

---

## Build și deploy

```bash
npm run build
```

Output: `dist/cars-ngrx/browser/`. Proiectul poate fi servit static + API (vezi `server/index.js` care servește și frontend-ul din `dist` și API-ul sub `/api`). Pentru deploy (ex. CapRover) există `Dockerfile` și `captain-definition`; rulezi `npm run build` local și incluzi `dist/` în arhivă.

---

## Resurse

- [NgRx Store](https://ngrx.io/guide/store)
- [NgRx Effects](https://ngrx.io/guide/effects)
- [NgRx Data](https://ngrx.io/guide/data)
- [NgRx Router Store](https://ngrx.io/guide/router-store)
- [Angular CLI](https://angular.dev/tools/cli)
