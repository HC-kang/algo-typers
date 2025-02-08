import { CodeCharacter } from '@/components/atoms/CodeCharacter';
import { Character } from '@/types/Character';

interface CodeDisplayProps {
  characters: Character[];
  currentIndex: number;
}

export const CodeDisplay = ({ characters = [], currentIndex }: CodeDisplayProps) => {
  // 배열이 아닌 경우를 대비한 안전 장치
  const charArray = Array.isArray(characters) ? characters : [];

  // 실제 표시할 문자와 커서 위치를 계산
  const renderCharacters = charArray.map((char, index) => {
    // 개행 문자 다음의 인덱스를 조정
    const adjustedIndex = charArray
      .slice(0, index)
      .filter(c => c.isNewline)
      .length;
    
    return {
      char,
      displayIndex: index - adjustedIndex,
      isCurrent: index === currentIndex
    };
  });

  return (
    <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto">
      {renderCharacters.map(({ char, displayIndex, isCurrent }, index) => {
        if (char.isNewline) {
          return (
            <span key={index}>
              {isCurrent && <span className="bg-blue-200">&nbsp;</span>}
              <br />
            </span>
          );
        }

        return (
          <span key={index}>
            <CodeCharacter 
              expectedChar={char.value}
              typedChar={char.typedValue}
              isCurrent={isCurrent}
              isIndentation={char.isIndent}
              color={char.color}
            />
          </span>
        );
      })}
    </pre>
  );
}; 