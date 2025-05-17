import Image from 'next/image';
import favicon from '@/app/favicon.png'; // Ajuste conforme seu alias de importação

export function AppLogo(props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt' | 'width' | 'height'>) {
  return (
    <Image
      src={favicon}
      alt="CodeMentor Logo"
      width={32}
      height={32}
      style={{
        filter: 'invert(20%) sepia(39%) saturate(7450%) hue-rotate(330deg) brightness(92%) contrast(101%)'
      }}      
      {...props}
    />
  );
}
