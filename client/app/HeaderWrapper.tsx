'use client';

import { usePathname } from 'next/navigation';
import Header from '../components/Header';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div className={!isHome ? 'mb-12' : ''}>
      <Header />
    </div>
  );
}
