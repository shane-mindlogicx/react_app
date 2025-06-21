
import React, { useState, ChangeEvent, KeyboardEvent, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Theme } from './types';
import { HomeIcon, Squares2X2Icon, MagnifyingGlassIcon, BookmarkSquareIcon, UserCircleIcon, LogoSymbol as AppLogoSymbol, SunIcon, MoonIcon, XMarkIcon, CheckCircleIcon as CheckCircleIconConstant, SparklesIcon, ArrowLeftIcon as ArrowLeftIconConstant } from './constants'; // Renamed to avoid conflict if any

// ThemeContext and useTheme Hook
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Logo Component
export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg', className?: string }> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <AppLogoSymbol className={sizeClasses[size]} />
      <span className={`font-bold text-xl ${size === 'lg' ? 'md:text-2xl' : ''} dark:text-white text-slate-800`}>Blissful</span>
    </div>
  );
};

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150';
  
  const variantStyles = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400',
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-700 focus:ring-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 dark:focus:ring-slate-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-400',
    ghost: 'hover:bg-slate-100 text-slate-700 focus:ring-slate-400 dark:hover:bg-slate-700 dark:text-slate-200 dark:focus:ring-slate-500',
    link: 'text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 underline p-0',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  Icon?: React.ElementType;
}
export const Input: React.FC<InputProps> = ({ label, id, error, Icon, className, ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
      <div className="relative">
        {Icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon className="h-5 w-5 text-slate-400" /></div>}
        <input
          id={id}
          className={`block w-full px-3 py-2 border rounded-md shadow-sm 
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'}
            bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 sm:text-sm ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
};


// Checkbox Component
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode;
}
export const Checkbox: React.FC<CheckboxProps> = ({ label, id, ...props }) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 text-indigo-600 border-slate-300 dark:border-slate-600 rounded focus:ring-indigo-500 dark:bg-slate-700 dark:checked:bg-indigo-500"
        {...props}
      />
      <label htmlFor={id} className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
        {label}
      </label>
    </div>
  );
};

// OTP Input Component
interface OtpInputProps {
  length: number;
  onChange: (otp: string) => void;
}
export const OtpInput: React.FC<OtpInputProps> = ({ length, onChange }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      onChange(newOtp.join(""));

      // Focus next input
      if (value !== "" && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center space-x-2">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={data}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target, index)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
          ref={(el: HTMLInputElement | null) => { inputRefs.current[index] = el; }}
          className="w-10 h-12 md:w-12 md:h-14 text-center text-xl md:text-2xl font-semibold border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      ))}
    </div>
  );
};

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
      <Card className={`w-full ${sizeClasses[size]} p-0 transform transition-all`}>
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
          {title && <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>}
          <Button variant="ghost" size="sm" onClick={onClose} className="!p-1">
            <XMarkIcon className="w-6 h-6" />
          </Button>
        </div>
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </Card>
    </div>
  );
};

// BottomNavigationBar Component
export const BottomNavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = window.location.hash.substring(1) || '/home'; // Simplified for HashRouter

  const navItems = [
    { path: '/home', label: 'Home', icon: HomeIcon },
    { path: '/explore', label: 'Explore', icon: Squares2X2Icon }, // Route should be /explore or /explore/all
    { path: '/search', label: 'Search', icon: MagnifyingGlassIcon },
    { path: '/library', label: 'Library', icon: BookmarkSquareIcon },
    { path: '/profile', label: 'Profile', icon: UserCircleIcon },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-top-md z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center space-y-1 p-2 rounded-md transition-colors
              ${location.startsWith(item.path) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-300'}`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};


// PageIndicator Component
interface PageIndicatorProps {
  count: number;
  activeIndex: number;
  onDotClick?: (index: number) => void;
}
export const PageIndicator: React.FC<PageIndicatorProps> = ({ count, activeIndex, onDotClick }) => {
  return (
    <div className="flex justify-center space-x-2 my-4">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick?.(i)}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300
            ${i === activeIndex ? 'bg-indigo-600 dark:bg-indigo-400 w-6' : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'}`}
          aria-label={`Go to page ${i + 1}`}
        />
      ))}
    </div>
  );
};

// ThemeToggle Component
export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      className="p-2 rounded-full"
      aria-label={theme === 'dark' ? "Switch to light theme" : "Switch to dark theme"}
    >
      {theme === 'dark' ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-slate-700" />}
    </Button>
  );
};

// A simple header for screens
interface ScreenHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void; // Optional custom back button handler
  actions?: React.ReactNode;
}
export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, showBackButton = false, onBackClick, actions }) => {
    const navigate = useNavigate();
    
    const handleBack = () => {
        if (onBackClick) {
            onBackClick();
        } else {
            navigate(-1);
        }
    };

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
                {showBackButton && (
                    <Button variant="ghost" size="sm" onClick={handleBack} className="mr-2 !p-1" aria-label="Go back">
                        <ArrowLeftIconConstant className="w-6 h-6" />
                    </Button>
                )}
                <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{title}</h1>
            </div>
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </header>
    );
};

// Generic List Item for settings or navigation
interface ListItemProps {
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
    onClick?: () => void;
    trailing?: React.ReactNode;
    className?: string;
}
export const ListItem: React.FC<ListItemProps> = ({ icon, title, subtitle, onClick, trailing, className }) => {
    const content = (
        <div className={`flex items-center w-full p-4 ${onClick ? 'hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors' : ''} ${className}`}>
            {icon && <div className="mr-4 text-slate-500 dark:text-slate-400">{icon}</div>}
            <div className="flex-grow">
                <p className="font-medium text-slate-800 dark:text-slate-100">{title}</p>
                {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
            </div>
            {trailing && <div className="ml-4 text-slate-400 dark:text-slate-500">{trailing}</div>}
        </div>
    );

    if (onClick) {
        return <button onClick={onClick} className="w-full text-left block">{content}</button>;
    }
    return <div className="w-full">{content}</div>;
};

// Country Code Selector (Simplified)
interface CountryCodeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: { code: string; name: string }[];
}
export const CountryCodeSelector: React.FC<CountryCodeSelectorProps> = ({ value, onChange, options }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-full rounded-md rounded-r-none border-0 bg-transparent py-0 pl-3 pr-7 text-slate-500 dark:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
    >
      {options.map(opt => <option key={opt.code} value={opt.code}>{opt.code} ({opt.name})</option>)}
    </select>
  );
};

// DayChip (for SetReminderScreen)
interface DayChipProps {
  day: string;
  isSelected: boolean;
  onToggle: () => void;
}
export const DayChip: React.FC<DayChipProps> = ({ day, isSelected, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-medium transition-colors
        ${isSelected
          ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500'
          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
        }`}
    >
      {day}
    </button>
  );
};

// LoadingSpinner
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg', message?: string }> = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <svg
        className={`animate-spin text-indigo-500 dark:text-indigo-400 ${sizeClasses[size]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {message && <p className="mt-4 text-slate-600 dark:text-slate-300">{message}</p>}
    </div>
  );
};

// Tag Component
interface TagProps {
  children: React.ReactNode;
  color?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string; 
}
export const Tag: React.FC<TagProps> = ({ children, color = 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200', selected, onClick, className = '' }) => {
    const selectedClasses = selected ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' : '';
    return (
        <span
            onClick={onClick}
            className={`px-3 py-1 rounded-full text-sm font-medium ${color} ${selectedClasses} ${onClick ? 'cursor-pointer' : ''} transition-all ${className}`}
        >
            {children}
        </span>
    );
};

// Alert Component
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}
export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const baseClasses = "p-4 rounded-md flex items-start space-x-3";
  const typeClasses = {
    success: "bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300",
    error: "bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300",
    warning: "bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
    info: "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  };
  const Icon = type === 'success' ? CheckCircleIconConstant : type === 'error' ? XMarkIcon : SparklesIcon; // Simplified, add more specific icons

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 ${type === 'success' ? 'text-green-500' : type === 'error' ? 'text-red-500' : type === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`} />
      <p className="text-sm font-medium flex-grow">{message}</p>
      {onClose && (
        <button onClick={onClose} className="-m-1 p-1">
          <XMarkIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
