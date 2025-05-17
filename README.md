# 💡 CodeMentor – Next.js + Genkit + Gemini API

**CodeMentor** é um projeto desenvolvido por **Giulia Vieira** durante a **Imersão IA da Alura em parceria com o Google**.  
Ele explora o uso da **API Gemini (Google AI)** em conjunto com o **Firebase Studio**, criando um assistente de programação que age como um mentor técnico, ajudando usuários a entender e depurar seu código com o apoio de IA generativa.

---

## 🧠 Sobre o Projeto

**CodeMentor** é seu mentor pessoal de programação — um assistente inteligente que te ajuda a identificar e compreender erros no seu código como se estivesse conversando com um desenvolvedor sênior.

Você pode colar seu código e descrever o problema:  
Seja uma mensagem de erro confusa ou uma lógica que não funciona como esperado, o **CodeMentor** irá:

- Analisar o trecho de código
- Identificar possíveis causas do erro
- Oferecer explicações e dicas para correção (sem entregar a solução diretamente)

> **Ele não te dá a resposta — te ajuda a pensar como um dev que encontra.**

---

## ⚙️ Tecnologias Utilizadas

- [**Next.js 15**](https://nextjs.org/) com Turbopack
- [**Genkit**](https://ai.google.dev/genkit) + [**Gemini API (Google AI)**](https://ai.google.dev/)
- [**Tailwind CSS**](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
- [**Firebase Studio**](https://firebase.google.com/studio) – plataforma visual do Google para criação de apps com IA generativa
- [TypeScript](https://www.typescriptlang.org/)
- [Zod](https://github.com/colinhacks/zod) para validação

---

## 🚀 Como Rodar o Projeto Localmente

1. **Clone este repositório**

2. **Crie um arquivo `.env` com sua chave da API do Gemini**  
   (Veja o exemplo em `.env.example`)

3. **Instale as dependências:**

```bash
npm install
```

4. **Inicie o servidor Next.js (porta 9002):**

```bash
npm run dev
```

5. **Em outro terminal, inicie o servidor do Genkit:**

```bash
npm run genkit:dev
```

6. **Acesse em seu navegador:**

- App: [http://localhost:9002](http://localhost:9002)  
- Genkit: [http://localhost:3400](http://localhost:3400) (ou a porta padrão configurada)

---

## 📄 Licença

Este projeto é aberto, com fins educacionais, criado durante a **Imersão IA Alura + Google**.  
Sinta-se à vontade para estudar, adaptar ou evoluir a ideia.
