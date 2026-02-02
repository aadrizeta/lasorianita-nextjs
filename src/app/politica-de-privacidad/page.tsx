import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | La Sorianita",
  description: "Política de privacidad del obrador artesanal La Sorianita.",
};

export default function PoliticaDePrivacidad() {
  return (
    <>
      <section className="padding-responsive py-16 md:py-24 bg-background">
        <h1 className="text-4xl md:text-5xl text-soria-red mb-12">Política de Privacidad</h1>

        <div className="max-w-3xl space-y-8 text-stone-600 font-sans leading-relaxed">
          <div>
            <h2 className="text-xl text-stone-900 mb-3">1. Responsable del tratamiento</h2>
            <p>
              <strong>La Sorianita, Obrador Artesanal</strong><br />
              CIF: B12345678 (ejemplo)<br />
              Domicilio: Madrid, España<br />
              Correo electrónico: <a href="mailto:info@lasorianita.es" className="text-soria-red hover:underline">info@lasorianita.es</a><br />
              Teléfono: <a href="tel:+34605467989" className="text-soria-red hover:underline">+34 605 467 989</a>
            </p>
          </div>

          <div>
            <h2 className="text-xl text-stone-900 mb-3">2. Datos que recopilamos</h2>
            <p>
              A través de este sitio web podemos recopilar los siguientes datos personales
              cuando el usuario los facilita voluntariamente mediante formularios de contacto
              o comunicaciones por correo electrónico:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Nombre y apellidos</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Cualquier información adicional que el usuario decida compartir</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-stone-900 mb-3">3. Finalidad del tratamiento</h2>
            <p>Los datos personales recogidos serán tratados con las siguientes finalidades:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Responder a consultas y solicitudes de información sobre nuestros productos artesanales.</li>
              <li>Gestionar encargos y pedidos de nuestros productos de obrador.</li>
              <li>Enviar comunicaciones comerciales sobre novedades y productos de temporada, únicamente si el usuario ha dado su consentimiento expreso.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-stone-900 mb-3">4. Base legal</h2>
            <p>
              El tratamiento de sus datos se fundamenta en el consentimiento otorgado por
              el usuario al facilitar sus datos a través de los canales de contacto
              habilitados, así como en el interés legítimo para la gestión de pedidos y
              la relación comercial.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-stone-900 mb-3">5. Conservación de los datos</h2>
            <p>
              Los datos personales se conservarán mientras se mantenga la relación comercial
              o durante el tiempo necesario para cumplir con las obligaciones legales
              aplicables. Una vez finalizada la relación, los datos se eliminarán de forma
              segura.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-stone-900 mb-3">6. Derechos del usuario</h2>
            <p>
              El usuario puede ejercer en cualquier momento sus derechos de acceso,
              rectificación, supresión, oposición, limitación del tratamiento y
              portabilidad de los datos dirigiéndose a{" "}
              <a href="mailto:info@lasorianita.es" className="text-soria-red hover:underline">info@lasorianita.es</a>.
            </p>
            <p className="mt-2">
              Asimismo, tiene derecho a presentar una reclamación ante la Agencia
              Española de Protección de Datos (AEPD) si considera que el tratamiento
              de sus datos no se ajusta a la normativa vigente.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-stone-900 mb-3">7. Cookies</h2>
            <p>
              Este sitio web utiliza únicamente cookies técnicas necesarias para su
              correcto funcionamiento. No se utilizan cookies de seguimiento ni de
              publicidad de terceros.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-stone-900 mb-3">8. Modificaciones</h2>
            <p>
              La Sorianita se reserva el derecho de modificar la presente política de
              privacidad para adaptarla a novedades legislativas o jurisprudenciales.
              En caso de cambios significativos, se informará a los usuarios a través
              de este sitio web.
            </p>
          </div>

          <p className="text-sm text-stone-400 pt-4 border-t border-stone-200">
            Última actualización: febrero 2025
          </p>
        </div>
      </section>
    </>
  );
}
