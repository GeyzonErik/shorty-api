export function emailConfirmedPageTemplate(): string {
  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Email confirmado com sucesso</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #f4f6f8;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          text-align: center;
          max-width: 500px;
        }
        .logo {
          margin-bottom: 20px;
        }
        .logo img {
          height: 40px;
        }
        .title {
          color: #073b4c;
          margin-bottom: 10px;
        }
        .message {
          font-size: 16px;
          margin-bottom: 30px;
        }
        .link {
          background-color: #118ab2;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          font-size: 15px;
        }
        .link:hover {
          background-color: #0e7aa2;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="https://via.placeholder.com/120x40?text=Shorty" alt="Logo" />
        </div>
        <h1 class="title">Email confirmado com sucesso!</h1>
        <p class="message">Sua conta foi ativada. Agora você pode utilizar a API normalmente.</p>
        <a class="link" href="http://localhost:${process.env.PORT}/api/v1/docs">Ir para a documentação da API</a>
      </div>
    </body>
  </html>
  `;
}
