# EasyReserv — Pachet .md (Backend, Admin Panel, Landing B2B, SEO)

Mai jos ai **fișierele .md** (într-un singur bundle). Copiază fiecare secțiune într-un fișier separat în repo.

---

## `/docs/backend.md`

### Obiectiv
Backend expune modele/endpoint‑uri pentru pagini multi‑lingvă, SEO, blocuri de conținut și redirects. Generează automat sitemap și robots.

### Modele (DB)
- **Page**
  - `id: string` (slug + locale)
  - `route: string` (ex. `/pricing`)
  - `locale: enum(ro|ru|en)`
  - `slug: string` (fără locale)
  - `status: enum(draft|published)`
  - `seo: Seo`
  - `content: Content`
  - `createdAt`, `updatedAt`, `publishedAt`, `version`
- **Seo**
  - `title: string (≤60)`
  - `description: string (140–160)`
  - `robots: enum(index,follow|noindex,nofollow)`
  - `canonicalOverride?: string (URL absolut)`
  - `og: { title?, description?, image? }`
  - `twitter: { card: 'summary_large_image', title?, description?, image? }`
  - `hreflang: { hrefLang: 'ro'|'ru'|'en'|'x-default', href: string }[]`
  - `schema: { '@type': string, json: object }[]`
- **Content**
  - `blocks: Block[]` (vezi tipurile mai jos)
- **Block (discriminated union)**
  - `hero | socialProof | industriesPicker | featuresGrid | integrations | pricingSnippet | faq | ctaBanner`
- **Redirect**
  - `from: string`, `to: string`, `code: 301|302`, `date: ISO`

### Endpoint‑uri
- `GET /api/pages?route=/{locale}/path` → Page
- `GET /api/pages/:id` → Page
- `POST /api/pages` → create (validări SEO)
- `PUT /api/pages/:id` → update (versioning + preview)
- `GET /api/redirects` / `POST /api/redirects`
- `GET /sitemap.xml` (runtime din `Page.status==='published'`)
- `GET /robots.txt` (static din config)

### Validări server
- Title unic per (route, locale); ≤ 60 caractere
- Description 140–160; non‑empty
- CanonicalOverride: URL absolut, același domeniu
- Hreflang: set complet ro/ru/en + x‑default pentru paginile cheie
- OG/Twitter image: min 1200×630, < 512 KB
- Schema JSON: parsabil și valid (minim câmpuri obligatorii pentru tip)
- Redirect `from≠to`, `to` există/va exista

### Generatoare
- **Sitemap**: `changefreq=weekly`, `priority=0.8` (override din Page.seo)
- **Robots**: Allow: `/`; Disallow: `/api/`, `/admin/`, `/draft/`

### Observabilitate
- audit trail (autor, data, diff)
- preview tokens, expirați după 24h

---

## `/docs/admin-panel.md`

### Obiectiv
UI pentru editori: creare pagini per limbă, SEO tab cu validări live, blocuri de conținut cu preview.

### Secțiuni UI
1) **Lista pagini**
   - Filtre: status, limbă, tip
   - Căutare după route/title
2) **Editor pagină** (tab‑uri)
   - **Content**: gestionare `blocks` (drag&drop, add/remove)
   - **SEO**: title/description/robots/canonical/OG/Twitter/hreflang/schema
   - **Redirects** (pentru pagina curentă sau global)
   - **Preview** (live, cu param `?preview=token`)

### Tipuri de bloc (form schema)
- `hero`: eyebrow, title, sub, ctaPrimary{label,href}, ctaSecondary{label,href}, image
- `socialProof`: logos[], quote?, author?
- `industriesPicker`: items[]{label, href}
- `featuresGrid`: items[]{icon, title, text}
- `integrations`: items[]{name, logo, href}
- `pricingSnippet`: plans[]{name, price, currency, cta}
- `faq`: items[]{q, a}
- `ctaBanner`: title, sub, cta

### Validări UI
- Contor caractere pentru title/description
- URL validator pentru canonical/CTA/hreflang
- Imagine OG: dimensiune + raport 1200×630
- Schema editor: JSON lint + preseturi `SoftwareApplication`, `Service`, `FAQPage`

### Flux de lucru
- Draft → Preview → Review (checklist) → Publish
- Versionare automată; rollback din istorii

### Checklist reviewer
- Title/Desc ok, unice, fără trunchieri
- Hreflang 1:1, canonical corect
- OG/Twitter prezente
- Min 3 interlink‑uri contextuale
- CTA vizibil și funcțional

---

## `/docs/landing-b2b.md`

### Scop
Home/Landing B2B care poziționează EasyReserv ca platformă all‑in‑one și rutează vizitatorul către verticala potrivită.

### Structură blocuri (ordine)
1. **Hero** (headline + sub + CTA Trial/Demo + imagine)
2. **Social Proof** (logo-uri clienți, citat scurt)
3. **Industries Picker** (8 verticale principale)
4. **Features Grid** (4–8 beneficii)
5. **Integrations** (1C, plăți, imprimante, smartwatch etc.)
6. **Pricing Snippet** (Basic €50, Standard €125, Pro €200 → /pricing)
7. **FAQ** (5–7 întrebări BOFU)
8. **CTA Banner** (Demo/Trial)

### SEO pentru Landing
- Title: „EasyReserv — Platformă all‑in‑one pentru rezervări, POS, operațiuni și analitică”
- Description: „Automatizezi rezervările, POS, fluxurile operaționale și rapoartele. Integrezi plăți, contabilitate 1C, notificări și livrare — fără schimbare de hardware.”
- Schema: `SoftwareApplication` + `FAQPage`
- Hreflang: ro/ru/en + x‑default

### Conținut minim (copy)
- Headline: „Configurezi roluri, meniuri/servicii și pornești fluxurile în câteva ore”
- Subheadline: „Automatizări care reduc timpii și cresc conversiile. Dashboarduri în timp real. Integrare contabilitate, plăți și notificări — fără schimbare de hardware.”
- CTA: „Start Free Trial” / „Programează un demo”

---

## `/docs/seo-defaults.md`

### Defaults (aplicate implicit dacă pagina nu are setări)
- Title: generat din secțiune + brand (≤60)
- Description fallback per secțiune (140–160)
- Robots: `index,follow`
- OG/Twitter: `summary_large_image`, imagine fallback `/og-default.jpg`
- Canonical: absolut, format `{baseUrl}/{locale}/{slug}`
- Hreflang: ro/ru/en + x‑default
- Schema globală: `Organization`, `WebSite`, `BreadcrumbList`

### Fișier TS recomandat
Folosește `seo-defaults-easyreserv.ts` (helper pentru title, desc, canonical, hreflang, OG/Twitter, JSON‑LD, robots.txt, sitemap.xml).

---

## `/docs/content-model.md`

### Tipuri de pagini
- `home`, `pricing`, `industries`, `industry`, `feature`, `solutions`, `customers`, `case`, `blog`, `article`, `guides`, `calculators`, `help`, `about`, `contact`

### Schema Page (rezumat)
```ts
Page {
  id: string; route: string; locale: 'ro'|'ru'|'en'; slug: string;
  status: 'draft'|'published'; seo: Seo; content: { blocks: Block[] }
}
```

### Ancorare internă (interlinking)
- Fiecare `industry` trebuie să lege către: `/pricing`, 2× `feature`, 1× `case`, 2× articole din blog din clusterul verticalei
- `pricing` leagă către: `industries` + `contact`

---

## `/docs/routing-ia.md`

### IA navigație
- `/industries` → listă verticale
- Verticale (slug EN, copy localizat):
  - `/restaurants-pos-reservations`
  - `/beauty-salon-barbershop`
  - `/car-rental`
  - `/sports-tennis-padel-football`
  - `/car-wash`
  - `/fitness-gyms`
  - `/medical-clinics`
  - `/retail`

### Breadcrumbs
`Acasă > Industrii > {Industrie}`

### Redirecturi (exemple)
- 301: vechiul `/restaurant` → `/restaurants-pos-reservations`

---

## `/docs/qa-checklist.md`

### SEO & UX QA înainte de publish
- [ ] Title unic (≤60), Description 140–160
- [ ] Canonical corect; hreflang ro/ru/en + x‑default
- [ ] OG/Twitter valide + imagine 1200×630 <512KB
- [ ] Schema validă (`SoftwareApplication/Service/FAQPage` când e cazul)
- [ ] 3–5 interlink‑uri contextuale/pagină + breadcrumbs
- [ ] CTA vizibil, formular funcțional
- [ ] CWV: LCP<2.5s, INP<200ms, CLS<0.1

---

## `/docs/examples/home.ro.md`

### Meta
- **Title**: EasyReserv — Platformă all‑in‑one pentru rezervări, POS, operațiuni și analitică
- **Description**: Automatizezi rezervările, POS, fluxurile operaționale și rapoartele. Integrezi plăți, contabilitate 1C, notificări și livrare — fără schimbare de hardware.

### Blocuri (JSON)
```json
{
  "blocks": [
    { "type": "hero", "data": { "eyebrow": "All‑in‑one pentru rezervări, POS, operațiuni & analitică", "title": "Configurezi roluri, meniuri/servicii și pornești fluxurile în câteva ore", "sub": "Automatizări care reduc timpii și cresc conversiile. Dashboarduri în timp real. Integrare contabilitate, plăți și notificări — fără schimbare de hardware.", "ctaPrimary": {"label":"Start Free Trial","href":"/ro/pricing"}, "ctaSecondary": {"label":"Programează un demo","href":"/ro/contact"}, "image": "/hero-home.png" } },
    { "type": "socialProof", "data": { "logos": ["/logos/pegas.svg","/logos/steakhouse.svg"], "quote": "Am redus timpul de servire cu 22% în prima lună.", "author": "Manager restaurant" } },
    { "type": "industriesPicker", "data": { "items": [ {"label":"Restaurante","href":"/ro/restaurants-pos-reservations"}, {"label":"Saloane & Barbershop","href":"/ro/beauty-salon-barbershop"}, {"label":"Chirie auto","href":"/ro/car-rental"}, {"label":"Terenuri sportive","href":"/ro/sports-tennis-padel-football"} ] } },
    { "type": "featuresGrid", "data": { "items": [ {"icon":"kds","title":"POS & KDS integrat","text":"Comenzi sincronizate cu bucătăria și servirea."}, {"icon":"bell","title":"Notificări & SLA","text":"Alerte pentru timpii de preparare și livrare."}, {"icon":"chart","title":"Analytics","text":"Dashboarduri în timp real pe locație și perioadă."}, {"icon":"link","title":"Integrări","text":"Plăți, 1C, imprimante, smartwatch."} ] } },
    { "type": "pricingSnippet", "data": { "plans": [ {"name":"Basic","price":50,"currency":"EUR","cta":"/ro/pricing"}, {"name":"Standard","price":125,"currency":"EUR","cta":"/ro/pricing"}, {"name":"Pro","price":200,"currency":"EUR","cta":"/ro/pricing"} ] } },
    { "type": "faq", "data": { "items": [ {"q":"Cât durează onboarding-ul?","a":"De regulă 1–3 zile în funcție de industrie și integrare."}, {"q":"E compatibil cu hardware-ul meu?","a":"Da, în majoritatea cazurilor nu e nevoie să schimbi echipamentul."} ] } },
    { "type": "ctaBanner", "data": { "title":"Pregătit să începi?","sub":"Activează trialul sau programează un demo.", "cta":"/ro/pricing" } }
  ]
}
```

---

## `/docs/examples/pricing.ro.md`

### Meta
- **Title**: Prețuri & Planuri — EasyReserv
- **Description**: Planuri pentru restaurante de la €50/lună. Trial gratuit inclus. Alege Standard sau Pro pentru funcții avansate și suport prioritar.

### Conținut (secțiuni)
- Planuri: Basic (€50), Standard (€125), Pro (€200), Enterprise (Contact)
- Include: 2 utilizatori, Business Setup, Create Place, Reservations (toate planurile)
- CTA: „Start Free Trial”
- FAQ pricing (facturare, perioadă, upgrade/downgrade)

---

## `/docs/examples/industry.restaurants.ro.md`

### Meta
- **Title**: Restaurante: POS & Rezervări — EasyReserv
- **Description**: Reduce timpii de servire, sincronizează bucătăria, gestionează rezervările și vezi rapoarte în timp real. Integrare 1C, plăți și notificări automate.

### Secțiuni
- Hero (beneficiu principal + CTA)
- Probleme frecvente (latențe, erori comandă, no‑show)
- Soluții EasyReserv (KDS, notificări, smartwatch, rezervări omnichannel)
- ROI Calculator (micro‑widget) + studiu de caz scurt
- Integrare 1C, plăți, hardware existent
- CTA (Demo/Trial)

