import Link from 'next/link'
import GoogleMaps from '@/components/ui/maps/google-maps';

function Location() {
  return (
    <section className="padding-responsive py-5">
      <div className="flex flex-col lg:flex-row gap-8 items-center lg:1/2">
        <Link href="https://maps.app.goo.gl/kgS8ws7K3dZqfHkM8" target="_blank">
          <p>Glorieta Sta. María de la Cabeza, 9, Arganzuela, 28045 Madrid</p>
        </Link>
        <GoogleMaps />
      </div>
    </section>
  )
}

export default Location
