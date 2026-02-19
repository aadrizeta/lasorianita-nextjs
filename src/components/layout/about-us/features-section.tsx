import Image from 'next/image';

export default function Features() {
  return (
    <section className="col-center md:gap-20 bg-soria-red py-10 lg:py-20 my-20">
      <h2 className='text-soria-cream md:text-8xl text-5xl tracking-tight font-serif mb-10 md:mb-0'>¿Por qué sabe tan bien?</h2>
      <div className="padding-responsive grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
        <div className='feature col-center'>
          <Image src="/icons/feature.svg" alt="alt" width={50} height={50} />
          <h3 className='text-2xl text-soria-cream font-light'>Productos de Origen</h3>
          <p className='feature-text'>Apostamos por lo nuestro. Materias primas nacionales seleccionadas para asegurar la máxima calidad y frescura en cada bocado.</p>
        </div>
        <div className='feature col-center'>
          <Image src="/icons/feature2.svg" alt="alt" width={50} height={50} />
          <h3 className='text-2xl text-soria-cream font-light'>Fermentación 24h</h3>
          <p className='feature-text'>Sin prisas ni acelerantes. Respetamos el reposo de un día entero para que las levaduras desarrollen todo el sabor y la textura.</p>
        </div>
        <div className='feature col-center'>
          <Image src="/icons/feature3.svg" alt="alt" width={50} height={50} />
          <h3 className='text-2xl text-soria-cream font-light'>Recién elaborado</h3>
          <p className='feature-text'>Calidad del día. No congelamos. Todo lo que ves en nuestras vitrinas ha salido del horno esta misma mañana.</p>
        </div>
      </div>
    </section>
  );
}