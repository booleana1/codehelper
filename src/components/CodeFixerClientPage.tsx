
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, Loader2, Wand2, MessageSquareWarning, Lightbulb, ListChecks, ArrowRight, Sparkles, HelpCircle, Brain } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { getMentorAdvice, type GetMentorAdviceInput, type GetMentorAdviceOutput } from '@/ai/flows/developer-mentor-flow';

// Helper for inline formatting (bold, code, links)
const processInlineFormatting = (text: string, baseKey: string): (string | JSX.Element)[] => {
  // Regex to find **bold**, `code`, or [link text](url)
  // Ensures that the URL part of the link does not greedily consume trailing parentheses if they are part of the surrounding text.
  const inlinePattern = /(\*\*.*?\*\*|\`.*?\`|\[[^\]]+?\]\((?:[^\s\(\)]|(?:\([^\s\(\)]*\)))+\))/g;
  const parts = text.split(inlinePattern).filter(Boolean); 

  return parts.map((part, index) => {
    const key = `${baseKey}-part-${index}`;
    // Check for **bold**
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{part.substring(2, part.length - 2)}</strong>;
    }
    // Check for `code`
    if (part.startsWith('\`') && part.endsWith('\`')) {
      return <code key={key} className="bg-muted px-1 py-0.5 rounded font-mono text-sm text-foreground/80">{part.substring(1, part.length - 1)}</code>;
    }
    // Check for [link text](url)
    const linkMatch = part.match(/\[([^\]]+?)\]\((.*?)\)/);
    if (linkMatch && linkMatch.length === 3) {
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];
      let processedUrl = linkUrl;
      // Prepend https:// if no scheme is present and it's not a relative/anchor link
      if (!/^(\/|#|mailto:|tel:|https?:|ftp:)/i.test(linkUrl)) {
         processedUrl = `https://${linkUrl}`;
      }
      return <a key={key} href={processedUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">{linkText}</a>;
    }
    // Otherwise, it's plain text
    return part;
  });
};

// Main renderer for blocks of text from AI
const renderFormattedText = (text: string | undefined) => {
  if (!text) return null;
  
  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    const baseKey = `line-${lineIndex}`;
    // Handle Headings (e.g., ## My Heading)
    if (line.startsWith('## ')) {
      const headingText = line.substring(3);
      return (
        <h2 key={baseKey} className="text-xl font-semibold mt-4 mb-2 text-primary">
          {processInlineFormatting(headingText, `${baseKey}-heading`)}
        </h2>
      );
    }
    
    // Handle List Items (e.g., - item or * item)
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const itemText = line.substring(2);
      return (
        <div key={baseKey} className="mb-1 flex items-start">
          <span className="mr-2 mt-1 text-primary">&bull;</span>
          <p className="text-foreground/90">
            {processInlineFormatting(itemText, `${baseKey}-content`)}
          </p>
        </div>
      );
    }

    // Handle regular paragraph lines
    // If line is empty, render a small break, otherwise process for inline.
    if (line.trim() === '') {
        return <div key={baseKey} className="h-2"></div>; // Represents a small vertical space for empty lines
    }
    return (
      <p key={baseKey} className="whitespace-pre-wrap mb-2 text-foreground/90 leading-relaxed">
        {processInlineFormatting(line, `${baseKey}-content`)}
      </p>
    );
  });
};


export function CodeFixerClientPage() {
  const [userInput, setUserInput] = useState<string>('');
  const [currentAnalysis, setCurrentAnalysis] = useState<GetMentorAdviceOutput | null>(null);

  const { toast } = useToast();

  const aiMutation = useMutation<GetMentorAdviceOutput, Error, GetMentorAdviceInput>({
    mutationFn: getMentorAdvice,
    onSuccess: (data) => {
      setCurrentAnalysis(data);
      toast({
        title: "Mentoria Pronta",
        description: "A IA forneceu orientação.",
        variant: "default",
        action: <CheckCircle2 className="text-green-500" />,
      });
    },
    onError: (error) => {
      toast({
        title: "Falha na Mentoria",
        description: error.message || "Não foi possível obter conselho da IA.",
        variant: "destructive",
      });
      setCurrentAnalysis(null);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) {
      toast({
        title: "Entrada Faltando",
        description: "Por favor, descreva seu problema ou pergunta.",
        variant: "destructive",
      });
      return;
    }
    aiMutation.mutate({ userInput });
  };
  
  const showInitialAlerts = !aiMutation.isPending && !currentAnalysis;

  return (
    <div className="grid md:grid-cols-2 gap-8 h-[80vh]">
      <Card className="shadow-lg flex flex-col min-h-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-7 w-7 text-primary" />
            Pergunte ao CodeMentor
          </CardTitle>
          <CardDescription>
            Seu mentor de programação pessoal para ajudar a entender código e carreira.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col min-h-0">
            <div className="space-y-2 flex-1 flex flex-col min-h-0">
              <Label htmlFor="user-input" className="text-lg">Explique seu problema ou dúvida.</Label>
              <Textarea
                id="user-input"
                placeholder="Ex: 'Por que este loop Python não está saindo?' ou 'Quais os próximos passos na minha carreira?'"
                value={userInput}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setUserInput(e.target.value)}
                className="min-h-[250px] flex-1 font-mono text-sm bg-background/50 border-input focus:border-primary"
                required
              />
            </div>
            <Button type="submit" className="w-full text-lg py-6" disabled={aiMutation.isPending}>
              {aiMutation.isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-5 w-5" />
              )}
              Obter Conselho
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-lg flex flex-col min-h-0">
        <CardHeader>
            {currentAnalysis && currentAnalysis.responseType === "general_mentorship" ? (
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Brain className="h-7 w-7 text-primary" />
                    Conselho do Mentor
                </CardTitle>
            ) : (
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Lightbulb className="h-7 w-7 text-primary" />
                    Análise
                </CardTitle>
            )}
        </CardHeader>
        <ScrollArea className="flex-1 min-h-0"> 
          <CardContent className="p-6 pt-2">
            {aiMutation.isPending && (
              <div className="flex flex-col items-center justify-center h-full space-y-4 py-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg text-muted-foreground">Pensando, por favor aguarde...</p>
              </div>
            )}
            
            {showInitialAlerts && (
              <>
                <Alert variant="default" className="border-primary/50">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <AlertTitle className="font-semibold">Pronto para Ajudar!</AlertTitle>
                  <AlertDescription>
                    Faça sua pergunta ou envie seu código para obter mentoria da IA. A análise aparecerá aqui.
                  </AlertDescription>
                </Alert>
                <Alert variant="default" className="mt-4 border-primary/50">
                  <HelpCircle className="h-5 w-5 text-primary/80" />
                  <AlertTitle className="font-semibold">Como Usar o CodeMentor</AlertTitle>
                  <AlertDescription>
                    Faça perguntas, explore dúvidas e aprenda através de cada interação.{' '}
                    <strong>CodeMentor não te dá a resposta — ele te ajuda a pensar como um desenvolvedor que a encontra.</strong>
                  </AlertDescription>
                </Alert>
              </>
            )}

            {currentAnalysis && currentAnalysis.responseType === "general_mentorship" && currentAnalysis.mentorshipResponse && (
              <div className="space-y-4">
                <div className="text-foreground/90 leading-relaxed">
                  {renderFormattedText(currentAnalysis.mentorshipResponse)}
                </div>
              </div>
            )}

            {currentAnalysis && currentAnalysis.responseType === "code_analysis" && (
              <div className="space-y-6">
                {currentAnalysis.explanation && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-primary">
                      <MessageSquareWarning className="h-6 w-6" /> Explicação
                    </h3>
                    <div className="text-foreground/90 leading-relaxed">
                        {renderFormattedText(currentAnalysis.explanation)}
                    </div>
                  </div>
                )}
                {currentAnalysis.explanation && currentAnalysis.guidance && <Separator />}
                {currentAnalysis.guidance && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-primary">
                      <ListChecks className="h-6 w-6" /> Orientação
                    </h3>
                    <div className="text-foreground/90 leading-relaxed">
                      {currentAnalysis.guidance.split(/\\n|\n/).map((step, index) => {
                        const trimmedStep = step.trim();
                        if (!trimmedStep) return <div key={index} className="h-2"></div>; // Small break for empty lines
                        
                        // If guidance itself contains list markers or headings, renderFormattedText will handle them as a block
                        if (trimmedStep.startsWith('- ') || trimmedStep.startsWith('* ') || trimmedStep.startsWith('## ')) {
                            const formattedBlock = renderFormattedText(trimmedStep);
                            return <div key={index}>{formattedBlock ? formattedBlock[0] : null}</div>;
                        }
                        // Otherwise, treat as a step with an arrow, apply inline formatting
                        return (
                          <div key={index} className={`mb-1 flex items-start`}>
                            <ArrowRight className="h-4 w-4 mr-2 mt-1 shrink-0 text-primary/70"/>
                            <span className="text-foreground/90 leading-relaxed">
                              {processInlineFormatting(trimmedStep, `guidance-step-${index}`)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {currentAnalysis.guidance && currentAnalysis.tip && <Separator />}
                {currentAnalysis.tip && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-primary">
                      <Lightbulb className="h-6 w-6" /> Dica
                    </h3>
                    <div className="text-foreground/90 leading-relaxed">
                        {renderFormattedText(currentAnalysis.tip)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
