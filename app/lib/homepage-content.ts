export const HOMEPAGE_STORAGE_KEY = 'hirepro_homepage_content_v1';
export const HOMEPAGE_PREVIEW_STORAGE_KEY = 'hirepro_homepage_preview_v1';

export type HomepageContent = {
  heroTitle: string; heroAccent: string; heroSuffix: string; heroDescription: string; popularSearches: string[];
  categoriesTitle: string; featuredTitle: string; processTitle: string; processSubtitle: string;
  processSteps: Array<{ title: string; description: string }>;
  ctaTitle: string; ctaDescription: string; ctaButton: string; ctaButtonUrl: string;
  testimonialsTitle: string; footerDescription: string;
  seoTitle: string; seoDescription: string;
  sections: { categories: boolean; featured: boolean; process: boolean; cta: boolean; stats: boolean; testimonials: boolean; app: boolean; newsletter: boolean };
};

export type HomepageContentResponse = {
  hero: { title: string; highlight: string; suffix: string; description: string; popular_searches: string[] };
  headings: { categories: string; featured_businesses: string; process: string; testimonials: string };
  process: { subtitle: string; steps: Array<{ title: string; description: string }> };
  business_cta: { title: string; description: string; button_label: string; button_url: string };
  footer: { description: string };
  seo: { title: string; description: string };
  sections: HomepageContent['sections'];
};

export const defaultHomepageContent: HomepageContent = {
  heroTitle: 'Find Trusted Local', heroAccent: 'Businesses', heroSuffix: 'Near You', heroDescription: 'HirePro connects you with the best local services around you. Fast, reliable, & trusted.',
  popularSearches: ['Plumber', 'Electrician', 'Car Repair', 'Cleaning', 'Home Services'],
  categoriesTitle: 'Browse Categories', featuredTitle: 'Featured Local Businesses', processTitle: 'How It Works', processSubtitle: 'Get the best services in 3 simple steps',
  processSteps: [{ title: 'Search', description: 'Search for the service you need in your area' }, { title: 'Choose', description: 'Compare profiles, reviews, and pricing' }, { title: 'Hire & Relax', description: 'Book the best pro and enjoy quality service' }],
  ctaTitle: 'Are you a local business?', ctaDescription: 'List your business with HirePro and reach new customers', ctaButton: 'Add Your Business', ctaButtonUrl: '/add-your-business',
  testimonialsTitle: 'What People Say', footerDescription: 'Find trusted local businesses and services near you. Fast, reliable & secure.',
  seoTitle: 'HirePro — Trusted Local Businesses', seoDescription: 'Find reliable local professionals and services near you.',
  sections: { categories: true, featured: true, process: true, cta: true, stats: true, testimonials: true, app: true, newsletter: true },
};

export function readHomepageContent(): HomepageContent {
  if (typeof window === 'undefined') return defaultHomepageContent;
  try {
    const saved = JSON.parse(localStorage.getItem(HOMEPAGE_STORAGE_KEY) ?? '{}');
    return { ...defaultHomepageContent, ...saved, sections: { ...defaultHomepageContent.sections, ...(saved.sections ?? {}) } };
  } catch { return defaultHomepageContent; }
}

export function saveHomepageContent(content: HomepageContent) {
  localStorage.setItem(HOMEPAGE_STORAGE_KEY, JSON.stringify(content));
  window.dispatchEvent(new CustomEvent('hirepro:homepage-updated', { detail: content }));
}

export function homepageContentFromApi(value: HomepageContentResponse): HomepageContent {
  return {
    heroTitle: value.hero?.title ?? defaultHomepageContent.heroTitle,
    heroAccent: value.hero?.highlight ?? defaultHomepageContent.heroAccent,
    heroSuffix: value.hero?.suffix ?? defaultHomepageContent.heroSuffix,
    heroDescription: value.hero?.description ?? defaultHomepageContent.heroDescription,
    popularSearches: value.hero?.popular_searches ?? defaultHomepageContent.popularSearches,
    categoriesTitle: value.headings?.categories ?? defaultHomepageContent.categoriesTitle,
    featuredTitle: value.headings?.featured_businesses ?? defaultHomepageContent.featuredTitle,
    processTitle: value.headings?.process ?? defaultHomepageContent.processTitle,
    processSubtitle: value.process?.subtitle ?? defaultHomepageContent.processSubtitle,
    processSteps: value.process?.steps?.length ? value.process.steps : defaultHomepageContent.processSteps,
    testimonialsTitle: value.headings?.testimonials ?? defaultHomepageContent.testimonialsTitle,
    ctaTitle: value.business_cta?.title ?? defaultHomepageContent.ctaTitle,
    ctaDescription: value.business_cta?.description ?? defaultHomepageContent.ctaDescription,
    ctaButton: value.business_cta?.button_label ?? defaultHomepageContent.ctaButton,
    ctaButtonUrl: value.business_cta?.button_url ?? defaultHomepageContent.ctaButtonUrl,
    footerDescription: value.footer?.description ?? defaultHomepageContent.footerDescription,
    seoTitle: value.seo?.title ?? defaultHomepageContent.seoTitle,
    seoDescription: value.seo?.description ?? defaultHomepageContent.seoDescription,
    sections: { ...defaultHomepageContent.sections, ...(value.sections ?? {}) },
  };
}

export function homepageContentToApi(value: HomepageContent): HomepageContentResponse {
  return {
    hero: { title: value.heroTitle, highlight: value.heroAccent, suffix: value.heroSuffix, description: value.heroDescription, popular_searches: value.popularSearches },
    headings: { categories: value.categoriesTitle, featured_businesses: value.featuredTitle, process: value.processTitle, testimonials: value.testimonialsTitle },
    process: { subtitle: value.processSubtitle, steps: value.processSteps },
    business_cta: { title: value.ctaTitle, description: value.ctaDescription, button_label: value.ctaButton, button_url: value.ctaButtonUrl },
    footer: { description: value.footerDescription },
    seo: { title: value.seoTitle, description: value.seoDescription },
    sections: value.sections,
  };
}

export function saveHomepagePreview(content: HomepageContent) {
  localStorage.setItem(HOMEPAGE_PREVIEW_STORAGE_KEY, JSON.stringify(content));
}

export function readHomepagePreview(): HomepageContent | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = localStorage.getItem(HOMEPAGE_PREVIEW_STORAGE_KEY);
    if (!value) return null;
    const saved = JSON.parse(value) as Partial<HomepageContent>;
    return { ...defaultHomepageContent, ...saved, sections: { ...defaultHomepageContent.sections, ...(saved.sections ?? {}) } };
  } catch { return null; }
}
