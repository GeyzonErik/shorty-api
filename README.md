# 🚀 Shorty-API

![shorty](https://github.com/user-attachments/assets/e2189402-6a31-48b4-b64f-b2aff8f762ed)

Encurtador de URLs simples, robusto e escalável. Permite encurtar links de forma pública ou autenticada, com controle de redirecionamento, contagem de acessos, histórico por usuário e muito mais.

> 🧪 [Acesse a documentação da API (Swagger)](https://shorty-api-7rqu.onrender.com/api/v1/docs)

---

## 📦 Tecnologias Utilizadas

- Node.js (última versão LTS)
- TypeScript
- Nest.Js
- PostgreSQL
- MikroORM
- JWT (Autenticação)
- Docker + Docker Compose
- Swagger (OpenAPI)
- Husky + Lint-Staged
- Testes com Jest
- Nodemailer

---

## 🖥️ Acesso à aplicação em produção

- **Base URL da API:**  
  `https://shorty-api-7rqu.onrender.com`

- **Exemplo de redirecionamento de link:**  
  `https://shorty-api-7rqu.onrender.com//RO7ses`  
  (irá redirecionar para a URL original cadastrada)

- **Documentação Swagger:**  
  [https://shorty-api-7rqu.onrender.com/api/v1/docs](https://shorty-api-7rqu.onrender.com/api/v1/docs)

---

## ⚙️ Como rodar localmente

```bash
git clone https://github.com/seu-usuario/Shorty-Api.git
cd Shorty-Api
cp .env.example .env

# Configure o .env com as credenciais corretas

# Rode com Docker
docker-compose up --build
```

---

## 🔐 Autenticação

- A autenticação é feita via **JWT Bearer Token**
- Após login (`/v1/auth/sign-in`), o sistema retorna um token que deve ser enviado no cabeçalho:

```bash
Authorization: Bearer {token}
```

Rotas como criação de link são públicas, mas se o token for enviado, o link será associado ao usuário autenticado
No Swagger, a cima de tudo, a um lugar reservado para colocar autenticar o token

---

## 📡 Principais Endpoints

### 🔐 Auth
- `POST /v1/auth/sign-up` – Criação de conta
- `POST /v1/auth/sign-in` – Login e geração de token JWT

### 📩 Confirmação de E-mail
- `GET /confirm-email?token=...` – Confirmação de e-mail via link enviado

### 👤 Usuário
- `PATCH /v1/users/me` – Atualização dos dados do usuário autenticado

### 🔗 URLs
- `POST /v1/urls` – Criação de URL encurtada (com ou sem autenticação)
- `GET /v1/urls` – Listar URLs encurtadas pelo usuário (com contagem de cliques)
- `PATCH /v1/urls/{id}` – Editar destino da URL
- `DELETE /v1/urls/{id}` – Exclusão lógica (soft delete)
- `PATCH /v1/urls/toggle/{id}` – Ativar/desativar uma URL

### 📥 Redirecionamento
- `GET /{slug}` – Redireciona para o link original e contabiliza o clique`

---

## 📁 Variáveis de Ambiente (`.env`)

```env
# Ambiente da aplicação (ex: development, production)
NODE_ENV=development

# === APP CONFIG ===
# Porta onde o servidor irá escutar
PORT=3000

# Base da URL encurtada (ex: http://localhost:3000 ou domínio de produção)
BASE_URL=http://localhost:3000

# === JWT CONFIG ===
# Chave secreta para geração dos tokens JWT
JWT_SECRET=uma-chave-super-secreta

# Tempo de expiração do token JWT (ex: 1d, 2h, 30m)
JWT_EXPIRATION_TIME=1d

# Chave secreta usada para confirmar e-mails
EMAIL_CONFIRMATION_SECRET=chave-confirmacao-email

# === DATABASE CONFIG ===
# Host do banco de dados (ex: localhost ou container do docker)
DB_HOST=localhost

# Porta do banco de dados (padrão PostgreSQL: 5432)
DB_PORT=5432

# Nome do banco de dados
DB_DATABASE=shorty

# Usuário do banco
DB_USER=usuario

# Senha do banco
DB_PASSWORD=senha

# === MAIL CONFIG ===
# E-mail que será usado para envio (SMTP)
MAIL_USER=seu@email.com

# === GOOGLE OAUTH CONFIG ===
# Usado para login social ou envio de e-mail via API Google
GOOGLE_CLIENT_ID=sua-google-client-id
GOOGLE_CLIENT_SECRET=sua-google-client-secret
GOOGLE_REFRESH_TOKEN=seu-refresh-token
```
