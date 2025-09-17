# mortgage_calculator
Going to create a new Project based on React and use the visual studio code as the IDE

Awesome—here’s a clean, production-minded project structure for a Mortgage Calculator with a React (Vite + TypeScript) frontend and a Python FastAPI backend. 
It’s tuned for speed, stability, and easy dev/CI/CD.

Tech choices (why these?)

Frontend: React + Vite (very fast dev server & builds), TypeScript, React Router, TanStack Query
 (resilient data fetching with caching/retries), Zustand (light state),
 Tailwind CSS + shadcn/ui (attractive, consistent UI), Error Boundaries, code-splitting & lazy routes.

Backend: FastAPI (fast, typed, great validation via Pydantic), Uvicorn (ASGI server), Poetry (reliable deps), pytest. Optional Redis cache if needed.

Quality & Stability: strict typing, request/response validation, global error handlers, timeouts, retries, health checks, CI workflow.

Shipping: Docker (multi-stage builds), docker-compose for local, Nginx for static + reverse proxy (optional).



Monorepo folder tree
mortgage-calculator/
├── README.md
├── .gitignore
├── .env.example
├── docker-compose.yml
├── infra/
│   ├── nginx/
│   │   ├── default.conf
│   │   └── Dockerfile
│   └── k8s/                # (optional) manifests for deployment
│       ├── frontend-deployment.yaml
│       ├── backend-deployment.yaml
│       └── ingress.yaml
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── postcss.config.cjs
│   ├── tailwind.config.ts
│   ├── src/
│   │   ├── main.tsx
│   │   ├── app/
│   │   │   ├── App.tsx
│   │   │   ├── routes.tsx
│   │   │   ├── error-boundary.tsx
│   │   │   └── queryClient.ts
│   │   ├── pages/
│   │   │   ├── Calculator.tsx
│   │   │   ├── Amortization.tsx
│   │   │   └── NotFound.tsx
│   │   ├── components/
│   │   │   ├── ui/          # shadcn generated components
│   │   │   ├── FormField.tsx
│   │   │   ├── NumberInput.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   └── Chart.tsx
│   │   ├── hooks/
│   │   │   └── useMortgage.ts
│   │   ├── store/
│   │   │   └── useCalcStore.ts
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── mortgage.ts
│   │   ├── lib/
│   │   │   ├── calc.ts      # client-side calc (for instant UX)
│   │   │   └── format.ts
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── assets/
│   └── public/
│       └── favicon.svg
├── backend/
│   ├── pyproject.toml
│   ├── poetry.lock
│   ├── Dockerfile
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── dependencies.py
│   │   ├── core/
│   │   │   ├── logging.py
│   │   │   └── errors.py
│   │   ├── models/          # (if you add DB later)
│   │   ├── schemas/
│   │   │   └── mortgage.py
│   │   ├── services/
│   │   │   └── mortgage_service.py
│   │   └── routers/
│   │       └── mortgage.py
│   └── tests/
│       ├── test_health.py
│       └── test_mortgage.py
└── .github/
    └── workflows/
        └── ci.yml
        
        
 -------------------
 
 to run the app --> npm run dev
