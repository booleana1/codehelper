
import { Header } from '@/components/Header';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const CodeFixerClientPage = dynamic(() => 
  import('@/components/CodeFixerClientPage').then(mod => mod.CodeFixerClientPage), 
  { 
    loading: () => (
      <div className="flex justify-center items-center h-64 pt-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-lg text-muted-foreground">Carregando CodeMentor...</p>
      </div>
    )
  }
);

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <CodeFixerClientPage />
      </main>
      <footer className="py-4 text-center text-muted-foreground text-sm border-t border-border/50">
        Desenvolvido com IA. CodeMentor ajuda você a pensar como um desenvolvedor.
      </footer>
    </div>
  );
}
