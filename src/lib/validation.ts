export interface ValidationErrors {
  nombre?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  archivos?: string;
  privacidad?: string;
}

export interface FormFields {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+34\s?)?[6-9]\d{8}$/;
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg"];
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

function validateNombre(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "El nombre es obligatorio";
  if (trimmed.length < 2) return "El nombre debe tener al menos 2 caracteres";
  if (trimmed.length > 100) return "El nombre no puede superar los 100 caracteres";
}

function validateApellidos(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Los apellidos son obligatorios";
  if (trimmed.length < 2) return "Los apellidos deben tener al menos 2 caracteres";
  if (trimmed.length > 150) return "Los apellidos no pueden superar los 150 caracteres";
}

function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "El email es obligatorio";
  if (!EMAIL_REGEX.test(trimmed)) return "El email no es válido";
}

function validateTelefono(value: string): string | undefined {
  const trimmed = value.trim().replace(/\s/g, "");
  if (!trimmed) return "El teléfono es obligatorio";
  if (!PHONE_REGEX.test(trimmed)) return "Introduce un teléfono español válido (ej: 612345678)";
}

function validateFechaNacimiento(value: string): string | undefined {
  if (!value) return "La fecha de nacimiento es obligatoria";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "La fecha no es válida";

  const today = new Date();
  const minAge = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
  if (date > minAge) return "Debes tener al menos 16 años";

  const maxAge = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
  if (date < maxAge) return "La fecha de nacimiento no es válida";
}

export function validateField(name: keyof FormFields, value: string): string | undefined {
  switch (name) {
    case "nombre": return validateNombre(value);
    case "apellidos": return validateApellidos(value);
    case "email": return validateEmail(value);
    case "telefono": return validateTelefono(value);
    case "fecha_nacimiento": return validateFechaNacimiento(value);
  }
}

export function validateFields(fields: FormFields): ValidationErrors {
  const errors: ValidationErrors = {};
  for (const [key, value] of Object.entries(fields)) {
    const error = validateField(key as keyof FormFields, value);
    if (error) errors[key as keyof FormFields] = error;
  }
  return errors;
}

export function validateFileClient(file: File): string | undefined {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return "Solo se permiten archivos PDF y JPEG";
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return "Tipo de archivo no permitido";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "El archivo no puede superar los 5MB";
  }
}

export function validateFilesCount(count: number): string | undefined {
  if (count === 0) return "Debes adjuntar al menos un archivo";
  if (count > MAX_FILES) return `Máximo ${MAX_FILES} archivos permitidos`;
}

// Server-side magic bytes check
export function checkMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (mimeType === "application/pdf") {
    return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46; // %PDF
  }
  if (mimeType === "image/jpeg") {
    return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
  }
  return false;
}

export { ALLOWED_MIME_TYPES, ALLOWED_EXTENSIONS, MAX_FILE_SIZE, MAX_FILES };
