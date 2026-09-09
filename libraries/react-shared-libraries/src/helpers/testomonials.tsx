import type { ReactNode } from 'react';

export interface TestimonialEntry {
  picture: string;
  name: string;
  description: string;
  content: ReactNode;
}

// Deliberately empty.
//
// These arrays previously held fifteen testimonials inherited from upstream
// Postiz with the product name search-and-replaced to "Hookpost". Real, named
// people - "John R., Founder", "Johannes D., CEO", "Vince C., Developer
// Relations Engineer" - were shown endorsing a product they had never used or
// heard of, on the live signup page. That is a fabricated endorsement, and it
// is the kind of thing a platform reviewer or a journalist notices.
//
// Their avatars pointed at /auth/avatars/*.jpg, which never existed in this
// deployment, so the signup page also fired fifteen 404s on every load.
//
// TestimonialComponent returns null while these are empty, so nothing renders.
// Add entries here only for quotes from real customers who have agreed to be
// quoted by name, with an avatar that actually exists in public/auth/avatars/.
export const testimonials1: TestimonialEntry[] = [];

export const testimonials2: TestimonialEntry[] = [];
