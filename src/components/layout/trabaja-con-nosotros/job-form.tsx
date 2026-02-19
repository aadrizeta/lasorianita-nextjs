"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  validateField,
  validateFields,
  validateFileClient,
  validateFilesCount,
  type FormFields,
  type ValidationErrors,
} from "@/lib/validation";

export default function JobForm() {
  const [fields, setFields] = useState<FormFields>({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [files, setFiles] = useState<File[]>([]);
  const [privacidad, setPrivacidad] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name as keyof FormFields, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const incoming = Array.from(newFiles);
      const allFiles = [...files, ...incoming];

      const countError = validateFilesCount(allFiles.length);
      if (countError) {
        setErrors((prev) => ({ ...prev, archivos: countError }));
        return;
      }

      for (const file of incoming) {
        const fileError = validateFileClient(file);
        if (fileError) {
          setErrors((prev) => ({ ...prev, archivos: `${file.name}: ${fileError}` }));
          return;
        }
      }

      setFiles(allFiles);
      setErrors((prev) => ({ ...prev, archivos: undefined }));
    },
    [files]
  );

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => ({ ...prev, archivos: undefined }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    // Validate all fields
    const fieldErrors = validateFields(fields);
    const filesError = validateFilesCount(files.length);
    if (filesError) fieldErrors.archivos = filesError;
    if (!privacidad) fieldErrors.privacidad = "Debes aceptar la política de privacidad";

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("nombre", fields.nombre.trim());
    formData.append("apellidos", fields.apellidos.trim());
    formData.append("email", fields.email.trim());
    formData.append("telefono", fields.telefono.trim());
    formData.append("fecha_nacimiento", fields.fecha_nacimiento);
    for (const file of files) {
      formData.append("archivos", file);
    }

    try {
      const res = await fetch("/api/solicitud-empleo", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setServerError(data.error || "Error al enviar la solicitud.");
        }
        return;
      }

      setSuccess(true);
    } catch {
      setServerError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-3xl text-stone-900 mb-4">Solicitud enviada</h2>
        <p className="text-stone-600 font-sans max-w-md mx-auto leading-relaxed">
          Hemos recibido tu solicitud correctamente. Revisaremos tu candidatura y nos pondremos
          en contacto contigo si tu perfil encaja con nuestras necesidades.
        </p>
        <p className="text-stone-500 font-sans text-sm mt-4">
          Recibirás un email de confirmación en breve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="form-label">Nombre *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={fields.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
            placeholder="Tu nombre"
          />
          {errors.nombre && <p className="form-error">{errors.nombre}</p>}
        </div>

        {/* Apellidos */}
        <div>
          <label htmlFor="apellidos" className="form-label">Apellidos *</label>
          <input
            type="text"
            id="apellidos"
            name="apellidos"
            value={fields.apellidos}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
            placeholder="Tus apellidos"
          />
          {errors.apellidos && <p className="form-error">{errors.apellidos}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="form-label">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={fields.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
            placeholder="tu@email.com"
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="telefono" className="form-label">Teléfono *</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={fields.telefono}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
            placeholder="612 345 678"
          />
          {errors.telefono && <p className="form-error">{errors.telefono}</p>}
        </div>

        {/* Fecha nacimiento */}
        <div className="md:col-span-2 max-w-xs">
          <label htmlFor="fecha_nacimiento" className="form-label">Fecha de nacimiento *</label>
          <input
            type="date"
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            value={fields.fecha_nacimiento}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
          />
          {errors.fecha_nacimiento && <p className="form-error">{errors.fecha_nacimiento}</p>}
        </div>
      </div>

      {/* File upload */}
      <div className="mt-6">
        <label className="form-label">Documentos adjuntos * <span className="text-stone-400 font-normal">(CV, carta de presentación...)</span></label>
        <div
          className={`mt-1 border-2 border-dashed rounded-sm p-6 text-center transition-colors cursor-pointer ${dragOver ? "border-soria-red bg-soria-red/5" : "border-stone-300 hover:border-stone-400"
            }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <svg className="mx-auto h-10 w-10 text-stone-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
          </svg>
          <p className="text-sm text-stone-600">
            Arrastra archivos aquí o <span className="text-soria-red font-medium">haz clic para seleccionar</span>
          </p>
          <p className="text-xs text-stone-400 mt-1">PDF o JPEG, máximo 5MB por archivo, hasta 5 archivos</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
        </div>
        {errors.archivos && <p className="form-error">{errors.archivos}</p>}

        {/* File list */}
        {files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {files.map((file, i) => (
              <li key={`${file.name}-${i}`} className="flex items-center justify-between bg-stone-50 px-3 py-2 rounded-sm text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <svg className="h-4 w-4 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span className="truncate text-stone-700">{file.name}</span>
                  <span className="text-stone-400 text-xs shrink-0">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-stone-400 hover:text-red-600 transition-colors ml-2 shrink-0 cursor-pointer"
                  aria-label={`Eliminar ${file.name}`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Privacy checkbox */}
      <div className="mt-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={privacidad}
            onChange={(e) => {
              setPrivacidad(e.target.checked);
              if (e.target.checked) setErrors((prev) => ({ ...prev, privacidad: undefined }));
            }}
            className="mt-0.5 h-4 w-4 accent-soria-red cursor-pointer"
          />
          <span className="text-sm text-stone-600 font-sans">
            He leído y acepto la{" "}
            <Link href="/politica-de-privacidad" target="_blank" className="text-soria-red underline hover:text-red-800">
              política de privacidad
            </Link>{" "}
            *
          </span>
        </label>
        {errors.privacidad && <p className="form-error">{errors.privacidad}</p>}
      </div>

      {/* Server error */}
      {serverError && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-sm px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Submit */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={submitting}
          className="bg-soria-red text-white font-sans font-medium px-8 py-3 text-sm tracking-wide
            hover:bg-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {submitting ? "Enviando..." : "Enviar solicitud"}
        </button>
      </div>
    </form>
  );
}
