/**
 * Mapa de la tienda mediante el embebido de Google Maps.
 *
 * Sustituye a la integración anterior con la JS API (@googlemaps/js-api-loader),
 * que exigía clave de API y `mapId` propagados hasta el build de Docker. El
 * embebido no necesita credenciales, se renderiza en servidor y carga en
 * diferido, así que no bloquea la interacción de la página.
 */

/** URL del embebido generada desde la ficha de Google Business. */
const URL_EMBEBIDO =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3038.386316726973!2d-3.7026179343444126!3d40.40029190482138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422633b5666fb7%3A0xd5c223a0cc978d43!2sPanader%C3%ADa%20La%20Sorianita!5e0!3m2!1ses!2ses!4v1789933611526!5m2!1ses!2ses';

function GoogleMaps() {
  return (
    <div className="w-full h-100 lg:h-150 rounded-2xl drop-shadow-xl overflow-hidden">
      <iframe
        src={URL_EMBEBIDO}
        // Un iframe necesita nombre accesible: sin él, un lector de pantalla
        // sólo anuncia "marco".
        title="Mapa de situación de Panadería La Sorianita"
        className="w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

export default GoogleMaps;
