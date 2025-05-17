
import Link from 'next/link';
import { AppLogo } from './icons/AppLogo';

export function Header() {
  return (
    <header className="py-4 px-4 md:px-8 border-b border-border/50">
      <Link href="/" passHref legacyBehavior>
        <a className="container mx-auto flex items-center gap-3 no-underline hover:opacity-80 transition-opacity">
          <AppLogo className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-primary">CodeMentor</h1>
        </a>
      </Link>
    </header>
  );
}
