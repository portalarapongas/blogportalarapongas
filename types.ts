
export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
}

export interface NewsArticle {
  title: string;
  summary: string;
  fullContent?: string; // Conteúdo detalhado para leitura interna
  url: string;
  date?: string;
  image?: string;
  images?: string[];
}

export interface WeatherData {
  text: string;
  temperature?: string;
  condition?: string;
  links: GroundingChunk[];
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}
