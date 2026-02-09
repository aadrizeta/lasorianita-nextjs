import SubFooter from '@/components/ui/footer/subFooter';
import MainFooter from '@/components/ui/footer/MainFooter';
import BottomTricker from '@/components/ui/footer/bottomTricker';

export default function Footer() {
    return (
        <footer className='bg-soria-red border-t border-white/10'>

            <BottomTricker />
            <MainFooter />
            <SubFooter />
        </footer>
    );
}