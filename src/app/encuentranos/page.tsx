import Location from "@/components/layout/location-section/location-section"
import Image from "next/image"

function Encuentranos() {
  return (
    <>
      <div className="mt-20 relative w-full aspect-video max-h-[60vh]">
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out`}
        >
          <Image
            src="/images/banner-mostrador.webp"
            alt="Banner mostrador"
            fill
            className="object-cover object-center"
            sizes="100vw"
            quality={85}
          />
        </div>
      </div>
      <Location />
    </>
  )
}

export default Encuentranos
