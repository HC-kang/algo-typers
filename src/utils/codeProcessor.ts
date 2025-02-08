import { Character } from '@/types/Character';
import { getTokensForLine } from './highlighter';
import { BundledLanguage, ThemedToken } from 'shiki';

export async function processCode(code: string, lang: BundledLanguage = 'typescript'): Promise<Character[]> {
  const characters: Character[] = [];
  let inIndentation = false;

  try {
    const tokens = await getTokensForLine(code, lang);
    
    for (const line of tokens) {
      for (const token of line as ThemedToken[]) {
        for (const char of token.content) {
          if (char === '\n') {
            characters.push(new Character(char));
            inIndentation = true;
          } else if (inIndentation && char === ' ') {
            characters.push(new Character(char, true));
          } else {
            characters.push(new Character(char, false, token.color));
            inIndentation = false;
          }
        }
      }
      if (!line[line.length - 1]?.content.endsWith('\n')) {
        characters.push(new Character('\n'));
        inIndentation = true;
      }
    }
  } catch (error) {
    console.error('Failed to process code:', error);
    // 에러 발생 시 일반 텍스트로 처리
    for (const char of code) {
      if (char === '\n') {
        characters.push(new Character(char));
        inIndentation = true;
      } else if (inIndentation && char === ' ') {
        characters.push(new Character(char, true));
      } else {
        characters.push(new Character(char));
        inIndentation = false;
      }
    }
  }

  return characters;
} 