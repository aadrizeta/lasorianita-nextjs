import nodemailer from "nodemailer";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "localhost",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    tls: { rejectUnauthorized: false },
  });
}

const mailFrom = () => process.env.MAIL_FROM || "noreply@lasorianita.es";

export async function sendConfirmationEmail(to: string, nombre: string) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"La Sorianita" <${mailFrom()}>`,
    to,
    subject: "Hemos recibido tu solicitud - La Sorianita",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h2 style="color: #6d1726;">Hola ${escapeHtml(nombre)},</h2>
        <p>Hemos recibido correctamente tu solicitud de empleo.</p>
        <p>Revisaremos tu candidatura y nos pondremos en contacto contigo si tu perfil encaja con nuestras necesidades.</p>
        <p>Gracias por tu interés en formar parte de La Sorianita.</p>
        <br>
        <p style="color: #6d1726; font-style: italic;">La Sorianita - Obrador Artesanal</p>
        <p style="font-size: 12px; color: #666;">Este es un email automático, por favor no respondas a este mensaje.</p>
      </div>
    `,
  });
}

interface SolicitudData {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  archivos: string[];
}

export async function sendNotificationEmail(data: SolicitudData) {
  const transporter = getTransporter();
  const notifyTo = process.env.MAIL_NOTIFY || "info@lasorianita.es";

  await transporter.sendMail({
    from: `"La Sorianita Web" <${mailFrom()}>`,
    to: notifyTo,
    subject: `Nueva solicitud de empleo - ${data.nombre} ${data.apellidos}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h2 style="color: #6d1726;">Nueva solicitud de empleo</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold;">Nombre:</td><td style="padding: 8px;">${escapeHtml(data.nombre)}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Apellidos:</td><td style="padding: 8px;">${escapeHtml(data.apellidos)}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${escapeHtml(data.email)}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Teléfono:</td><td style="padding: 8px;">${escapeHtml(data.telefono)}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Fecha nacimiento:</td><td style="padding: 8px;">${escapeHtml(data.fecha_nacimiento)}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Archivos:</td><td style="padding: 8px;">${data.archivos.length} archivo(s) adjunto(s)</td></tr>
        </table>
        <p style="font-size: 12px; color: #666; margin-top: 20px;">Puedes consultar los archivos adjuntos en el servidor.</p>
      </div>
    `,
  });
}
