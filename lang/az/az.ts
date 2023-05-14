import { LangType } from '../types';
import contributors from './contributors.json';
import docs from './docs.json';
import examples from './examples.json';
import global from './global.json';
import home from './home.json';
import media from './media.json';
import resources from './resources.json';
import tutorial from './tutorial.json';

export const langs: LangType = {
  global,
  home: home as LangType['home'],
  docs,
  media,
  resources,
  tutorial,
  examples,
  contributors,
};
