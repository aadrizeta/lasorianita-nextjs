import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getDb } from "@/lib/db";
import { sendConfirmationEmail, sendNotificationEmail } from "@/lib/mail";
import {
  validateFields,
  validateFilesCount,
  checkMagicBytes,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE,
  MAX_FILES,
} from "@/lib/validation";

// Rate limiting: 3 submissions per hour per IP
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  rateLimitMap.set(ip, recent);
  return recent.length < RATE_LIMIT_MAX;
}

function recordRequest(ip: string) {
  const timestamps = rateLimitMap.get(ip) || [];
  timestamps.push(Date.now());
  rateLimitMap.set(ip, timestamps);
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

const DATA_DIR = process.env.DB_PATH
  ? path.dirname(process.env.DB_PATH)
  : path.join(process.cwd(), "data");

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Has enviado demasiadas solicitudes. Inténtalo más tarde." },
      { status: 429 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Datos del formulario inválidos." },
      { status: 400 },
    );
  }

  // Extract fields
  const nombre = (formData.get("nombre") as string)?.trim() || "";
  const apellidos = (formData.get("apellidos") as string)?.trim() || "";
  const email = (formData.get("email") as string)?.trim() || "";
  const telefono = (formData.get("telefono") as string)?.trim() || "";
  const fecha_nacimiento =
    (formData.get("fecha_nacimiento") as string)?.trim() || "";
  const actualizar = formData.get("actualizar") === "true";

  // Validate fields
  const fieldErrors = validateFields({
    nombre,
    apellidos,
    email,
    telefono,
    fecha_nacimiento,
  });
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ errors: fieldErrors }, { status: 400 });
  }

  // Check if email already exists
  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM solicitudes_empleo WHERE email = ?")
    .get(email) as { id: number } | undefined;

  if (existing && !actualizar) {
    return NextResponse.json(
      { code: "EMAIL_EXISTS" },
      { status: 409 },
    );
  }

  // Extract files
  const files = formData.getAll("archivos") as File[];
  const filesCountError = validateFilesCount(files.length);
  if (filesCountError) {
    return NextResponse.json(
      { errors: { archivos: filesCountError } },
      { status: 400 },
    );
  }

  // Validate and save each file
  const savedPaths: string[] = [];
  const now = new Date();
  const yearMonth = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
  const uploadDir = path.join(DATA_DIR, "uploads", yearMonth);

  await mkdir(uploadDir, { recursive: true });

  for (const file of files) {
    if (files.length > MAX_FILES) break;

    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { errors: { archivos: `Archivo "${file.name}": solo se permiten PDF y JPEG` } },
        { status: 400 },
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { errors: { archivos: `Archivo "${file.name}": tipo no permitido` } },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { errors: { archivos: `Archivo "${file.name}": máximo 5MB por archivo` } },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!checkMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        { errors: { archivos: `Archivo "${file.name}": contenido no coincide con el tipo declarado` } },
        { status: 400 },
      );
    }

    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString("hex");
    const safeName = `${timestamp}-${random}${ext}`;
    const filePath = path.join(uploadDir, safeName);
    const relativePath = path.join("uploads", yearMonth, safeName);

    await writeFile(filePath, buffer);
    savedPaths.push(relativePath);
  }

  // Insert or update
  try {
    if (existing && actualizar) {
      db.prepare(`
        UPDATE solicitudes_empleo
        SET nombre = ?, apellidos = ?, fecha_nacimiento = ?, telefono = ?, archivos = ?, ip_address = ?
        WHERE email = ?
      `).run(nombre, apellidos, fecha_nacimiento, telefono, JSON.stringify(savedPaths), ip, email);
    } else {
      db.prepare(`
        INSERT INTO solicitudes_empleo (nombre, apellidos, fecha_nacimiento, email, telefono, archivos, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(nombre, apellidos, fecha_nacimiento, email, telefono, JSON.stringify(savedPaths), ip);
    }
  } catch (err) {
    console.error("Error writing to database:", err);
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 },
    );
  }

  // Send emails (fire-and-forget)
  sendConfirmationEmail(email, nombre).catch((err) =>
    console.error("Error sending confirmation email:", err),
  );
  sendNotificationEmail({
    nombre,
    apellidos,
    email,
    telefono,
    fecha_nacimiento,
    archivos: savedPaths,
  }).catch((err) => console.error("Error sending notification email:", err));

  recordRequest(ip);

  const isUpdate = existing && actualizar;
  return NextResponse.json(
    { message: isUpdate ? "Solicitud actualizada correctamente." : "Solicitud enviada correctamente.", updated: !!isUpdate },
    { status: isUpdate ? 200 : 201 },
  );
}
