import InstagramGrid from '@/components/ui/siguenos/instagram-grid';

export default function Siguenos() {
  return (
    <section className="padding-responsive py-12 mt-15 md:mt-20">
      <div className="col-center mb-10">
        <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">Síguenos</h1>
        <p className="text-stone-500 text-sm tracking-wide">@pastelerialasorianita</p>
      </div>
      <InstagramGrid />
    </section>
  );
}
