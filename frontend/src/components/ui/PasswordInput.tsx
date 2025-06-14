import React, { forwardRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, fullWidth = false, helperText, className = "", ...props },
    ref
  ) => {
    const [show, setShow] = React.useState(false);

    return (
      <div className={`${fullWidth ? "w-full" : ""} mb-4`}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {label}
          </label>
        )}

        {/* Container for input and icon */}
        <div className="relative">
          <input
            ref={ref}
            className={`
              px-3 py-2 pr-10 bg-white border rounded-md shadow-sm placeholder-neutral-400
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
              ${error ? "border-error-500" : "border-neutral-300"}
              ${fullWidth ? "w-full" : ""}
              ${className}
            `}
            {...props}
            type={show ? "text" : "password"}
          />
          <span
            onClick={() => setShow((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 cursor-pointer"
          >
            {show ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
