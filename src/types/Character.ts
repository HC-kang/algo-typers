export class Character {
  readonly value: string;
  readonly isIndent: boolean;
  readonly isNewline: boolean;
  readonly color?: string;  // 구문 강조 색상
  private _typedValue: string | null;
  
  constructor(value: string, isIndent: boolean = false, color?: string) {
    this.value = value;
    this.isIndent = isIndent;
    this.isNewline = value === '\n';
    this.color = color;
    this._typedValue = null;
  }

  get typedValue(): string | null {
    return this._typedValue;
  }

  set typedValue(value: string | null) {
    // 개행 문자인 경우 Enter 키 입력만 허용
    if (this.isNewline) {
      if (value === '\n' || value === null) {
        this._typedValue = value;
      }
      // 다른 입력은 무시
      return;
    }

    // 그 외의 경우 모든 입력 허용 (들여쓰기 포함)
    this._typedValue = value;
  }

  get isCorrect(): boolean {
    if (this._typedValue === null) return false;
    return this.value === this._typedValue;
  }

  get status(): 'waiting' | 'correct' | 'incorrect' {
    if (this._typedValue === null) return 'waiting';
    return this.isCorrect ? 'correct' : 'incorrect';
  }
} 