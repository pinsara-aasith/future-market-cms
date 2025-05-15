import React, { forwardRef } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, fullWidth = false, helperText, className = '', ...props }, ref) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            px-3 py-2 bg-white border rounded-md shadow-sm placeholder-neutral-400
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            ${error ? 'border-error-500' : 'border-neutral-300'}
            ${fullWidth ? 'w-full' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-neutral-500">{helperText}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';