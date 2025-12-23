import Image from "next/image";

export function Footer() {
    return (
        <footer className="w-full py-8 mt-auto border-t border-border/40 bg-background/20 backdrop-blur-md z-10 transition-all duration-300 hover:border-border/80">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6">
                <p className="text-xs md:text-sm font-mono text-muted-foreground tracking-wider uppercase">
                    &copy; {new Date().getFullYear()} All Rights Reserved
                </p>

                <div className="hidden md:block w-px h-4 bg-border" />

                <div className="relative h-10 w-28 opacity-70 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0">
                    <Image
                        src="/images/spirit-logo.png"
                        alt="Spirit Logo"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100px, 120px"
                    />
                </div>
            </div>
        </footer>
    );
}
