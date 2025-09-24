'use server';

/**
 * @fileOverview A study schedule generation AI agent.
 *
 * - generateStudySchedule - A function that generates a study schedule based on user inputs.
 * - GenerateStudyScheduleInput - The input type for the generateStudySchedule function.
 * - GenerateStudyScheduleOutput - The return type for the generateStudySchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyScheduleInputSchema = z.object({
  goals: z
    .string()
    .describe('The study goals for the user, e.g., pass the upcoming exam.'),
  tasks: z
    .string()
    .describe(
      'A list of study tasks, including the subject, deadline, and priority, e.g., Math: Chapter 1-5 (due 2024-04-01, high priority)'
    ),
});
export type GenerateStudyScheduleInput = z.infer<typeof GenerateStudyScheduleInputSchema>;

const GenerateStudyScheduleOutputSchema = z.object({
  schedule: z
    .string()
    .describe(
      'The generated study schedule, including specific tasks and timelines, e.g., 2024-03-28: Math Chapter 1, 2024-03-29: Math Chapter 2, 2024-03-30: Rest'
    ),
});
export type GenerateStudyScheduleOutput = z.infer<typeof GenerateStudyScheduleOutputSchema>;

export async function generateStudySchedule(input: GenerateStudyScheduleInput): Promise<GenerateStudyScheduleOutput> {
  return generateStudyScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudySchedulePrompt',
  input: {schema: GenerateStudyScheduleInputSchema},
  output: {schema: GenerateStudyScheduleOutputSchema},
  prompt: `You are a study schedule planning assistant. You will generate a study schedule based on the user's goals, tasks, and priorities.

  Goals: {{{goals}}}
  Tasks: {{{tasks}}}

  Schedule:`,
});

const generateStudyScheduleFlow = ai.defineFlow(
  {
    name: 'generateStudyScheduleFlow',
    inputSchema: GenerateStudyScheduleInputSchema,
    outputSchema: GenerateStudyScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
