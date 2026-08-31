import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import LoadingState from './LoadingState';
import ResumeDraftEntry from './ResumeDraftEntry';
import SaveSuccessState from './SaveSuccessState';

describe('save/resume UI components', () => {
  it('shows a loading indicator with the supplied label', () => {
    render(<LoadingState label="Loading your saved draft..." />);

    expect(screen.getByText('Loading your saved draft...')).toBeInTheDocument();
    expect(document.querySelector('.loading-state')).toBeInTheDocument();
    expect(document.querySelector('.spinner')).toBeInTheDocument();
  });

  it('accepts a resume code and calls onResume with the entered value', () => {
    const onResume = vi.fn();

    render(<ResumeDraftEntry onResume={onResume} />);

    fireEvent.change(screen.getByPlaceholderText(/enter your resume code/i), {
      target: { value: 'ABC123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /resume draft/i }));

    expect(onResume).toHaveBeenCalledWith('ABC123');
  });

  it('renders the saved resume code clearly with a copy action', () => {
    render(<SaveSuccessState resumeCode="ABC123" />);

    expect(screen.getByText(/draft saved successfully/i)).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy code/i })).toBeInTheDocument();
  });
});
