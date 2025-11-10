import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Zod schema for form validation
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number').optional(),
  interest: z.enum(['katana', 'wakizashi', 'tanto', 'custom', 'consultation'], {
    message: 'Please select your area of interest',
  }),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      interest: undefined,
      message: '',
      acceptTerms: false,
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus('idle');
    setSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 0)); // Allow UI to update

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSubmitStatus('success');
        reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Contact form submission error:', error);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 0)); // Allow UI to update
      setSubmitting(false);
    }
  };

  const inputStyles = "w-full px-4 py-2 bg-[rgba(26,26,26,0.5)] border border-gold text-white font-inter text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200";
  const labelStyles = "block mb-2 text-sm font-medium text-white";
  const errorStyles = "text-crimson text-sm mt-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6">
      <div>
        <label htmlFor="name" className={labelStyles}>Name</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              id="name"
              className={inputStyles}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
          )}
        />
        <AnimatePresence>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={errorStyles}
              id="name-error"
              role="alert"
            >
              {errors.name.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div>
        <label htmlFor="email" className={labelStyles}>Email</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="email"
              id="email"
              className={inputStyles}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          )}
        />
        <AnimatePresence>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={errorStyles}
              id="email-error"
              role="alert"
            >
              {errors.email.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div>
        <label htmlFor="phone" className={labelStyles}>Phone (Optional)</label>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="tel"
              id="phone"
              className={inputStyles}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
          )}
        />
        <AnimatePresence>
          {errors.phone && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={errorStyles}
              id="phone-error"
              role="alert"
            >
              {errors.phone.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div>
        <label htmlFor="interest" className={labelStyles}>Area of Interest</label>
        <Controller
          name="interest"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              id="interest"
              className={inputStyles}
              aria-invalid={!!errors.interest}
              aria-describedby={errors.interest ? "interest-error" : undefined}
            >
              <option value="">Select your interest</option>
              <option value="katana">Katana</option>
              <option value="wakizashi">Wakizashi</option>
              <option value="tanto">Tanto</option>
              <option value="custom">Custom Order</option>
              <option value="consultation">Consultation</option>
            </select>
          )}
        />
        <AnimatePresence>
          {errors.interest && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={errorStyles}
              id="interest-error"
              role="alert"
            >
              {errors.interest.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div>
        <label htmlFor="message" className={labelStyles}>Message</label>
        <Controller
          name="message"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              id="message"
              rows={4}
              className={inputStyles}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
          )}
        />
        <AnimatePresence>
          {errors.message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={errorStyles}
              id="message-error"
              role="alert"
            >
              {errors.message.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-start">
        <Controller
          name="acceptTerms"
          control={control}
          render={({ field }) => (
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="acceptTerms"
                className="w-4 h-4 border-gold rounded bg-[rgba(26,26,26,0.5)] focus:ring-2 focus:ring-gold"
                checked={field.value}
                onChange={field.onChange}
                aria-invalid={!!errors.acceptTerms}
                aria-describedby={errors.acceptTerms ? "terms-error" : undefined}
              />
            </div>
          )}
        />
        <label htmlFor="acceptTerms" className="ml-2 text-sm text-white">
          I accept the terms and conditions
        </label>
      </div>
      <AnimatePresence>
        {errors.acceptTerms && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={errorStyles}
            id="terms-error"
            role="alert"
          >
            {errors.acceptTerms.message}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={submitting}
        aria-disabled={submitting}
        aria-busy={submitting}
        className={`w-full py-3 px-6 bg-gold text-black font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center ${
          submitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {submitting ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Submitting...</span>
          </div>
        ) : (
          'Submit'
        )}
      </button>

      <AnimatePresence>
        {submitStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-4 p-4 rounded-lg ${
              submitStatus === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
            }`}
            role="alert"
          >
            {submitStatus === 'success'
              ? 'Thank you for your message. We will get back to you soon.'
              : 'There was an error submitting your message. Please try again.'}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default ContactForm;