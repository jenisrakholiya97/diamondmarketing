import { useEffect, useRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

const ObservedElement = ({ onIntersect, onResize }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect(entry);
          }
        });
      },
      { threshold: 0.1 }
    );

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        onResize(entry);
      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [onIntersect, onResize]);

  return (
    <div ref={containerRef} data-testid="observed-container" className="p-4">
      Observed Container Element
    </div>
  );
};

describe('DOM Observer Integration (IntersectionObserver & ResizeObserver)', () => {
  it('should trigger IntersectionObserver when element enters viewport', () => {
    const handleIntersect = vi.fn();
    const handleResize = vi.fn();

    render(<ObservedElement onIntersect={handleIntersect} onResize={handleResize} />);

    expect(screen.getByTestId('observed-container')).toBeInTheDocument();
    expect(handleIntersect).toHaveBeenCalledTimes(1);
    expect(handleIntersect.mock.calls[0][0].isIntersecting).toBe(true);
  });

  it('should trigger ResizeObserver on element dimensions change', () => {
    const handleIntersect = vi.fn();
    const handleResize = vi.fn();

    render(<ObservedElement onIntersect={handleIntersect} onResize={handleResize} />);

    expect(handleResize).toHaveBeenCalledTimes(1);
    expect(handleResize.mock.calls[0][0].contentRect.width).toBe(390);
  });
});
