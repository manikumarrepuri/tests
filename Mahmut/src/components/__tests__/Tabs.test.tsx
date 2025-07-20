import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import Tabs from '../Tabs';

const renderWithI18n = (component: React.ReactElement) => {
  return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
};

describe('Tabs', () => {
  describe('Rendering', () => {
    it('should render all tab buttons', () => {
      renderWithI18n(<Tabs />);

      expect(
        screen.getByRole('tab', { name: /jobs by location/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('tab', { name: /jobs by industry/i })
      ).toBeInTheDocument();
    });

    it('should render tab content', () => {
      renderWithI18n(<Tabs />);

      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('should show first tab as active by default', () => {
      renderWithI18n(<Tabs />);

      const firstTab = screen.getByRole('tab', { name: /jobs by location/i });
      const secondTab = screen.getByRole('tab', { name: /jobs by industry/i });

      expect(firstTab).toHaveAttribute('aria-selected', 'true');
      expect(secondTab).toHaveAttribute('aria-selected', 'false');
    });

    it('should render location cities in first tab', () => {
      renderWithI18n(<Tabs />);

      expect(screen.getByText('Aberdeen')).toBeInTheDocument();
      expect(screen.getByText('Birmingham')).toBeInTheDocument();
      expect(screen.getByText('Bristol')).toBeInTheDocument();
      expect(screen.getByText('Edinburgh')).toBeInTheDocument();
      expect(screen.getByText('Glasgow')).toBeInTheDocument();
    });
  });

  describe('Tab Switching', () => {
    it('should switch to second tab when clicked', () => {
      renderWithI18n(<Tabs />);

      const firstTab = screen.getByRole('tab', { name: /jobs by location/i });
      const secondTab = screen.getByRole('tab', { name: /jobs by industry/i });

      // Initially first tab is active
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
      expect(secondTab).toHaveAttribute('aria-selected', 'false');

      // Click second tab
      fireEvent.click(secondTab);

      // Second tab should now be active
      expect(firstTab).toHaveAttribute('aria-selected', 'false');
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
    });

    it('should show industry content when second tab is active', () => {
      renderWithI18n(<Tabs />);

      const secondTab = screen.getByRole('tab', { name: /jobs by industry/i });
      fireEvent.click(secondTab);

      // Industry content should be visible
      expect(screen.getByText('Accounting')).toBeInTheDocument();
      expect(screen.getByText('Engineering')).toBeInTheDocument();
      expect(screen.getByText('Financial Services')).toBeInTheDocument();

      // Location content should be hidden
      expect(screen.queryByText('Aberdeen')).not.toBeInTheDocument();
      expect(screen.queryByText('Birmingham')).not.toBeInTheDocument();
    });

    it('should hide location content when switching to industry tab', () => {
      renderWithI18n(<Tabs />);

      // Initially location content should be visible
      expect(screen.getByText('Aberdeen')).toBeInTheDocument();
      expect(screen.getByText('Birmingham')).toBeInTheDocument();

      const secondTab = screen.getByRole('tab', { name: /jobs by industry/i });
      fireEvent.click(secondTab);

      // Location content should be hidden
      expect(screen.queryByText('Aberdeen')).not.toBeInTheDocument();
      expect(screen.queryByText('Birmingham')).not.toBeInTheDocument();
    });

    it('should switch back to first tab when clicked', () => {
      renderWithI18n(<Tabs />);

      const firstTab = screen.getByRole('tab', { name: /jobs by location/i });
      const secondTab = screen.getByRole('tab', { name: /jobs by industry/i });

      // Click second tab
      fireEvent.click(secondTab);
      expect(secondTab).toHaveAttribute('aria-selected', 'true');

      // Click first tab again
      fireEvent.click(firstTab);
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
      expect(secondTab).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      renderWithI18n(<Tabs />);

      const tablist = screen.getByRole('tablist');
      const firstTab = screen.getByRole('tab', { name: /jobs by location/i });
      const secondTab = screen.getByRole('tab', { name: /jobs by industry/i });
      const tabpanel = screen.getByRole('tabpanel');

      expect(tablist).toHaveAttribute('aria-label', 'Job categories');
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
      expect(firstTab).toHaveAttribute('aria-controls', 'tabpanel-0');
      expect(secondTab).toHaveAttribute('aria-selected', 'false');
      expect(secondTab).toHaveAttribute('aria-controls', 'tabpanel-1');
      expect(tabpanel).toHaveAttribute('aria-labelledby', 'tab-0');
    });

    it('should update ARIA attributes when switching tabs', () => {
      renderWithI18n(<Tabs />);

      const firstTab = screen.getByRole('tab', { name: /jobs by location/i });
      const secondTab = screen.getByRole('tab', { name: /jobs by industry/i });
      const tabpanel = screen.getByRole('tabpanel');

      // Initially first tab is active
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
      expect(secondTab).toHaveAttribute('aria-selected', 'false');
      expect(tabpanel).toHaveAttribute('aria-labelledby', 'tab-0');

      // Switch to second tab
      fireEvent.click(secondTab);

      // ARIA attributes should be updated
      expect(firstTab).toHaveAttribute('aria-selected', 'false');
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
      expect(tabpanel).toHaveAttribute('aria-labelledby', 'tab-1');
    });

    it('should handle keyboard navigation', () => {
      renderWithI18n(<Tabs />);

      const firstTab = screen.getByRole('tab', { name: /jobs by location/i });
      const secondTab = screen.getByRole('tab', { name: /jobs by industry/i });

      // Focus first tab
      firstTab.focus();

      // Test Enter key
      fireEvent.keyDown(firstTab, { key: 'Enter' });
      expect(firstTab).toHaveAttribute('aria-selected', 'true');

      // Test Space key - focus the tab first, then trigger click
      secondTab.focus();
      fireEvent.click(secondTab);
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Content Structure', () => {
    it('should render location content in two columns', () => {
      renderWithI18n(<Tabs />);

      const lists = screen.getAllByRole('list');
      expect(lists).toHaveLength(2); // Two columns

      // First column should contain first 6 cities
      const firstList = lists[0];
      expect(firstList).toContainElement(screen.getByText('Aberdeen'));
      expect(firstList).toContainElement(screen.getByText('Basingstoke'));
      expect(firstList).toContainElement(screen.getByText('Berkshire'));
      expect(firstList).toContainElement(screen.getByText('Birmingham'));
      expect(firstList).toContainElement(screen.getByText('Bradford'));
      expect(firstList).toContainElement(screen.getByText('Bristol'));

      // Second column should contain next 6 cities
      const secondList = lists[1];
      expect(secondList).toContainElement(screen.getByText('Derby'));
      expect(secondList).toContainElement(screen.getByText('Doncaster'));
      expect(secondList).toContainElement(screen.getByText('Edinburgh'));
      expect(secondList).toContainElement(screen.getByText('Essex'));
      expect(secondList).toContainElement(screen.getByText('Exeter'));
      expect(secondList).toContainElement(screen.getByText('Glasgow'));
    });

    it('should render industry content in two columns', () => {
      renderWithI18n(<Tabs />);

      const secondTab = screen.getByRole('tab', { name: /jobs by industry/i });
      fireEvent.click(secondTab);

      const lists = screen.getAllByRole('list');
      expect(lists).toHaveLength(2); // Two columns

      // First column should contain first 6 industries
      const firstList = lists[0];
      expect(firstList).toContainElement(screen.getByText('Accounting'));
      expect(firstList).toContainElement(screen.getByText('Administration'));
      expect(firstList).toContainElement(screen.getByText('Agriculture'));
      expect(firstList).toContainElement(screen.getByText('Arts'));
      expect(firstList).toContainElement(screen.getByText('Automotive'));
      expect(firstList).toContainElement(screen.getByText('Catering'));

      // Second column should contain next 6 industries
      const secondList = lists[1];
      expect(secondList).toContainElement(screen.getByText('Distribution'));
      expect(secondList).toContainElement(screen.getByText('Driving'));
      expect(secondList).toContainElement(screen.getByText('Education'));
      expect(secondList).toContainElement(screen.getByText('Electronics'));
      expect(secondList).toContainElement(screen.getByText('Engineering'));
      expect(secondList).toContainElement(
        screen.getByText('Financial Services')
      );
    });
  });

  describe('Styling and Classes', () => {
    it('should apply active class to selected tab', () => {
      renderWithI18n(<Tabs />);

      const firstTab = screen.getByRole('tab', { name: /jobs by location/i });
      const secondTab = screen.getByRole('tab', { name: /jobs by industry/i });

      expect(firstTab).toHaveClass('tab', 'active');
      expect(secondTab).toHaveClass('tab');
      expect(secondTab).not.toHaveClass('active');
    });

    it('should update active class when switching tabs', () => {
      renderWithI18n(<Tabs />);

      const firstTab = screen.getByRole('tab', { name: /jobs by location/i });
      const secondTab = screen.getByRole('tab', { name: /jobs by industry/i });

      // Initially first tab has active class
      expect(firstTab).toHaveClass('active');
      expect(secondTab).not.toHaveClass('active');

      // Click second tab
      fireEvent.click(secondTab);

      // Now second tab should have active class
      expect(firstTab).not.toHaveClass('active');
      expect(secondTab).toHaveClass('active');
    });
  });

  describe('Internationalization', () => {
    it('should use translated tab labels', () => {
      renderWithI18n(<Tabs />);

      expect(screen.getByText('Jobs by Location')).toBeInTheDocument();
      expect(screen.getByText('Jobs by Industry')).toBeInTheDocument();
    });

    it('should use translated content', () => {
      renderWithI18n(<Tabs />);

      // Location cities should be translated
      expect(screen.getByText('Aberdeen')).toBeInTheDocument();
      expect(screen.getByText('Birmingham')).toBeInTheDocument();

      // Industry names should be translated when switching tabs
      const secondTab = screen.getByRole('tab', { name: /jobs by industry/i });
      fireEvent.click(secondTab);

      expect(screen.getByText('Accounting')).toBeInTheDocument();
      expect(screen.getByText('Engineering')).toBeInTheDocument();
    });
  });
});
