import '@/app/globals.css';
import SubFooter from '@/components/ui/footer/subFooter';
import MainFooter from '@/components/ui/footer/MainFooter';

export default function Footer() {
    return (
        <footer className='bg-soria-red border-t border-white/10'>
            <MainFooter />
            <SubFooter />
        </footer>
    );
}