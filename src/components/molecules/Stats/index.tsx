import { Stat } from '@/components/atoms/Stat';

interface StatsProps {
  wpm: number;
  accuracy: number;
  progress: number;
}

export const Stats = ({ wpm, accuracy, progress }: StatsProps) => {
  return (
    <div className="flex gap-4 flex-wrap">
      <Stat label="타자 속도" value={Math.round(wpm)} unit="WPM" />
      <Stat label="정확도" value={Math.round(accuracy)} unit="%" />
      <Stat label="진행률" value={Math.round(progress)} unit="%" />
    </div>
  );
}; 