import global from './global.json';
import home from './home.json';
import resources from './resources.json';
import tutorial from './tutorial.json';
import media from './media.json';
import examples from './examples.json';
import contributors from './contributors.json';
import docs from './docs.json';
import { LangType } from '../types';

export const langs: LangType = {
  global,
  home,
  docs,
  media,
  resources,
  tutorial,
  examples,
  contributors,
} as LangType;
