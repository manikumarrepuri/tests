import React from 'react';
import { render, screen } from '@testing-library/react';
import i18n from '../../i18n';
import I18nProvider from '../I18nProvider';

// Test component that uses translations
const TestComponent = () => {
  const { t } = require('react-i18next').useTranslation();
  return (
    <div>
      <h1>{t('keyword_label')}</h1>
      <p>{t('location_label')}</p>
      <span>{t('find_jobs')}</span>
    </div>
  );
};

describe('I18nProvider', () => {
  describe('Rendering', () => {
    it('should render children', () => {
      render(
        <I18nProvider>
          <div>Test content</div>
        </I18nProvider>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <I18nProvider>
          <div>First child</div>
          <div>Second child</div>
          <span>Third child</span>
        </I18nProvider>
      );

      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
      expect(screen.getByText('Third child')).toBeInTheDocument();
    });

    it('should render functional components', () => {
      const TestComponent = () => <div>Functional component</div>;

      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByText('Functional component')).toBeInTheDocument();
    });
  });

  describe('Translation Functionality', () => {
    it('should provide translation context to children', () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      // Check that translations are working
      expect(
        screen.getByText('Keywords / Job Title / Job Ref')
      ).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('Find jobs now')).toBeInTheDocument();
    });

    it('should handle missing translations gracefully', () => {
      const ComponentWithMissingTranslation = () => {
        const { t } = require('react-i18next').useTranslation();
        return <div>{t('missing_translation_key', 'Default text')}</div>;
      };

      render(
        <I18nProvider>
          <ComponentWithMissingTranslation />
        </I18nProvider>
      );

      expect(screen.getByText('Default text')).toBeInTheDocument();
    });

    it('should handle nested translation keys', () => {
      const ComponentWithNestedTranslation = () => {
        const { t } = require('react-i18next').useTranslation();
        return (
          <div>
            <span>{t('cities.aberdeen')}</span>
            <span>{t('industries.accounting')}</span>
          </div>
        );
      };

      render(
        <I18nProvider>
          <ComponentWithNestedTranslation />
        </I18nProvider>
      );

      expect(screen.getByText('Aberdeen')).toBeInTheDocument();
      expect(screen.getByText('Accounting')).toBeInTheDocument();
    });
  });

  describe('i18n Configuration', () => {
    it('should use the correct i18n instance', () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      // Verify that the i18n instance is properly configured
      expect(i18n.isInitialized).toBe(true);
      expect(i18n.language).toBe('en');
    });

    it('should provide fallback language support', () => {
      const ComponentWithFallback = () => {
        const { t } = require('react-i18next').useTranslation();
        return <div>{t('non_existent_key', 'Fallback text')}</div>;
      };

      render(
        <I18nProvider>
          <ComponentWithFallback />
        </I18nProvider>
      );

      expect(screen.getByText('Fallback text')).toBeInTheDocument();
    });
  });

  describe('Translation Keys', () => {
    it('should translate form labels correctly', () => {
      const FormLabelsComponent = () => {
        const { t } = require('react-i18next').useTranslation();
        return (
          <div>
            <label>{t('keyword_label')}</label>
            <label>{t('location_label')}</label>
            <label>{t('distance_label')}</label>
          </div>
        );
      };

      render(
        <I18nProvider>
          <FormLabelsComponent />
        </I18nProvider>
      );

      expect(
        screen.getByText('Keywords / Job Title / Job Ref')
      ).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('Distance')).toBeInTheDocument();
    });

    it('should translate button texts correctly', () => {
      const ButtonComponent = () => {
        const { t } = require('react-i18next').useTranslation();
        return (
          <div>
            <button>{t('find_jobs')}</button>
            <span>{t('searching')}</span>
          </div>
        );
      };

      render(
        <I18nProvider>
          <ButtonComponent />
        </I18nProvider>
      );

      expect(screen.getByText('Find jobs now')).toBeInTheDocument();
      expect(screen.getByText('Searching...')).toBeInTheDocument();
    });

    it('should translate placeholders correctly', () => {
      const PlaceholderComponent = () => {
        const { t } = require('react-i18next').useTranslation();
        return (
          <div>
            <input placeholder={t('keyword_placeholder')} />
            <input placeholder={t('location_placeholder')} />
          </div>
        );
      };

      render(
        <I18nProvider>
          <PlaceholderComponent />
        </I18nProvider>
      );

      expect(
        screen.getByPlaceholderText('e.g. Sales Executive')
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('e.g. town or postcode')
      ).toBeInTheDocument();
    });

    it('should translate distance options correctly', () => {
      const DistanceComponent = () => {
        const { t } = require('react-i18next').useTranslation();
        return (
          <div>
            <span>{t('distance_15_miles')}</span>
            <span>{t('distance_20_miles')}</span>
            <span>{t('distance_30_miles')}</span>
          </div>
        );
      };

      render(
        <I18nProvider>
          <DistanceComponent />
        </I18nProvider>
      );

      expect(screen.getByText('15 miles')).toBeInTheDocument();
      expect(screen.getByText('20 miles')).toBeInTheDocument();
      expect(screen.getByText('30 miles')).toBeInTheDocument();
    });
  });

  describe('Cities and Industries', () => {
    it('should translate city names correctly', () => {
      const CitiesComponent = () => {
        const { t } = require('react-i18next').useTranslation();
        return (
          <div>
            <span>{t('cities.aberdeen')}</span>
            <span>{t('cities.birmingham')}</span>
            <span>{t('cities.bristol')}</span>
            <span>{t('cities.edinburgh')}</span>
            <span>{t('cities.glasgow')}</span>
          </div>
        );
      };

      render(
        <I18nProvider>
          <CitiesComponent />
        </I18nProvider>
      );

      expect(screen.getByText('Aberdeen')).toBeInTheDocument();
      expect(screen.getByText('Birmingham')).toBeInTheDocument();
      expect(screen.getByText('Bristol')).toBeInTheDocument();
      expect(screen.getByText('Edinburgh')).toBeInTheDocument();
      expect(screen.getByText('Glasgow')).toBeInTheDocument();
    });

    it('should translate industry names correctly', () => {
      const IndustriesComponent = () => {
        const { t } = require('react-i18next').useTranslation();
        return (
          <div>
            <span>{t('industries.accounting')}</span>
            <span>{t('industries.engineering')}</span>
            <span>{t('industries.education')}</span>
            <span>{t('industries.financial_services')}</span>
          </div>
        );
      };

      render(
        <I18nProvider>
          <IndustriesComponent />
        </I18nProvider>
      );

      expect(screen.getByText('Accounting')).toBeInTheDocument();
      expect(screen.getByText('Engineering')).toBeInTheDocument();
      expect(screen.getByText('Education')).toBeInTheDocument();
      expect(screen.getByText('Financial Services')).toBeInTheDocument();
    });
  });

  describe('Error Messages', () => {
    it('should translate error messages correctly', () => {
      const ErrorComponent = () => {
        const { t } = require('react-i18next').useTranslation();
        return (
          <div>
            <span>{t('search_error')}</span>
            <span>{t('api_error')}</span>
            <span>{t('network_error')}</span>
          </div>
        );
      };

      render(
        <I18nProvider>
          <ErrorComponent />
        </I18nProvider>
      );

      expect(
        screen.getByText(
          'An error occurred while submitting the form. Please try again.'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
      expect(screen.getByText('Network error occurred')).toBeInTheDocument();
    });

    it('should translate validation messages correctly', () => {
      const ValidationComponent = () => {
        const { t } = require('react-i18next').useTranslation();
        return (
          <div>
            <span>{t('field_required')}</span>
            <span>{t('min_length_error', { min: 2 })}</span>
            <span>{t('max_length_error', { max: 100 })}</span>
          </div>
        );
      };

      render(
        <I18nProvider>
          <ValidationComponent />
        </I18nProvider>
      );

      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(
        screen.getByText('Must be at least 2 characters')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Must be less than 100 characters')
      ).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with complex nested components', () => {
      const ComplexComponent = () => {
        const { t } = require('react-i18next').useTranslation();
        return (
          <div>
            <header>
              <h1>{t('keyword_label')}</h1>
            </header>
            <main>
              <section>
                <h2>{t('location_label')}</h2>
                <p>{t('location_placeholder')}</p>
              </section>
              <section>
                <h2>{t('distance_label')}</h2>
                <ul>
                  <li>{t('distance_15_miles')}</li>
                  <li>{t('distance_20_miles')}</li>
                  <li>{t('distance_30_miles')}</li>
                </ul>
              </section>
            </main>
            <footer>
              <button>{t('find_jobs')}</button>
            </footer>
          </div>
        );
      };

      render(
        <I18nProvider>
          <ComplexComponent />
        </I18nProvider>
      );

      expect(
        screen.getByText('Keywords / Job Title / Job Ref')
      ).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('Distance')).toBeInTheDocument();
      expect(screen.getByText('e.g. town or postcode')).toBeInTheDocument();
      expect(screen.getByText('15 miles')).toBeInTheDocument();
      expect(screen.getByText('20 miles')).toBeInTheDocument();
      expect(screen.getByText('30 miles')).toBeInTheDocument();
      expect(screen.getByText('Find jobs now')).toBeInTheDocument();
    });

    it('should maintain translation context across component updates', () => {
      const { rerender } = render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      expect(
        screen.getByText('Keywords / Job Title / Job Ref')
      ).toBeInTheDocument();

      // Re-render with same provider
      rerender(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      expect(
        screen.getByText('Keywords / Job Title / Job Ref')
      ).toBeInTheDocument();
    });
  });
});
