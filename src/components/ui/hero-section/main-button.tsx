import Link from "next/link";

export default function MainButton() {
    return (
        <Link href="/catalogo">
            <button className="main-button">EXPLORA NUESTRO CATÁLOGO</button>
        </Link>
    );
}