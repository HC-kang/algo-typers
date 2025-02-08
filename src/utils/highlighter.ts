import { createHighlighter, Highlighter, ThemedToken, BundledLanguage } from 'shiki';

let highlighter: Highlighter | null = null;

export async function initHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['github-dark'],
      langs: ['typescript', 'javascript', 'python', 'rust', 'java']
    });
  }
}

export async function getTokensForLine(code: string, lang: BundledLanguage = 'typescript'): Promise<ThemedToken[][]> {
  if (!highlighter) {
    await initHighlighter();
  }
  
  try {
    return highlighter!.codeToTokensBase(code, { lang, theme: 'github-dark' });
  } catch (error) {
    console.error('Failed to tokenize code:', error);
    return [[]];
  }
} 