import Link from "next/link";
import Image from "next/image";

export default function IgLogo() {
    return (
        <Link className='md:hidden' href="https://www.instagram.com/pastelerialasorianita/" target="_blank">
            <Image src="/instagram-logo.svg" alt="Instagram Logo" width={35} height={35} />
        </Link>
    );
}