export interface Tokens {
  colors: typeof colors;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
  shadows: typeof shadows;
  motion: typeof motion;
  domainAccents: typeof domainAccents;
}

export declare const colors: {
  neutral: {
    0: string;
    50: string;
    200: string;
    700: string;
    900: string;
  };
  accent: {
    balance: string;
    earn: string;
    invest: string;
    spend: string;
    donate: string;
    upgrade: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
};

export declare const spacing: Record<number, string>;
export declare const radii: Record<string, string>;
export declare const typography: {
  fontFamilySans: string;
  weights: {
    regular: number;
    medium: number;
    semibold: number;
  };
};
export declare const shadows: Record<string, string>;
export declare const motion: {
  duration: Record<string, string>;
  easing: Record<string, string>;
};
export declare const domainAccents: Record<string, string>;
export declare function accentVar(key: string): string;
export declare function domainAccentVar(domain: string): string;
export declare const tokens: Tokens;
