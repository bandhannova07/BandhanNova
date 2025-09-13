import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Button Component
 * Reusable button component with multiple variants and states
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-400 hover:from-primary-600 hover:to-secondary-500 text-white shadow-lg hover:shadow-xl focus:ring-primary-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white focus:ring-gray-500',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white dark:border-primary-400 dark:text-primary-400 focus:ring-primary-500',
    ghost: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700 focus:ring-gray-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl focus:ring-red-500',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl focus:ring-green-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl focus:ring-yellow-500',
    info: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl focus:ring-blue-500'
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
    xlarge: 'px-8 py-4 text-xl'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
    xlarge: 'w-7 h-7'
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  const renderIcon = () => {
    if (loading) {
      return <Loader2 className={`${iconSizes[size]} animate-spin`} />;
    }
    if (icon) {
      const IconComponent = icon;
      return <IconComponent className={iconSizes[size]} />;
    }
    return null;
  };

  const renderContent = () => {
    const iconElement = renderIcon();
    const hasIcon = iconElement !== null;
    const hasText = children !== null && children !== undefined;

    if (!hasIcon && !hasText) return null;

    if (hasIcon && !hasText) {
      return iconElement;
    }

    if (!hasIcon && hasText) {
      return children;
    }

    // Both icon and text
    if (iconPosition === 'right') {
      return (
        <>
          <span>{children}</span>
          <span className="ml-2">{iconElement}</span>
        </>
      );
    }

    return (
      <>
        <span className="mr-2">{iconElement}</span>
        <span>{children}</span>
      </>
    );
  };

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {renderContent()}
    </motion.button>
  );
};

// Icon Button Component
export const IconButton = ({
  icon,
  variant = 'ghost',
  size = 'medium',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    small: 'p-1.5',
    medium: 'p-2',
    large: 'p-3',
    xlarge: 'p-4'
  };

  return (
    <Button
      variant={variant}
      className={`${sizeClasses[size]} ${className}`}
      icon={icon}
      {...props}
    />
  );
};

// Button Group Component
export const ButtonGroup = ({
  children,
  orientation = 'horizontal',
  className = ''
}) => {
  const orientationClasses = {
    horizontal: 'flex flex-row',
    vertical: 'flex flex-col'
  };

  return (
    <div className={`${orientationClasses[orientation]} ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;

        let additionalClasses = '';
        
        if (orientation === 'horizontal') {
          if (!isFirst && !isLast) {
            additionalClasses = 'rounded-none border-l-0';
          } else if (isFirst) {
            additionalClasses = 'rounded-r-none';
          } else if (isLast) {
            additionalClasses = 'rounded-l-none border-l-0';
          }
        } else {
          if (!isFirst && !isLast) {
            additionalClasses = 'rounded-none border-t-0';
          } else if (isFirst) {
            additionalClasses = 'rounded-b-none';
          } else if (isLast) {
            additionalClasses = 'rounded-t-none border-t-0';
          }
        }

        return React.cloneElement(child, {
          className: `${child.props.className || ''} ${additionalClasses}`.trim()
        });
      })}
    </div>
  );
};

// Floating Action Button
export const FloatingActionButton = ({
  icon,
  onClick,
  className = '',
  position = 'bottom-right',
  ...props
}) => {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };

  return (
    <motion.button
      className={`
        ${positionClasses[position]}
        w-14 h-14 bg-gradient-to-r from-primary-500 to-secondary-400 
        hover:from-primary-600 hover:to-secondary-500 
        text-white rounded-full shadow-lg hover:shadow-xl 
        flex items-center justify-center z-50 
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${className}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      {...props}
    >
      {React.createElement(icon, { className: 'w-6 h-6' })}
    </motion.button>
  );
};

// Toggle Button
export const ToggleButton = ({
  pressed,
  onPressedChange,
  children,
  variant = 'outline',
  ...props
}) => {
  const pressedVariants = {
    outline: pressed ? 'primary' : 'outline',
    ghost: pressed ? 'primary' : 'ghost',
    secondary: pressed ? 'primary' : 'secondary'
  };

  return (
    <Button
      variant={pressedVariants[variant]}
      onClick={() => onPressedChange?.(!pressed)}
      {...props}
    >
      {children}
    </Button>
  );
};

export default Button;
