'use client';

import { useState, useEffect } from 'react';
import Tabs from '../tabs/tabs';
import LocationSearch from '../locationSearch/locationSearch';
import styles from './form.module.scss';
import Image from 'next/image';
import useDebounce from '../../hooks/debounce';

export default function Form({ defaultLocations = [], defaultIndustries = [] }){
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(defaultLocations);
  const debouncedQuery = useDebounce(query, 300); 
  const [error, setError] = useState(null);
  

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults(defaultLocations);
      setError(null);
      return;
    }
    const fetchLocations = async () => {
  try {
    const response = await fetch(
      `https://api.cv-library.co.uk/v1/locations?q=${debouncedQuery}`
    );

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    setResults(data);
    setError(null); 
  } catch (err) {
    console.error('Failed to fetch:', err);
    setError('Unable to fetch location suggestions. Please try again.');
    setResults([]);
  }
};

fetchLocations();
  }, [debouncedQuery, defaultLocations]);
    
    return(
    <>
      <form className={styles.form}>
        <div className={styles.keyword}>
          <label htmlFor="keyword">Keywords / Job Title / Job Ref</label>
          <input type="text" placeholder="e.g. Sales Executive" />
        </div>

        <div className={styles.row}>
          <div className={styles.location}>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              placeholder="e.g. town or postcode"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>

          <div className={styles.distance}>
            <label htmlFor="distance">Distance</label>
            <select>
              <option value={0}>15 miles</option>
              <option value={1}>20 miles</option>
              <option value={2}>25 miles</option>
              <option value={3}>30 miles</option>
            </select>
          </div>
        </div>

        <button type="submit" className={"semibold"}>Find jobs now
          <Image
          className={styles.icon}
          src="./images/search.svg"
          alt="Search icon"
          width={17}
          height={17}
        /></button>
      </form>
      <Tabs
      tabs={[
        { label: 'Jobs by Location', content: <LocationSearch results={results} error={error}/> },
        { label: 'Jobs by Industry', content: <LocationSearch results={defaultIndustries} error={error}/> },
      ]} 
    />
  </>
  );
}