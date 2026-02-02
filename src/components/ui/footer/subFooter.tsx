import Link from "next/link";

export default function SubFooter() {
    return (
        <div className='padding-responsive flex justify-between items-center border-t border-white/10 text-xs text-white/40 font-sans py-10'>
            <Link href="/politica-de-privacidad" className="hover:text-white/70 transition-colors">POLÍTICA DE PRIVACIDAD</Link>
            <span>POWERED BY NEXTJS</span>
        </div>
    );
}
