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
