# RottenBoxdbd

O **RottenBoxdbd** é uma plataforma full-stack inspirada no ecossistema do Letterboxd, projetada para a gestão de catálogos cinematográficos, registro de resenhas e acompanhamento de atividades personalizadas. O projeto aplica arquitetura assíncrona no backend com FastAPI e uma interface construída em React, Vite, TypeScript e TailwindCSS.

Desenvolvido por **luizfnogueira**.

---

## Diferenciais Técnicos e Arquitetura

### Arquitetura de Código e Organização

A estrutura do projeto adota uma separação clara de responsabilidades entre backend e frontend, facilitando a manutenção e expansão.

```text
rotten-boxd-db/
├── backend/
│   ├── app/
│   │   ├── api/          # Endpoints REST
│   │   ├── core/         # Configurações globais e inicialização de BD
│   │   ├── models/       # Entidades SQLAlchemy (Movie, Review)
│   │   ├── schemas/      # Validações estritas Pydantic
│   │   └── main.py       # Ponto de entrada FastAPI e middlewares CORS
│   └── tests/            # Testes
└── frontend/
    ├── src/
    │   ├── components/   # Componentes modulares
    │   ├── pages/        # Páginas principais da aplicação
    │   ├── services/     # Cliente HTTP
    │   └── types/        # Definições globais de interfaces TypeScript
    └── vite.config.ts    # Configurações do bundler
```

---

## Instruções de Execução

### Pré-requisitos

* Python 3.10+ instalado
* Node.js 18+ e npm instalados

---

### 1. Configurar e Subir o Backend (FastAPI)

Navegue até a pasta do backend, crie o ambiente virtual e instale as dependências:

```powershell
cd backend
python -m venv .venv

# Ativação no Windows (PowerShell)
.\.venv\Scripts\Activate.ps1

# Ativação no Linux/macOS
# source .venv/bin/activate

pip install -r requirements.txt
```

---

### 2. Popular o Banco de Dados (Carga Inicial / Seed)

Com o ambiente virtual ativo, execute a carga inicial dos dados para popular o banco SQLite local com filmes e metadados:

```powershell
python -m app.db.seed
```

Após a conclusão da carga, inicie o servidor backend:

```powershell
uvicorn app.main:app --reload
```

A API estará disponível em `http://localhost:8000` (documentação Swagger interativa ativa em `http://localhost:8000/docs`).

---

### 3. Configurar e Subir o Frontend (React / Vite)

Em um novo terminal, acesse a pasta do frontend, instale as dependências e inicie a aplicação:

```powershell
cd frontend
npm install
npm run dev
```

Acesse a aplicação no navegador em `http://localhost:5173`.
