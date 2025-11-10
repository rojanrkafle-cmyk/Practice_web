import { render, screen, waitFor } from '@/tests/utils';
import userEvent from '@testing-library/user-event';
import ContactForm from '../ContactForm';

// Mock framer-motion to avoid animation-related issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Loader2 icon from lucide-react
jest.mock('lucide-react', () => ({
  Loader2: () => <div data-testid="loader-icon">Loading...</div>,
}));

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('ContactForm', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    // Reset fetch mock default response
    mockFetch.mockImplementation(() => Promise.resolve({ ok: true }));
  });

  it('renders form fields', () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/area of interest/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/i accept the terms and conditions/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    // Submit empty form first to trigger all validations
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    // Fill in each field with invalid data to trigger specific validation messages
    await user.type(screen.getByLabelText(/name/i), '1');
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.type(screen.getByLabelText(/message/i), 'short');
    
    // Check for specific error messages
    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/please select your area of interest/i)).toBeInTheDocument();
      expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/you must accept the terms and conditions/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // Trigger onBlur validation
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    );
    
    render(<ContactForm />);
    
    const validData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      interest: 'katana',
      message: 'This is a test message that meets the minimum length requirement',
      acceptTerms: true
    };
    
    // Fill out form fields
    await user.type(screen.getByLabelText(/name/i), validData.name);
    await user.type(screen.getByLabelText(/email/i), validData.email);
    await user.type(screen.getByLabelText(/phone/i), validData.phone);
    await user.selectOptions(screen.getByLabelText(/area of interest/i), validData.interest);
    await user.type(screen.getByLabelText(/message/i), validData.message);
    await user.click(screen.getByLabelText(/i accept the terms and conditions/i));
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    // Verify API call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validData),
      });
    });

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
      expect(screen.queryByTestId('loader-icon')).not.toBeInTheDocument();
    });
  });

  it('shows loading state while submitting', async () => {
    const user = userEvent.setup();
    // Create a promise that won't resolve immediately
    let resolveSubmission: (value: any) => void;
    mockFetch.mockImplementationOnce(() => new Promise(resolve => {
      resolveSubmission = resolve;
    }));
    
    render(<ContactForm />);

    const validData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message that meets the minimum length requirement',
      interest: 'katana',
      acceptTerms: true
    };
    
    // Fill out form fields
    await user.type(screen.getByLabelText(/name/i), validData.name);
    await user.type(screen.getByLabelText(/email/i), validData.email);
    await user.type(screen.getByLabelText(/message/i), validData.message);
    await user.selectOptions(screen.getByLabelText(/area of interest/i), validData.interest);
    await user.click(screen.getByLabelText(/i accept the terms and conditions/i));
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    // Click but don't await the submission completion
    const submitPromise = user.click(submitButton);
    
    // Check loading state
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
      expect(screen.getByText(/submitting/i)).toBeInTheDocument();
    });

    // Resolve the submission
    resolveSubmission!({ ok: true, json: () => Promise.resolve({ success: true }) });

    // Wait for submission to finish
    await submitPromise;
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(screen.queryByTestId('loader-icon')).not.toBeInTheDocument();
      expect(screen.queryByText(/submitting/i)).not.toBeInTheDocument();
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
    });
  });

  it('shows error message on submission failure', async () => {
    const user = userEvent.setup();
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Server error' })
      })
    );
    
    render(<ContactForm />);

    const validData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message that meets the minimum length requirement',
      interest: 'katana',
      acceptTerms: true
    };
    
    // Fill out form
    await user.type(screen.getByLabelText(/name/i), validData.name);
    await user.type(screen.getByLabelText(/email/i), validData.email);
    await user.type(screen.getByLabelText(/message/i), validData.message);
    await user.selectOptions(screen.getByLabelText(/area of interest/i), validData.interest);
    await user.click(screen.getByLabelText(/i accept the terms and conditions/i));
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Verify loading state
    expect(submitButton).toBeDisabled();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.getByText(/submitting/i)).toBeInTheDocument();

    // Verify error state
    await waitFor(() => {
      expect(screen.getByText(/there was an error submitting your message/i)).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
      expect(screen.queryByTestId('loader-icon')).not.toBeInTheDocument();
      expect(screen.queryByText(/submitting/i)).not.toBeInTheDocument();
    });
  });
  
  it('validates phone number format when provided', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    // Test invalid phone number
    await user.type(screen.getByLabelText(/phone/i), 'invalid-phone');
    await user.tab();
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
    });
    
    // Clear and test valid phone number
    await user.clear(screen.getByLabelText(/phone/i));
    await user.type(screen.getByLabelText(/phone/i), '+1234567890');
    await user.tab();
    
    await waitFor(() => {
      expect(screen.queryByText(/please enter a valid phone number/i)).not.toBeInTheDocument();
    });
  });
  
  it('resets form after successful submission', async () => {
    const user = userEvent.setup();
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    );
    
    render(<ContactForm />);
    
    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Test message content');
    await user.selectOptions(screen.getByLabelText(/area of interest/i), 'katana');
    await user.click(screen.getByLabelText(/i accept the terms and conditions/i));
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    // Wait for success and verify form reset
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/message/i)).toHaveValue('');
      expect(screen.getByLabelText(/area of interest/i)).toHaveValue('');
      expect(screen.getByLabelText(/i accept the terms and conditions/i)).not.toBeChecked();
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
    });
  });
});