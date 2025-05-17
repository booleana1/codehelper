
'use server';
/**
 * @fileOverview An AI agent acting as a developer mentor.
 *
 * - getMentorAdvice - A function that provides mentorship on coding problems or questions.
 * - GetMentorAdviceInput - The input type for the getMentorAdvice function.
 * - GetMentorAdviceOutput - The return type for the getMentorAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetMentorAdviceInputSchema = z.object({
  userInput: z.string().describe('The user\'s code snippet, error message, programming question, or problem description.'),
});
export type GetMentorAdviceInput = z.infer<typeof GetMentorAdviceInputSchema>;

const GetMentorAdviceOutputSchema = z.object({
  responseType: z.enum(["code_analysis", "general_mentorship"]).describe("The type of response generated: 'code_analysis' for technical/code problems, 'general_mentorship' for career/general advice."),
  explanation: z.string().optional().describe('A clear explanation of the core issue, concept, or error. Used when responseType is "code_analysis". Tailored to the identified programming language and assessed experience level.'),
  guidance: z.string().optional().describe('Hints, leading questions, or areas to investigate to help the user discover the solution or understand the concept themselves. Used when responseType is "code_analysis". Avoid direct answers or overly explicit step-by-step instructions. The goal is to guide their thinking process. Tailored to the identified programming language and assessed experience level.'),
  tip: z.string().optional().describe('An additional tip or best practice. If the assessed level is beginner, this tip should suggest foundational concepts or topics to review. For intermediate/advanced levels, it can be a more specific best practice or resource. Used when responseType is "code_analysis". Tailored to the programming language and assessed experience level.'),
  mentorshipResponse: z.string().optional().describe("A well-formatted (using Markdown for structure like '## Heading' for subheadings to highlight key topics, lists '- like this', '**bold**', '`inline_code`') response for general mentorship or career questions. This is used when responseType is 'general_mentorship'. Should be engaging and directly address the user's general query.")
});
export type GetMentorAdviceOutput = z.infer<typeof GetMentorAdviceOutputSchema>;

export async function getMentorAdvice(input: GetMentorAdviceInput): Promise<GetMentorAdviceOutput> {
  return developerMentorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'developerMentorPrompt',
  input: {schema: GetMentorAdviceInputSchema},
  output: {schema: GetMentorAdviceOutputSchema},
  prompt: `You are an expert software developer and a friendly, patient mentor.
The user will provide input which might include a code snippet, an error message, a general programming question, a request for advice, or a general career/mentorship question.

User Input:
{{userInput}}

First, analyze the user's input to determine its nature:
1.  Is it a technical question related to a code snippet, an error message, or a specific programming concept?
2.  Or, is it a more general question seeking mentorship, career advice, or a subjective opinion (e.g., "O que ajudou você a crescer em sua carreira?")?

Also, identify:
1.  If a code snippet is present, identify its programming language (e.g., Python, JavaScript, Java). If no code snippet is obvious, assume the context is general programming advice if technical, or general mentorship if not.
2.  Assess the likely experience level of the user (e.g., beginner, intermediate, advanced) based on the code complexity, error type, or the nature of the question.

**Response Generation Rules:**

*   **Respond in Portuguese (Brazil).**
*   **Tailor the complexity and depth to the assessed experience level.**

**If the input is a TECHNICAL/CODE-RELATED question:**
    *   Set responseType to "code_analysis".
    *   Provide the following, acting like a professor during an exam (guide, don't solve directly):
        1.  explanation: {{explanation}} (A clear explanation of the core issue, concept, or error, tailored to the identified programming language and assessed experience level.)
        2.  guidance: {{guidance}} (Provide hints, ask leading questions, or suggest areas to investigate to help the user discover the solution or understand the concept themselves. Avoid giving direct answers or overly explicit step-by-step instructions. The goal is to guide their thinking process. Tailor this to the identified programming language and assessed experience level.)
        3.  tip: {{tip}} (An additional tip or best practice. If the assessed level is beginner, this tip should suggest foundational concepts or topics to review. For intermediate/advanced levels, it can be a more specific best practice or resource. Tailor to the programming language and assessed experience level.)
    *   Do not provide the fully corrected code snippet. Instead, guide the user.
    *   Leave mentorshipResponse empty or undefined.

**If the input is a GENERAL MENTORSHIP/CAREER question:**
    *   Set responseType to "general_mentorship".
    *   Craft a thoughtful and engaging response directly addressing the user's query in the mentorshipResponse field.
    *   This response should be formatted using Markdown for structure (e.g., use '## Heading' for subheadings to highlight key topics, '- item' or '* item' for bullet points, '**bolded text**' for emphasis, '\`inline_code\`' for code terms).
    *   The tone should be encouraging and mentor-like.
    *   Leave explanation, guidance, and tip fields empty or undefined.

Example for general mentorship question (AI will respond in Portuguese):
User: "O que você acha que mais fez diferença pra você crescer na carreira?"
AI should set responseType to "general_mentorship" and provide a response in Portuguese in the mentorshipResponse field, structured with Markdown.
E.g., "## Fatores Chave no Crescimento da Carreira\\nNa minha experiência, alguns pontos foram cruciais:\\n- **Aprendizado Contínuo**: A tecnologia evolui rápido, então nunca pare de estudar...\\n- \`Networking\`: Conectar-se com outros desenvolvedores..."
`,
});

const developerMentorFlow = ai.defineFlow(
  {
    name: 'developerMentorFlow',
    inputSchema: GetMentorAdviceInputSchema,
    outputSchema: GetMentorAdviceOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

    