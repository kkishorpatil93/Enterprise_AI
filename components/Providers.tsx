'use client';

import React from 'react';
import { NexoraStoreProvider } from '@/lib/store';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <NexoraStoreProvider>{children}</NexoraStoreProvider>;
};

