interface CodeCharacterProps {
  expectedChar: string;
  typedChar?: string | null;
  isCurrent: boolean;
  isIndentation: boolean;
  color?: string;
}

export const CodeCharacter = ({ 
  expectedChar, 
  typedChar, 
  isCurrent, 
  isIndentation,
  color 
}: CodeCharacterProps) => {
  // 상태에 따른 스타일 결정
  const getStyle = () => {
    if (isCurrent) return 'bg-blue-200';
    if (isIndentation) return 'text-gray-400';
    if (typedChar === null) return 'text-gray-400';  // 미입력 문자는 회색
    if (typedChar === expectedChar) return '';  // 색상은 style prop으로 처리
    return 'text-red-600 bg-red-100';
  };

  return (
    <span 
      className={`font-mono ${getStyle()}`}
      style={color && typedChar !== null ? { color } : undefined}  // 입력된 문자만 색상 적용
    >
      {/* 틀린 경우 입력된 문자를 표시, 그 외에는 예상 문자 표시 */}
      {(typedChar && typedChar !== expectedChar) ? typedChar : expectedChar}
    </span>
  );
}; 