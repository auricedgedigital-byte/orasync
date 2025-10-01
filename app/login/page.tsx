import dynamic from 'next/dynamic';
import React from 'react';

// load the client login UI only on the client
const ClientLogin = dynamic(() => import('./ClientLogin'), { ssr: false });

export default function LoginPage() {
  return <ClientLogin />;
}
