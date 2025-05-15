import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  onClick,
  interactive = false,
}) => {
  const cardContent = (
    <>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>}
          {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
        </div>
      )}
      <div>{children}</div>
      {footer && <div className="mt-4 pt-3 border-t border-neutral-200">{footer}</div>}
    </>
  );

  const baseClasses = `bg-white rounded-lg shadow-card overflow-hidden ${className}`;

  if (interactive) {
    return (
      <motion.div
        whileHover={{ y: -3, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
        transition={{ duration: 0.2 }}
        className={`${baseClasses} cursor-pointer`}
        onClick={onClick}
      >
        <div className="p-5">{cardContent}</div>
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      <div className="p-5">{cardContent}</div>
    </div>
  );
};