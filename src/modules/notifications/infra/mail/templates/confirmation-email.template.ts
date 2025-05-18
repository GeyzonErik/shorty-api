// src/notifications/infra/templates/confirmation-email.template.ts

export function confirmationEmailTemplate(
  userName: string,
  confirmationLink: string,
) {
  return `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f5f8fa; padding: 40px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background-color: #073b4c; padding: 20px; text-align: center;">
        <img src="https://via.placeholder.com/120x40?text=LOGO" alt="Logo" style="height: 40px;" />
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #073b4c;">Olá, ${userName}!</h2>
        <p style="font-size: 16px; color: #333;">Estamos quase lá! Clique no botão abaixo para confirmar seu e-mail e ativar sua conta:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationLink}" style="background-color: #118ab2; color: white; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; font-size: 16px;">
            Confirmar E-mail
          </a>
        </div>
        <p style="font-size: 14px; color: #999;">Se você não criou essa conta, pode ignorar este e-mail.</p>
      </div>
      <div style="background-color: #f0f0f0; text-align: center; font-size: 12px; padding: 20px; color: #999;">
        © ${new Date().getFullYear()} Seu App. Todos os direitos reservados.
      </div>
    </div>
  </div>
  `;
}
