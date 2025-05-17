import Image from 'next/image';

export function AppLogo(props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt' | 'width' | 'height'>) {
  return (
    <Image
      src="/favicon.png"
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
