export interface CardElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'button';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex: number;
  // Text-specific properties
  content?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  // Gradient text properties
  isGradientText?: boolean;
  gradientColor1?: string;
  gradientColor2?: string;
  gradientDirection?: string;
  // Image-specific properties
  src?: string;
  alt?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  // Shape-specific properties
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  // Button-specific properties
  buttonText?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  href?: string;
}

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  elements: CardElement[];
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;
}

export interface SavedCard {
  id: string;
  title: string;
  user_id: string;
  card_data: {
    elements: CardElement[];
    canvasSettings: {
      width: number;
      height: number;
      backgroundColor: string;
    };
    timestamp: string;
  };
  created_at: string;
  updated_at: string;
}

// Kutt.it API Types
export interface KuttShortenResponse {
  id: string;
  address: string;
  target: string;
  visit_count: number;
  created_at: string;
  updated_at: string;
  link: string;
  description?: string;
  expire_in?: string;
  password?: boolean;
  user_id?: string;
}

export interface KuttStatsResponse {
  id: string;
  clicks: number;
  views: {
    [date: string]: number;
  };
  stats: {
    browser: { [key: string]: number };
    os: { [key: string]: number };
    country: { [key: string]: number };
    referrer: { [key: string]: number };
  };
}

export interface KuttLink {
  id: string;
  address: string;
  target: string;
  visit_count: number;
  created_at: string;
  updated_at: string;
  link: string;
  description?: string;
  expire_in?: string;
  password?: boolean;
  user_id?: string;
}

export interface KuttUserLinksResponse {
  data: KuttLink[];
  pagination: {
    take: number;
    skip: number;
    total: number;
  };
}

export interface KuttErrorResponse {
  error: string;
  message: string;
}