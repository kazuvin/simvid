#!/usr/bin/env node

import { readFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOCALES_DIR = join(__dirname, '../app/locales');
const SUPPORTED_LANGUAGES = ['en', 'ja'];

function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      keys.push(...getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function loadTranslationFiles(language) {
  const langDir = join(LOCALES_DIR, language);
  const files = readdirSync(langDir).filter(file => extname(file) === '.json');
  
  const translations = {};
  
  for (const file of files) {
    const namespace = file.replace('.json', '');
    const content = JSON.parse(readFileSync(join(langDir, file), 'utf8'));
    translations[namespace] = content;
  }
  
  return translations;
}

function checkTranslations() {
  const allTranslations = {};
  const allKeys = {};
  
  // Load all translation files
  for (const lang of SUPPORTED_LANGUAGES) {
    try {
      allTranslations[lang] = loadTranslationFiles(lang);
      allKeys[lang] = {};
      
      for (const [namespace, content] of Object.entries(allTranslations[lang])) {
        allKeys[lang][namespace] = getAllKeys(content);
      }
    } catch (error) {
      console.error(`Error loading translations for ${lang}:`, error.message);
      process.exit(1);
    }
  }
  
  let hasErrors = false;
  
  // Check for missing namespaces
  const baseNamespaces = Object.keys(allKeys.en);
  for (const lang of SUPPORTED_LANGUAGES) {
    const langNamespaces = Object.keys(allKeys[lang]);
    const missingNamespaces = baseNamespaces.filter(ns => !langNamespaces.includes(ns));
    const extraNamespaces = langNamespaces.filter(ns => !baseNamespaces.includes(ns));
    
    if (missingNamespaces.length > 0) {
      console.error(`❌ Language '${lang}' is missing namespaces: ${missingNamespaces.join(', ')}`);
      hasErrors = true;
    }
    
    if (extraNamespaces.length > 0) {
      console.error(`❌ Language '${lang}' has extra namespaces: ${extraNamespaces.join(', ')}`);
      hasErrors = true;
    }
  }
  
  // Check for missing translation keys within each namespace
  for (const namespace of baseNamespaces) {
    const baseKeys = allKeys.en[namespace] || [];
    
    for (const lang of SUPPORTED_LANGUAGES) {
      if (!allKeys[lang][namespace]) continue;
      
      const langKeys = allKeys[lang][namespace];
      const missingKeys = baseKeys.filter(key => !langKeys.includes(key));
      const extraKeys = langKeys.filter(key => !baseKeys.includes(key));
      
      if (missingKeys.length > 0) {
        console.error(`❌ Language '${lang}' namespace '${namespace}' is missing keys: ${missingKeys.join(', ')}`);
        hasErrors = true;
      }
      
      if (extraKeys.length > 0) {
        console.error(`❌ Language '${lang}' namespace '${namespace}' has extra keys: ${extraKeys.join(', ')}`);
        hasErrors = true;
      }
    }
  }
  
  // Check for empty values
  for (const [lang, namespaces] of Object.entries(allTranslations)) {
    for (const [namespace, content] of Object.entries(namespaces)) {
      checkEmptyValues(content, `${lang}.${namespace}`, (path, message) => {
        console.error(`❌ ${message} at ${path}`);
        hasErrors = true;
      });
    }
  }
  
  if (!hasErrors) {
    console.log('✅ All translation files are consistent!');
  } else {
    console.error('\n❌ Translation validation failed. Please fix the above issues.');
    process.exit(1);
  }
}

function checkEmptyValues(obj, path, onError) {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = `${path}.${key}`;
    
    if (typeof value === 'object' && value !== null) {
      checkEmptyValues(value, currentPath, onError);
    } else if (typeof value === 'string') {
      if (value.trim() === '') {
        onError(currentPath, 'Empty translation value');
      }
    } else {
      onError(currentPath, `Invalid translation value type: ${typeof value}`);
    }
  }
}

checkTranslations();