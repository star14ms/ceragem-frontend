type Language = 'input' | 'ko' | 'en' | 'es' | 'de' | 'fr';
type Style = 'brief' | 'casual' | 'long' | 'polite';

type ChatbotConfig = {
  language: Language;
  style: Style;
  temperature: number;
};

export type { ChatbotConfig };