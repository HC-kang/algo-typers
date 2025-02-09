import { BundledLanguage } from 'shiki';

interface GithubFile {
  type: string;
  name: string;
  download_url: string;
}

export class CodeSnippet {
  private static readonly problems = [
    '3sum', 'alien-dictionary', 'best-time-to-buy-and-sell-stock',
    // ... 나머지 문제들
    'word-break', 'word-search', 'word-search-ii'
  ];

  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly code: string,
    public readonly source: string,
    public readonly lang: BundledLanguage
  ) {}

  static async fetchRandomSnippet(): Promise<CodeSnippet> {
    const REPO_OWNER = 'DaleStudy';
    const REPO_NAME = 'leetcode-study';
    
    try {
      const randomProblem = this.problems[Math.floor(Math.random() * this.problems.length)];
      
      const folderResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${randomProblem}`);
      const files = await folderResponse.json() as GithubFile[];
      
      const tsFiles = files.filter((file: GithubFile) => file.name.endsWith('.ts'));
      if (tsFiles.length === 0) {
        throw new Error(`No TypeScript files found for problem: ${randomProblem}`);
      }

      const randomFile = tsFiles[Math.floor(Math.random() * tsFiles.length)];
      const code = await fetch(randomFile.download_url).then(res => res.text());
      
      const title = randomProblem
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return new CodeSnippet(
        randomProblem,
        title,
        code,
        `github.com/${REPO_OWNER}/${REPO_NAME}/${randomProblem}/${randomFile.name}`,
        'typescript'
      );
    } catch (error) {
      console.error('Failed to fetch snippet:', error);
      throw error;
    }
  }

  static async fetchFromGithub(owner: string, repo: string, path: string = ''): Promise<CodeSnippet[]> {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
    const data = await response.json();
    
    const snippets: CodeSnippet[] = [];
    for (const file of data) {
      if (file.type === 'file' && file.name.endsWith('.ts')) {
        const codeResponse = await fetch(file.download_url);
        const code = await codeResponse.text();
        
        snippets.push(new CodeSnippet(
          file.sha,
          file.name,
          code,
          `github.com/${owner}/${repo}/${file.path}`,
          'typescript'
        ));
      }
    }
    
    return snippets;
  }

  static getRandomSnippets(snippets: CodeSnippet[], count: number = 3): CodeSnippet[] {
    const shuffled = [...snippets].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
} 