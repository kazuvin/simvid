import { SITE_TITLE } from '~/config';

export function meta() {
  return [{ title: SITE_TITLE }, { name: 'description', content: `Welcome to ${SITE_TITLE}` }];
}

export default function Home() {
  return <div className="flex min-h-screen items-center justify-center">{SITE_TITLE}</div>;
}
