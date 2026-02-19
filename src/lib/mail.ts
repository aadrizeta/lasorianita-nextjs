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
  const config: nodemailer.TransportOptions = {
    host: process.env.SMTP_HOST || "localhost",
    port: Number(process.env.SMTP_PORT) || 25,
    secure: false,
    tls: { rejectUnauthorized: false },
  } as nodemailer.TransportOptions;

  // Si hay credenciales configuradas (ej. Brevo), añadir autenticación
  if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    (config as Record<string, unknown>).auth = {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    };
  }

  return nodemailer.createTransport(config);
}

const mailFrom = () => process.env.MAIL_FROM || "noreply@lasorianita.es";

// TODO: cambiar por el correo real de RRHH de La Sorianita antes de producción
const mailNotify = () => process.env.MAIL_NOTIFY || "adrian@onestarmusic.com";

// ---------------------------------------------------------------------------
// Correo al candidato: primera solicitud
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Correo al candidato: actualización de solicitud existente
// ---------------------------------------------------------------------------
export async function sendUpdateEmail(to: string, nombre: string) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"La Sorianita" <${mailFrom()}>`,
    to,
    subject: "Tu solicitud ha sido actualizada - La Sorianita",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h2 style="color: #6d1726;">Hola ${escapeHtml(nombre)},</h2>
        <p>Hemos actualizado correctamente tu solicitud de empleo con los nuevos datos que nos has proporcionado.</p>
        <p>Seguiremos valorando tu candidatura y nos pondremos en contacto contigo si tu perfil encaja con nuestras necesidades.</p>
        <br>
        <p style="color: #6d1726; font-style: italic;">La Sorianita - Obrador Artesanal</p>
        <p style="font-size: 12px; color: #666;">Este es un email automático, por favor no respondas a este mensaje.</p>
      </div>
    `,
  });
}

// ---------------------------------------------------------------------------
// Correo al candidato: solicitud rechazada (disparado desde el dashboard)
// ---------------------------------------------------------------------------
export async function sendRejectionEmail(to: string, nombre: string) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"La Sorianita" <${mailFrom()}>`,
    to,
    subject: "Sobre tu solicitud de empleo - La Sorianita",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h2 style="color: #6d1726;">Hola ${escapeHtml(nombre)},</h2>
        <p>Gracias por tu interés en formar parte de nuestro equipo y por el tiempo que dedicaste a enviarnos tu solicitud.</p>
        <p>Tras revisar tu candidatura, lamentamos comunicarte que en esta ocasión no hemos podido seleccionarte para el puesto.</p>
        <p>Te animamos a seguir en contacto con nosotros. Guardamos tu perfil por si surge una oportunidad que encaje mejor en el futuro.</p>
        <br>
        <p style="color: #6d1726; font-style: italic;">La Sorianita - Obrador Artesanal</p>
        <p style="font-size: 12px; color: #666;">Este es un email automático, por favor no respondas a este mensaje.</p>
      </div>
    `,
  });
}

// ---------------------------------------------------------------------------
// Correo a la empresa: nueva solicitud recibida
// ---------------------------------------------------------------------------
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
  const dashboardUrl = "https://empleo.lasorianita.es";

  await transporter.sendMail({
    from: `"La Sorianita Web" <${mailFrom()}>`,
    to: mailNotify(),
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
        <div style="margin-top: 24px;">
          <a href="${dashboardUrl}" style="background-color: #6d1726; color: white; padding: 12px 24px; text-decoration: none; font-family: sans-serif; font-size: 14px;">
            Ver solicitud en el dashboard
          </a>
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 20px;">Este es un email automático generado por lasorianita.es</p>
      </div>
    `,
  });
}
