'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { useForm } from '@/lib/hooks/use-form';
import { z } from 'zod';
import { Send, FileText } from 'lucide-react';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.email('Please enter a valid email address'),
  subject: z.string().min(1, 'Please enter a subject'),
  message: z.string().min(10, 'Please provide more details (at least 10 characters)'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export const ContactFormSection = () => {
  const { siteLoading } = useSiteStore(state => state);

  const {
    formValues,
    formErrors,
    errorsVisible,
    loading,
    handleInputChange,
    onChange,
    handleSubmit,
  } = useForm<typeof contactSchema>({
    formSchema: contactSchema,
    defaultFormValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    onSubmit: async (values: ContactFormValues) => {
      try {
        console.log({ values });
        // Simulate form submission - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // TODO: Replace with actual API call
        // const { data, error } = await callApi('SUBMIT_CONTACT_FORM', { payload: values });

        toast.success('Message sent successfully! We\'ll get back to you soon.');
        return true;
      } catch (error) {
        toast.error('Failed to send message. Please try again.');
        console.error(error);
        return false;
      }
    },
  });

  return (
    <SectionContainer className="bg-card">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-sans">
            Send Us a Message
          </h2>
          <p className="text-muted-foreground">
            Have a question, suggestion, or prayer request? Fill out the form below and we&apos;ll get
            back to you as soon as possible.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          {errorsVisible && formErrors.root && formErrors.root.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
              {formErrors.root[0]}
            </div>
          )}

          <RegularInput
            label="Full Name"
            name="name"
            placeholder="John Doe"
            required
            value={formValues.name}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.name : []}
          />

          <RegularInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            value={formValues.email}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.email : []}
          />

          <RegularInput
            label="Subject"
            name="subject"
            placeholder="What is this regarding?"
            required
            value={formValues.subject}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.subject : []}
          />

          <RegularTextarea
            label="Message"
            name="message"
            placeholder="Tell us how we can help you..."
            rows={6}
            required
            value={formValues.message}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.message : []}
          />

          <RegularBtn
            type="submit"
            className="w-full sm:w-auto bg-gradient-to-r from-[#5730D5] to-[#8A2BE2] text-white"
            disabled={loading}
            RightIcon={Send}
            rightIconProps={{ className: 'size-4' }}
            text={loading ? 'Sending...' : 'Send Message'}
          />
        </form>
      </motion.div>
    </SectionContainer>
  );
};
