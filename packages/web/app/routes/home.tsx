import { redirect } from 'react-router';
import { SITE_TITLE } from '~/config';

export function meta() {
  return [{ title: SITE_TITLE }, { name: 'description', content: `Welcome to ${SITE_TITLE}` }];
}

export function clientLoader() {
  throw redirect('/fretboard');
}
