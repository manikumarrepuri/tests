import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Form labels and placeholders
      location_placeholder: 'e.g. town or postcode',
      keyword_placeholder: 'e.g. Sales Executive',
      keyword_label: 'Keywords / Job Title / Job Ref',
      location_label: 'Location',
      distance_label: 'Distance',

      // Button and action texts
      find_jobs: 'Find jobs now',
      searching: 'Searching...',

      // Status messages
      loading: 'Loading...',
      no_results: 'No results found',
      search_success: 'Search submitted successfully!',
      search_error:
        'An error occurred while submitting the form. Please try again.',

      // Tab labels
      jobs_by_location: 'Jobs by Location',
      jobs_by_industry: 'Jobs by Industry',

      // Distance options
      distance_15_miles: '15 miles',
      distance_20_miles: '20 miles',
      distance_30_miles: '30 miles',

      // Validation messages
      field_required: 'This field is required',
      min_length_error: 'Must be at least {{min}} characters',
      max_length_error: 'Must be less than {{max}} characters',
      invalid_characters: 'Contains invalid characters',

      // Error messages
      api_error: 'An error occurred',
      network_error: 'Network error occurred',

      // Alt texts
      logo_alt: 'Logo',
      search_icon_alt: 'Search Icon',

      // Tab content data (cities and industries)
      cities: {
        aberdeen: 'Aberdeen',
        basingstoke: 'Basingstoke',
        berkshire: 'Berkshire',
        birmingham: 'Birmingham',
        bradford: 'Bradford',
        bristol: 'Bristol',
        cambridge: 'Cambridge',
        derby: 'Derby',
        doncaster: 'Doncaster',
        edinburgh: 'Edinburgh',
        essex: 'Essex',
        exeter: 'Exeter',
        glasgow: 'Glasgow',
      },
      industries: {
        accounting: 'Accounting',
        administration: 'Administration',
        agriculture: 'Agriculture',
        arts: 'Arts',
        automotive: 'Automotive',
        catering: 'Catering',
        distribution: 'Distribution',
        driving: 'Driving',
        education: 'Education',
        electronics: 'Electronics',
        engineering: 'Engineering',
        financial_services: 'Financial Services',
        healthcare: 'Healthcare',
      },
    },
  },
};

// Only initialize if not already initialized (for SSR compatibility)
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
