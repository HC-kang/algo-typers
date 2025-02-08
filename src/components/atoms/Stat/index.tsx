interface StatProps {
  label: string;
  value: string | number;
  unit?: string;
}

export const Stat = ({ label, value, unit }: StatProps) => {
  return (
    <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <span className="text-xl font-bold">
        {value}
        {unit && <span className="text-sm ml-1">{unit}</span>}
      </span>
    </div>
  );
}; 