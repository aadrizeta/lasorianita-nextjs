import Image from "next/image";

export default function EsenciaImage() {
    return (
        <div className="w-full max-w-lg relative">
            <div className="relative aspect-4/5 w-full overflow-hidden shadow-xl">
                {/* <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/18df92cd-f3aa-4a89-8520-2c61b267e1d1_1600w.jpg" alt="Pan rústico detalle" className="w-full h-full object-contain"/> */}
                <Image
                    src="/images/croissants-media-luna.webp"
                    alt="Croissants | La Sorianita"
                    width={384}
                    height={700}
                    loading="lazy"
                    sizes="(max-width: 768px) 90vw, (max-width: 1024px) 50vw, 512px"
                    className='block h-auto w-full object-cover shadow-2xl'
                />

                <div className="absolute bottom-0 right-0 bg-soria-red text-white p-8 pr-12 z-10 w-[80%] max-w-70">
                    <span className="block text-5xl font-script text-center mb-2">Madrid</span>
                    <span className="block text-[10px] text-white/80 tracking-[0.25em] font-sans text-center">NUESTRA ESENCIA</span>
                </div>
            </div>
        </div>
    );
}