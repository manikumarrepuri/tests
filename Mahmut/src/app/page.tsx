'use client';

import React from 'react';
import '../App.scss';
import SearchForm from '../components/SearchForm';
import Tabs from '../components/Tabs';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="container">
      <div className="content">
        <div className='logo-container'>
        <Image
          src="/Logo.png"
          alt={t('logo_alt')}
          className="logo"
          width={240}
          height={120}
        />
        </div>
        <SearchForm />
      </div>
      <Tabs />
    </div>
  );
}
