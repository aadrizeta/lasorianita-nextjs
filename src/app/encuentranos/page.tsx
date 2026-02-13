import Location from "@/components/layout/location-section/location-section"
import Image from "next/image"
import ScrollStrip from "@/components/ui/scroll-main/scroll-strip"

function Encuentranos() {
  return (
    <>
      <div className="mt-20 relative w-full aspect-video max-h-[70vh]">
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out`}
        >
          <Image
            src="/images/tarta-de-frutas.webp"
            alt="Banner mostrador"
            fill
            className="object-cover object-[50%_75%]"
            sizes="100vw"
            quality={85}
          />
        </div>
      </div>
      <ScrollStrip />
      <Location />
    </>
  )
}

export default Encuentranos
