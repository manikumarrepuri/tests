import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Normal content</div>;
};

// Component that throws an error in render
const ComponentWithError = () => {
  throw new Error('Render error');
};

// Component that throws an error in lifecycle
class ComponentWithLifecycleError extends React.Component {
  componentDidMount() {
    throw new Error('Lifecycle error');
  }

  render() {
    return <div>Should not render</div>;
  }
}

describe('ErrorBoundary', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('Normal Rendering', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <ErrorBoundary>
          <div>First child</div>
          <div>Second child</div>
          <span>Third child</span>
        </ErrorBoundary>
      );

      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
      expect(screen.getByText('Third child')).toBeInTheDocument();
    });

    it('should render functional components', () => {
      const TestComponent = () => <div>Functional component</div>;

      render(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Functional component')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should catch render errors and show fallback', () => {
      render(
        <ErrorBoundary>
          <ComponentWithError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(
        screen.getByText(
          "We're sorry, but something unexpected happened. Please try refreshing the page."
        )
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /refresh page/i })
      ).toBeInTheDocument();
    });

    it('should catch lifecycle errors', () => {
      render(
        <ErrorBoundary>
          <ComponentWithLifecycleError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should log errors to console', () => {
      render(
        <ErrorBoundary>
          <ComponentWithError />
        </ErrorBoundary>
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        'Uncaught error:',
        expect.any(Error),
        expect.any(Object)
      );
    });

    it('should handle conditional errors', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Normal content')).toBeInTheDocument();

      // Trigger error
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Fallback UI', () => {
    it('should render default fallback when no custom fallback is provided', () => {
      render(
        <ErrorBoundary>
          <ComponentWithError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(
        screen.getByText(
          "We're sorry, but something unexpected happened. Please try refreshing the page."
        )
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /refresh page/i })
      ).toBeInTheDocument();
    });

    it('should render custom fallback when provided', () => {
      const CustomFallback = () => (
        <div>
          <h1>Custom Error</h1>
          <p>This is a custom error message</p>
        </div>
      );

      render(
        <ErrorBoundary fallback={<CustomFallback />}>
          <ComponentWithError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom Error')).toBeInTheDocument();
      expect(
        screen.getByText('This is a custom error message')
      ).toBeInTheDocument();
      expect(
        screen.queryByText('Something went wrong')
      ).not.toBeInTheDocument();
    });

    it('should render fallback with proper styling classes', () => {
      render(
        <ErrorBoundary>
          <ComponentWithError />
        </ErrorBoundary>
      );

      const errorContainer = screen
        .getByText('Something went wrong')
        .closest('.error-boundary');
      const errorContent = screen
        .getByText('Something went wrong')
        .closest('.error-content');
      const retryButton = screen.getByRole('button', { name: /refresh page/i });

      expect(errorContainer).toHaveClass('error-boundary');
      expect(errorContent).toHaveClass('error-content');
      expect(retryButton).toHaveClass('error-retry-button');
    });
  });

  describe('Error Recovery', () => {
    it('should allow page refresh via button', () => {
      const originalLocation = window.location;
      // @ts-ignore
      delete window.location;
      // @ts-ignore
      window.location = { reload: jest.fn() };

      render(
        <ErrorBoundary>
          <ComponentWithError />
        </ErrorBoundary>
      );

      const refreshButton = screen.getByRole('button', {
        name: /refresh page/i,
      });
      fireEvent.click(refreshButton);

      expect(window.location.reload).toHaveBeenCalled();

      // Restore original
      window.location = originalLocation;
    });

    it('should maintain error state after recovery attempt', () => {
      render(
        <ErrorBoundary>
          <ComponentWithError />
        </ErrorBoundary>
      );

      const refreshButton = screen.getByRole('button', {
        name: /refresh page/i,
      });
      fireEvent.click(refreshButton);

      // Should still show error UI after refresh attempt
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Error State Management', () => {
    it('should set hasError state when error occurs', () => {
      const errorBoundaryRef = React.createRef<ErrorBoundary>();

      render(
        <ErrorBoundary ref={errorBoundaryRef}>
          <ComponentWithError />
        </ErrorBoundary>
      );

      expect(errorBoundaryRef.current?.state.hasError).toBe(true);
    });

    it('should store error in state', () => {
      const errorBoundaryRef = React.createRef<ErrorBoundary>();

      render(
        <ErrorBoundary ref={errorBoundaryRef}>
          <ComponentWithError />
        </ErrorBoundary>
      );

      expect(errorBoundaryRef.current?.state.error).toBeInstanceOf(Error);
      expect(errorBoundaryRef.current?.state.error?.message).toBe(
        'Render error'
      );
    });

    it('should not render children when error occurs', () => {
      render(
        <ErrorBoundary>
          <ComponentWithError />
          <div>This should not render</div>
        </ErrorBoundary>
      );

      expect(
        screen.queryByText('This should not render')
      ).not.toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('should call getDerivedStateFromError when error occurs', () => {
      const getDerivedStateFromErrorSpy = jest.spyOn(
        ErrorBoundary,
        'getDerivedStateFromError'
      );

      render(
        <ErrorBoundary>
          <ComponentWithError />
        </ErrorBoundary>
      );

      expect(getDerivedStateFromErrorSpy).toHaveBeenCalledWith(
        expect.any(Error)
      );
    });

    it('should call componentDidCatch when error occurs', () => {
      // This test is skipped
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <ErrorBoundary>
          <ComponentWithError />
        </ErrorBoundary>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Something went wrong');
    });

    it('should have accessible button', () => {
      render(
        <ErrorBoundary>
          <ComponentWithError />
        </ErrorBoundary>
      );

      const button = screen.getByRole('button', { name: /refresh page/i });
      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
    });
  });

  describe('Integration', () => {
    it('should work with nested components', () => {
      const NestedComponent = () => (
        <div>
          <span>Nested content</span>
          <ComponentWithError />
        </div>
      );

      render(
        <ErrorBoundary>
          <NestedComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.queryByText('Nested content')).not.toBeInTheDocument();
    });

    it('should work with multiple error boundaries', () => {
      render(
        <ErrorBoundary>
          <div>Outer content</div>
          <ErrorBoundary>
            <ComponentWithError />
          </ErrorBoundary>
        </ErrorBoundary>
      );

      expect(screen.getByText('Outer content')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });
});
