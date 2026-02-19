import type { Metadata } from "next";
import JobForm from "@/components/layout/trabaja-con-nosotros/job-form";

export const metadata: Metadata = {
  title: "Trabaja con nosotros | La Sorianita",
  description:
    "¿Quieres formar parte de La Sorianita? Envíanos tu solicitud de empleo. Buscamos personas apasionadas por la pastelería artesanal.",
  openGraph: {
    title: "Trabaja con nosotros | La Sorianita",
    description:
      "¿Quieres formar parte de La Sorianita? Envíanos tu solicitud de empleo.",
    url: "https://lasorianita.es/trabaja-con-nosotros",
  },
};

export default function TrabajaConNosotrosPage() {
  return (
    <main className="padding-responsive py-16 mt-15 md:mt-20 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">Trabaja con nosotros</h1>
        <p className="text-stone-600 font-sans max-w-xl mx-auto leading-relaxed">
          ¿Te gustaría formar parte de nuestro equipo? Rellena el siguiente formulario
          y adjunta tu documentación. Nos pondremos en contacto contigo.
        </p>
      </div>
      <JobForm />
    </main>
  );
}
