'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { useMenuItem } from '@hookpost/frontend/components/layout/top.menu';

export const Title = () => {
  const path = usePathname();
  const { all: menuItems } = useMenuItem();
  const currentTitle = useMemo(() => {
    if (!path) return '';
    const match = menuItems.find(
      (item) => item.path && path.indexOf(item.path) > -1
    );
    if (match?.name) return match.name;
    if (path.startsWith('/admin')) return 'Super Admin';
    return '';
  }, [path, menuItems]);

  return <h1>{currentTitle}</h1>;
};

