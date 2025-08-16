import en from './en-US';
import ja from './ja-JP';

export const resources = {
  'en-US': en,
  'ja-JP': ja,
} as const;

export const defaultNS = 'common';
export const fallbackLng = 'en-US';

export type Resources = typeof resources;
export type Language = keyof Resources;
export type Namespace = keyof Resources[Language];
export type TranslationKeys = {
  [L in Language]: {
    [NS in Namespace]: keyof Resources[L][NS];
  };
};