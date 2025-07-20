import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });

    it('should render with custom size', () => {
      render(<LoadingSpinner size="large" />);

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('loading-spinner', 'spinner-large');
    });

    it('should render with custom color', () => {
      render(<LoadingSpinner color="#ff0000" />);

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveStyle({ color: '#ff0000' });
    });

    it('should render with custom className', () => {
      render(<LoadingSpinner className="custom-spinner" />);

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass(
        'loading-spinner',
        'spinner-medium',
        'custom-spinner'
      );
    });

    it('should render with all custom props', () => {
      render(
        <LoadingSpinner size="small" color="#00ff00" className="test-class" />
      );

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass(
        'loading-spinner',
        'spinner-small',
        'test-class'
      );
      expect(spinner).toHaveStyle({ color: '#00ff00' });
    });
  });

  describe('Size Variants', () => {
    it('should apply small size class', () => {
      render(<LoadingSpinner size="small" />);

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('spinner-small');
      expect(spinner).not.toHaveClass('spinner-medium', 'spinner-large');
    });

    it('should apply medium size class (default)', () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('spinner-medium');
      expect(spinner).not.toHaveClass('spinner-small', 'spinner-large');
    });

    it('should apply large size class', () => {
      render(<LoadingSpinner size="large" />);

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('spinner-large');
      expect(spinner).not.toHaveClass('spinner-small', 'spinner-medium');
    });
  });

  describe('Color Styling', () => {
    it('should apply custom color style', () => {
      render(<LoadingSpinner color="#ff0000" />);

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveStyle({ color: '#ff0000' });
    });

    it('should use currentColor when no color is provided', () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveStyle({ color: 'currentColor' });
    });

    it('should override color with custom value', () => {
      render(<LoadingSpinner color="#00ff00" />);

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveStyle({ color: '#00ff00' });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('role', 'status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });

    it('should be accessible to screen readers', () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();

      // Check that the spinner has the inner spinner element
      const innerSpinner = spinner.querySelector('.spinner') as HTMLElement;
      expect(innerSpinner).toBeInTheDocument();
    });

    it('should maintain accessibility with custom props', () => {
      render(
        <LoadingSpinner size="large" color="#ff0000" className="custom-class" />
      );

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('role', 'status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });
  });

  describe('CSS Classes', () => {
    it('should have base loading-spinner class', () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('loading-spinner');
    });

    it('should combine multiple classes correctly', () => {
      render(<LoadingSpinner size="small" className="extra-class" />);

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass(
        'loading-spinner',
        'spinner-small',
        'extra-class'
      );
    });

    it('should not have conflicting size classes', () => {
      render(<LoadingSpinner size="large" />);

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('spinner-large');
      expect(spinner).not.toHaveClass('spinner-small', 'spinner-medium');
    });
  });

  describe('DOM Structure', () => {
    it('should render with correct HTML structure', () => {
      render(<LoadingSpinner />);

      const container = screen.getByRole('status');
      const innerSpinner = container.querySelector('.spinner') as HTMLElement;

      expect(container).toBeInTheDocument();
      expect(innerSpinner).toBeInTheDocument();
      expect(container).toContainElement(innerSpinner);
    });

    it('should render inner spinner element', () => {
      render(<LoadingSpinner />);

      const innerSpinner = screen
        .getByRole('status')
        .querySelector('.spinner') as HTMLElement;
      expect(innerSpinner).toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    it('should handle empty string props', () => {
      render(<LoadingSpinner className="" />);

      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('loading-spinner', 'spinner-medium');
    });
  });

  describe('Integration', () => {
    it('should work within other components', () => {
      render(
        <div data-testid="container">
          <LoadingSpinner size="small" />
          <span>Content</span>
        </div>
      );

      const container = screen.getByTestId('container');
      const spinner = screen.getByRole('status');
      const content = screen.getByText('Content');

      expect(container).toContainElement(spinner);
      expect(container).toContainElement(content);
    });

    it('should maintain styling when nested', () => {
      render(
        <div style={{ color: '#333' }}>
          <LoadingSpinner size="large" />
        </div>
      );

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('spinner-large');
      expect(spinner).toHaveStyle({ color: 'currentColor' });
    });
  });
});
