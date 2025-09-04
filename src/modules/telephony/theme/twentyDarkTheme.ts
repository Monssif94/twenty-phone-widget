/**
 * Twenty CRM Dark Theme
 * Based on Twenty CRM's dark mode design system
 */

// Gray scale for dark theme
const GRAY_SCALE = {
  gray100: '#000000',
  gray90: '#141414',
  gray85: '#171717',
  gray80: '#1b1b1b',
  gray75: '#1d1d1d',
  gray70: '#222222',
  gray65: '#292929',
  gray60: '#333333',
  gray55: '#4c4c4c',
  gray50: '#666666',
  gray45: '#818181',
  gray40: '#999999',
  gray35: '#b3b3b3',
  gray30: '#cccccc',
  gray25: '#d6d6d6',
  gray20: '#ebebeb',
  gray15: '#f1f1f1',
  gray10: '#fcfcfc',
  gray0: '#ffffff',
};

// Main colors (same as light but adjusted for dark contrast)
const MAIN_COLORS = {
  green: '#55ef3c',
  turquoise: '#15de8f',
  sky: '#00e0ff',
  blue: '#5e90f2', // Lighter blue for dark mode
  purple: '#915ffd',
  pink: '#f54bd0',
  red: '#f83e3e',
  orange: '#ff7222',
  yellow: '#ffd338',
  gray: GRAY_SCALE.gray30,
};

export const twentyDarkTheme = {
  colors: {
    // Primary brand colors (adjusted for dark mode)
    primary: MAIN_COLORS.blue,
    primaryLight: '#7aa4f5',
    primaryDark: '#4b7dd9',
    
    // Secondary and accent colors
    secondary: GRAY_SCALE.gray50,
    accent: MAIN_COLORS.blue,
    
    // Status colors (same but may appear brighter on dark)
    success: MAIN_COLORS.green,
    warning: MAIN_COLORS.orange,
    error: MAIN_COLORS.red,
    info: MAIN_COLORS.sky,
    
    // Background colors (Dark theme)
    background: {
      primary: GRAY_SCALE.gray85,        // #171717
      secondary: GRAY_SCALE.gray80,      // #1b1b1b
      tertiary: GRAY_SCALE.gray75,       // #1d1d1d
      quaternary: GRAY_SCALE.gray70,     // #222222
      overlay: 'rgba(0, 0, 0, 0.8)',     
      hover: GRAY_SCALE.gray70,
      active: GRAY_SCALE.gray65,
      disabled: GRAY_SCALE.gray75,
      // Transparent backgrounds
      transparentLight: 'rgba(255, 255, 255, 0.03)',
      transparentMedium: 'rgba(255, 255, 255, 0.06)',
      transparentStrong: 'rgba(255, 255, 255, 0.1)',
    },
    
    // Text colors for dark theme
    text: {
      primary: GRAY_SCALE.gray20,        // #ebebeb
      secondary: GRAY_SCALE.gray30,      // #cccccc
      tertiary: GRAY_SCALE.gray35,       // #b3b3b3
      light: GRAY_SCALE.gray40,          // #999999
      extraLight: GRAY_SCALE.gray45,     // #818181
      inverted: GRAY_SCALE.gray85,       // #171717
      danger: MAIN_COLORS.red,
    },
    
    // Border colors for dark theme
    border: {
      strong: GRAY_SCALE.gray55,         // #4c4c4c
      medium: GRAY_SCALE.gray65,         // #292929
      light: GRAY_SCALE.gray70,          // #222222
      danger: 'rgba(248, 62, 62, 0.3)',
    },
    
    // Interactive states
    hover: {
      primary: '#7aa4f5',
      secondary: GRAY_SCALE.gray50,
    },
    
    // Gray scale exported for utility
    gray: GRAY_SCALE,
    
    // Main colors exported for special cases
    mainColors: MAIN_COLORS,
  },
  
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, sans-serif',
    
    fontSize: {
      xxs: '0.625rem',  // 10px
      xs: '0.85rem',    // 13.6px
      sm: '0.92rem',    // 14.72px
      md: '1rem',       // 16px
      lg: '1.23rem',    // 19.68px
      xl: '1.54rem',    // 24.64px
      xxl: '1.85rem',   // 29.6px
    },
    
    fontWeight: {
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 600,
    },
    
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  spacing: {
    xxs: '0.125rem',  // 2px
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    xxl: '2rem',      // 32px
    xxxl: '3rem',     // 48px
  },
  
  borderRadius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '20px',
    xxl: '40px',
    pill: '999px',
    rounded: '100%',
  },
  
  shadows: {
    // Darker, more subtle shadows for dark theme
    light: '0px 2px 4px rgba(0, 0, 0, 0.3)',
    medium: '0px 3px 8px rgba(0, 0, 0, 0.4)',
    strong: '0px 6px 20px rgba(0, 0, 0, 0.5)',
    
    // Special shadows for specific components
    card: '0px 2px 4px rgba(0, 0, 0, 0.3)',
    dropdown: '0px 3px 12px rgba(0, 0, 0, 0.5)',
    modal: '0px 11px 20px rgba(0, 0, 0, 0.6)',
    
    // Colored shadows for buttons (with glow effect)
    primaryButton: '0px 2px 8px rgba(94, 144, 242, 0.3)',
    successButton: '0px 2px 8px rgba(85, 239, 60, 0.3)',
    dangerButton: '0px 2px 8px rgba(248, 62, 62, 0.3)',
  },
  
  animation: {
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  zIndex: {
    dropdown: 1000,
    modal: 2000,
    popover: 3000,
    tooltip: 4000,
    notification: 5000,
  },
};

// Helper function to apply RGBA
export const rgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};