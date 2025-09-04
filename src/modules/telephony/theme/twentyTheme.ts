/**
 * Twenty CRM Design System Theme
 * Extracted from Twenty CRM source code for perfect integration
 */

// Gray scale matching Twenty's exact palette
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

// Main colors from Twenty
const MAIN_COLORS = {
  green: '#55ef3c',
  turquoise: '#15de8f',
  sky: '#00e0ff',
  blue: '#1961ed',
  purple: '#915ffd',
  pink: '#f54bd0',
  red: '#f83e3e',
  orange: '#ff7222',
  yellow: '#ffd338',
  gray: GRAY_SCALE.gray30,
};

// Blue accent colors for primary actions
const BLUE_ACCENT = {
  blueAccent90: '#141a25',
  blueAccent85: '#151d2e',
  blueAccent80: '#152037',
  blueAccent75: '#16233f',
  blueAccent70: '#17294a',
  blueAccent60: '#18356d',
  blueAccent40: '#a3c0f8',
  blueAccent35: '#c8d9fb',
  blueAccent25: '#dae6fc',
  blueAccent20: '#e2ecfd',
  blueAccent15: '#edf2fe',
  blueAccent10: '#f5f9fd',
};

export const twentyTheme = {
  colors: {
    // Primary brand colors
    primary: MAIN_COLORS.blue,
    primaryLight: '#5e90f2',
    primaryDark: '#184bad',
    
    // Secondary and accent colors
    secondary: GRAY_SCALE.gray50,
    accent: BLUE_ACCENT.blueAccent40,
    
    // Status colors
    success: MAIN_COLORS.green,
    warning: MAIN_COLORS.orange,
    error: MAIN_COLORS.red,
    info: MAIN_COLORS.sky,
    
    // Background colors (Light theme)
    background: {
      primary: GRAY_SCALE.gray0,        // #ffffff
      secondary: GRAY_SCALE.gray10,     // #fcfcfc
      tertiary: GRAY_SCALE.gray15,      // #f1f1f1
      quaternary: GRAY_SCALE.gray20,    // #ebebeb
      overlay: 'rgba(27, 27, 27, 0.8)', // rgba(gray80, 0.8)
      hover: GRAY_SCALE.gray10,
      active: GRAY_SCALE.gray15,
      disabled: GRAY_SCALE.gray20,
    },
    
    // Text colors
    text: {
      primary: GRAY_SCALE.gray60,      // #333333
      secondary: GRAY_SCALE.gray50,    // #666666
      tertiary: GRAY_SCALE.gray40,     // #999999
      light: GRAY_SCALE.gray35,        // #b3b3b3
      extraLight: GRAY_SCALE.gray30,   // #cccccc
      inverted: GRAY_SCALE.gray0,      // #ffffff
      danger: MAIN_COLORS.red,
    },
    
    // Border colors
    border: {
      strong: GRAY_SCALE.gray25,       // #d6d6d6
      medium: GRAY_SCALE.gray20,       // #ebebeb
      light: GRAY_SCALE.gray15,        // #f1f1f1
      danger: '#fed8d8',                // red20
    },
    
    // Interactive states
    hover: {
      primary: '#5e90f2',               // blue40
      secondary: GRAY_SCALE.gray55,    // #4c4c4c
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
      bold: 600, // Twenty uses semiBold as max weight
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
    // Twenty uses very subtle shadows
    light: '0px 2px 4px rgba(0, 0, 0, 0.04)',
    medium: '0px 3px 8px rgba(0, 0, 0, 0.08)',
    strong: '0px 6px 20px rgba(0, 0, 0, 0.12)',
    
    // Special shadows for specific components
    card: '0px 2px 4px rgba(0, 0, 0, 0.04)',
    dropdown: '0px 3px 12px rgba(0, 0, 0, 0.08)',
    modal: '0px 11px 20px rgba(0, 0, 0, 0.12)',
    
    // Colored shadows for buttons
    primaryButton: '0px 2px 4px rgba(25, 97, 237, 0.2)',
    successButton: '0px 2px 4px rgba(85, 239, 60, 0.2)',
    dangerButton: '0px 2px 4px rgba(248, 62, 62, 0.2)',
  },
  
  animation: {
    // Twenty uses subtle, fast animations
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