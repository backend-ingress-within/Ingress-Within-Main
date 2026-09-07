'use client';

import App from '../../App';

export default function AppClient({ initialRoute = 'home' }) {
  return <App initialRoute={initialRoute} />;
}
