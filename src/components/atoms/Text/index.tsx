interface TextProps {
  children: React.ReactNode;
  variant?: 'body' | 'caption' | 'code';
  className?: string;
}

export const Text = ({ children, variant = 'body', className = '' }: TextProps) => {
  const baseStyles = {
    body: 'text-base',
    caption: 'text-sm text-gray-600',
    code: 'font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded'
  };

  return (
    <span className={`${baseStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}; 