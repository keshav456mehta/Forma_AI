import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

function SampleComponent() {
  return <h1>Forma AI Test</h1>;
}

describe('Forma AI Sample Test', () => {
  it('renders the sample component correctly', () => {
    render(<SampleComponent />);

    expect(
      screen.getByRole('heading', { name: 'Forma AI Test' })
    ).toBeInTheDocument();
  });
});