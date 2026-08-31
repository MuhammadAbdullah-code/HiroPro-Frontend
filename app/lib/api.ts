export type Id = string;
export type ISODateTime = string;
export type Json = Record<string, unknown>;

export interface TokenResponse { access_token: string; refresh_token?: string | null; token_type: string }
export type AccountRole = 'customer' | 'business';
export interface User { id: Id; email: string; full_name: string; is_admin: boolean; role: AccountRole; profile_image_url?: string | null; avatar?: string; created_at: ISODateTime }
export interface Profile { id: Id; email: string; full_name: string; role: 'customer' | 'provider'; profile_image_url: string | null; created_at: ISODateTime }
export interface ProfileUpdateInput extends Json { full_name?: string; email?: string; profile_image_url?: string; current_password?: string; new_password?: string }
export interface UploadedFile { id: Id; storage_provider: string; content_type: string; url: string }
export interface FAQ { id: Id; question: string; answer: string; sort_order: number }
export interface Category { id: Id; name: string; slug: string; description: string }
export interface CategoryDetail extends Category { faqs: FAQ[] }
export interface VerificationDocument extends Json { id?: Id; type?: string; document_type?: string; file_url?: string; url?: string; file_name?: string; status?: string; uploaded_at?: ISODateTime }
export interface Business { id: Id; owner_id: Id; category_id: Id; name: string; slug: string; description: string; city: string; address: string; phone: string; website: string; latitude: number | null; longitude: number | null; is_verified: boolean; is_active: boolean; view_count: number; created_at: ISODateTime; verification_status?: string; verification_submitted_at?: ISODateTime; verification_rejection_reason?: string | null; cnic_url?: string | null; professional_work_certificate_url?: string | null; documents?: VerificationDocument[] }
export interface Review { id: Id; user_id: Id; business_id: Id; rating: number; title: string; comment: string; helpful_count: number; created_at: ISODateTime }
export interface Quote { id: Id; business_id: Id; details: string; budget: number | null; status: string; created_at: ISODateTime }
export interface Onboarding { user_id: Id; current_step: number; data: Record<string, unknown>; completed: boolean }
export interface Notification { id: Id; title: string; message: string; is_read: boolean; created_at: ISODateTime }
export interface Preference { email_notifications: boolean; push_notifications: boolean; theme: string; language: string }
export interface RegisterInput { email: string; password: string; full_name: string; role: AccountRole }
export interface LoginInput { email: string; password: string }
export interface OAuthInput { provider: 'google' | 'facebook' | 'apple'; provider_token: string; email: string; full_name: string }
export interface BusinessInput { category_id: Id; name: string; description: string; city: string; address?: string; phone?: string; website?: string; latitude?: number | null; longitude?: number | null }
export interface BusinessUpdateInput { name?: string; description?: string; city?: string; address?: string; phone?: string; website?: string; latitude?: number | null; longitude?: number | null }
export interface BusinessFilters { q?: string; category_id?: Id; city?: string; verified?: boolean; limit?: number; offset?: number }
export interface ReviewInput { rating: number; title?: string; comment: string }
export interface QuoteInput { business_id: Id; details: string; budget?: number | null }
export interface ContactInput { name: string; email: string; subject: string; message: string }
export interface OnboardingInput { current_step: number; data?: Record<string, unknown>; completed?: boolean }
export interface PreferenceInput { email_notifications?: boolean; push_notifications?: boolean; theme?: 'light' | 'dark' | 'system'; language?: string }
export interface AnalyticsInput { business_id?: Id | null; metadata?: Record<string, unknown> }
export interface AdminStats { users: number; businesses: number; reviews: number; quotes: number; open_contact_messages: number }
export interface HomepageContentResponse {
  hero: { title: string; highlight: string; suffix: string; description: string; popular_searches: string[] };
  headings: { categories: string; featured_businesses: string; process: string; testimonials: string };
  process: { subtitle: string; steps: Array<{ title: string; description: string }> };
  business_cta: { title: string; description: string; button_label: string; button_url: string };
  footer: { description: string };
  seo: { title: string; description: string };
  sections: { categories: boolean; featured: boolean; process: boolean; cta: boolean; stats: boolean; testimonials: boolean; app: boolean; newsletter: boolean };
}
export interface HomepageTestimonial extends Json {
  id?: Id;
  name?: string;
  full_name?: string;
  customer_name?: string;
  review?: string;
  comment?: string;
  content?: string;
  rating?: number;
  avatar_url?: string | null;
  is_verified?: boolean;
}

export class ApiError extends Error {
  constructor(public readonly status: number, public readonly detail: unknown) {
    super(formatApiErrorDetail(detail, status));
    this.name = 'ApiError';
  }
}

function formatApiErrorDetail(detail: unknown, status: number): string {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    const messages = detail.map(item => {
      if (!item || typeof item !== 'object') return String(item);
      const issue = item as { msg?: unknown; loc?: unknown };
      const field = Array.isArray(issue.loc) ? issue.loc.filter(part => part !== 'body').join('.') : '';
      return `${field ? `${field}: ` : ''}${String(issue.msg ?? 'Invalid value')}`;
    });
    if (messages.length) return messages.join(' ');
  }
  if (detail && typeof detail === 'object' && 'message' in detail) return String((detail as { message: unknown }).message);
  return `API request failed (${status})`;
}

type Query = Record<string, string | number | boolean | null | undefined>;
type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown; query?: Query; auth?: boolean };

export class HireProApi {
  private token: string | null = null;
  private readonly baseUrl: string;

  constructor(origin = 'http://127.0.0.1:8000') {
    this.baseUrl = `${origin.replace(/\/$/, '')}/api/v1`;
  }

  setToken(token: string | null) { this.token = token }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { body, query, auth = false, headers, ...init } = options;
    const url = new URL(`${this.baseUrl}${path}`);
    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    });
    if (auth && !this.token && typeof window !== 'undefined') {
      const storageKey = window.location.pathname.startsWith('/admin') ? ADMIN_TOKEN_STORAGE_KEY : TOKEN_STORAGE_KEY;
      this.token = localStorage.getItem(storageKey);
    }
    if (auth && !this.token) throw new ApiError(401, 'Authentication required');
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const response = await fetch(url, {
      ...init,
      headers: { ...(body !== undefined && !isFormData ? { 'Content-Type': 'application/json' } : {}), ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}), ...headers },
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      if (auth && response.status === 401 && typeof window !== 'undefined') {
        const isAdminPath = window.location.pathname.startsWith('/admin');
        if (isAdminPath) localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
        else {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(ROLE_STORAGE_KEY);
        }
        const loginPath = isAdminPath ? '/admin/signin' : window.location.pathname.startsWith('/provider') ? '/provider/login' : window.location.pathname.startsWith('/customer') ? '/customer/login' : '/login';
        window.location.assign(loginPath);
      }
      if (response.status === 403) throw new ApiError(403, error.detail ?? 'You do not have permission to perform this action');
      throw new ApiError(response.status, error.detail ?? error);
    }
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  health = () => this.request<{ status: 'ok' }>('/health');
  homepageContent = () => this.request<HomepageContentResponse>('/homepage-content');
  homepageStats = () => this.request<Record<string, number>>('/homepage/stats');
  testimonials = (featured: boolean | null = true, limit = 3) => this.request<HomepageTestimonial[]>('/testimonials', { query: { featured, limit } });
  subscribeNewsletter = (email: string) => this.request<Json>('/newsletter/subscriptions', { method: 'POST', body: { email } });
  auth = {
    register: (input: RegisterInput) => this.request<TokenResponse>('/auth/register', { method: 'POST', body: input }),
    login: (input: LoginInput) => this.request<TokenResponse>('/auth/login', { method: 'POST', body: input }),
    oauth: (input: OAuthInput) => this.request<TokenResponse>('/auth/oauth', { method: 'POST', body: input }),
    logout: () => this.request<void>('/auth/logout', { method: 'POST', auth: true }),
    forgotPassword: (email: string) => this.request<{ message: string }>('/auth/forgot-password', { method: 'POST', body: { email } }),
    resetPassword: (token: string, newPassword: string) => this.request<void>('/auth/reset-password', { method: 'POST', body: { token, new_password: newPassword } }),
    refresh: (refreshToken: string) => this.request<TokenResponse>('/auth/refresh', { method: 'POST', body: { refresh_token: refreshToken } }),
    me: () => this.request<User>('/auth/me', { auth: true }),
  };
  categories = {
    list: (limit = 100) => this.request<Category[]>('/categories', { query: { limit: Math.max(1, Math.min(100, limit)) } }),
    get: (slug: string) => this.request<CategoryDetail>(`/categories/${encodeURIComponent(slug)}`),
  };
  businesses = {
    list: (filters: BusinessFilters = {}) => this.request<Business[]>('/businesses', { query: filters as Query }),
    get: (id: Id) => this.request<Business>(`/businesses/${encodeURIComponent(id)}`),
    create: (input: BusinessInput) => this.request<Business>('/businesses', { method: 'POST', body: input, auth: true }),
    update: (id: Id, input: BusinessUpdateInput) => this.request<Business>(`/businesses/${encodeURIComponent(id)}`, { method: 'PATCH', body: input, auth: true }),
    toggleFavorite: (id: Id) => this.request<{ is_favorite: boolean }>(`/businesses/${encodeURIComponent(id)}/favorite`, { method: 'POST', auth: true }),
    share: (id: Id) => this.request<{ url: string }>(`/businesses/${encodeURIComponent(id)}/share`),
    reviews: (id: Id) => this.request<Review[]>(`/businesses/${encodeURIComponent(id)}/reviews`),
    submitReview: (id: Id, input: ReviewInput) => this.request<Review>(`/businesses/${encodeURIComponent(id)}/reviews`, { method: 'POST', body: input, auth: true }),
  };
  reviews = { markHelpful: (id: Id) => this.request<{ helpful_count: number }>(`/reviews/${encodeURIComponent(id)}/helpful`, { method: 'POST', auth: true }) };
  quotes = { create: (input: QuoteInput) => this.request<Quote>('/quotes', { method: 'POST', body: input, auth: true }), list: () => this.request<Quote[]>('/quotes', { auth: true }) };
  favorites = { list: () => this.request<Business[]>('/favorites', { auth: true }) };
  search = { autocomplete: (q: string) => this.request<{ suggestions: string[] }>('/search/autocomplete', { query: { q } }), popular: () => this.request<{ searches: string[] }>('/search/popular') };
  contact = { send: (input: ContactInput) => this.request<{ id: Id; status: string }>('/contact', { method: 'POST', body: input }), faqs: () => this.request<Array<{ question: string; answer: string }>>('/contact/faqs') };
  onboarding = { get: () => this.request<Onboarding>('/onboarding', { auth: true }), update: (input: OnboardingInput) => this.request<Onboarding>('/onboarding', { method: 'PUT', body: input, auth: true }) };
  subscriptions = { createPro: (plan: 'pro_monthly' | 'pro_yearly' = 'pro_monthly') => this.request<{ subscription_id: Id; status: string; checkout_session_id: string }>('/subscriptions/pro', { method: 'POST', body: { plan }, auth: true }) };
  notifications = { list: () => this.request<Notification[]>('/notifications', { auth: true }), markRead: (id: Id) => this.request<Notification>(`/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH', auth: true }), markAllRead: () => this.request<{ updated: number }>('/notifications/read-all', { method: 'PATCH', auth: true }) };
  preferences = { get: () => this.request<Preference>('/preferences', { auth: true }), update: (input: PreferenceInput) => this.request<Preference>('/preferences', { method: 'PUT', body: input, auth: true }) };
  locations = { cities: () => this.request<{ cities: string[] }>('/locations/cities'), geocode: (address: string) => this.request<{ address: string; latitude: number; longitude: number }>('/locations/geocode', { method: 'POST', body: { address } }), nearby: (latitude: number, longitude: number, radiusKm = 10) => this.request<Business[]>('/locations/nearby', { query: { latitude, longitude, radius_km: radiusKm } }) };
  legal = { get: (slug: string) => this.request<{ slug: string; title: string; content: string }>(`/legal/${encodeURIComponent(slug)}`) };
  analytics = { pageView: (input: AnalyticsInput = {}) => this.recordAnalytics('page-views', input), businessClick: (input: AnalyticsInput = {}) => this.recordAnalytics('business-clicks', input), quoteConversion: (input: AnalyticsInput = {}) => this.recordAnalytics('quote-conversions', input) };
  private recordAnalytics(kind: string, input: AnalyticsInput) { return this.request<{ event_id: Id; status: string }>(`/analytics/${kind}`, { method: 'POST', body: input }) }
  customer = {
    dashboard: () => this.request<Json>('/customer/dashboard', { auth: true }),
    requests: (query: Query = {}) => this.request<Json[]>('/customer/requests', { query, auth: true }),
    createRequest: (body: Json) => this.request<Json>('/customer/requests', { method: 'POST', body, auth: true }),
    request: (id: Id) => this.request<Json>(`/customer/requests/${encodeURIComponent(id)}`, { auth: true }),
    updateRequest: (id: Id, body: Json) => this.request<Json>(`/customer/requests/${encodeURIComponent(id)}`, { method: 'PATCH', body, auth: true }),
    deleteRequest: (id: Id) => this.request<void>(`/customer/requests/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true }),
    requestAction: (id: Id, action: 'cancel' | 'close' | 'extend') => this.request<Json>(`/customer/requests/${encodeURIComponent(id)}/${action}`, { method: 'POST', auth: true }),
    quotes: (requestId: Id) => this.request<Json[]>(`/customer/requests/${encodeURIComponent(requestId)}/quotes`, { auth: true }),
    quote: (id: Id) => this.request<Json>(`/customer/quotes/${encodeURIComponent(id)}`, { auth: true }),
    quoteAction: (id: Id, action: 'accept' | 'decline') => this.request<Json>(`/customer/quotes/${encodeURIComponent(id)}/${action}`, { method: 'POST', auth: true }),
    messages: (id: Id) => this.request<Json[]>(`/customer/quotes/${encodeURIComponent(id)}/messages`, { auth: true }),
    sendMessage: (id: Id, body: string) => this.request<Json>(`/customer/quotes/${encodeURIComponent(id)}/messages`, { method: 'POST', body: { body }, auth: true }),
    readMessages: (id: Id) => this.request<Json>(`/customer/quotes/${encodeURIComponent(id)}/messages/read`, { method: 'POST', auth: true }),
    favorites: () => this.request<Json[]>('/customer/favorites', { auth: true }),
    save: (id: Id) => this.request<Json>(`/customer/favorites/${encodeURIComponent(id)}`, { method: 'POST', auth: true }),
    unsave: (id: Id) => this.request<void>(`/customer/favorites/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true }),
    compare: (businessIds: Id[]) => this.request<Json[]>('/customer/favorites/compare', { method: 'POST', body: { business_ids: businessIds }, auth: true }),
    notifications: (query: Query = {}) => this.request<Json[]>('/customer/notifications', { query, auth: true }),
    unread: () => this.request<Json>('/customer/notifications/unread-count', { auth: true }),
    readNotification: (id: Id) => this.request<Json>(`/customer/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH', auth: true }),
    readAll: () => this.request<Json>('/customer/notifications/read-all', { method: 'PATCH', auth: true }),
    profile: () => this.request<Profile>('/customer/profile', { auth: true }),
    updateProfile: (body: ProfileUpdateInput) => this.request<Profile>('/customer/profile', { method: 'PATCH', body, auth: true }),
    preferences: () => this.request<Json>('/customer/preferences', { auth: true }),
    updatePreferences: (body: Json) => this.request<Json>('/customer/preferences', { method: 'PATCH', body, auth: true }),
  };
  provider = {
    dashboard: () => this.request<Json>('/provider/dashboard', { auth: true }),
    requests: (query: Query = {}) => this.request<Json[]>('/provider/requests', { query, auth: true }),
    request: (id: Id) => this.request<Json>(`/provider/requests/${encodeURIComponent(id)}`, { auth: true }),
    respond: (id: Id, body: Json) => this.request<Json>(`/provider/requests/${encodeURIComponent(id)}/respond`, { method: 'POST', body, auth: true }),
    decline: (id: Id) => this.request<void>(`/provider/requests/${encodeURIComponent(id)}/decline`, { method: 'POST', auth: true }),
    quotes: (query: Query = {}) => this.request<Json[]>('/provider/quotes', { query, auth: true }),
    createQuote: (body: Json) => this.request<Json>('/provider/quotes', { method: 'POST', body, auth: true }),
    quote: (id: Id) => this.request<Json>(`/provider/quotes/${encodeURIComponent(id)}`, { auth: true }),
    updateQuote: (id: Id, body: Json) => this.request<Json>(`/provider/quotes/${encodeURIComponent(id)}`, { method: 'PATCH', body, auth: true }),
    withdraw: (id: Id) => this.request<Json>(`/provider/quotes/${encodeURIComponent(id)}/withdraw`, { method: 'POST', auth: true }),
    business: () => this.request<Json>('/provider/business', { auth: true }),
    createBusiness: (body: Json) => this.request<Json>('/provider/business', { method: 'POST', body, auth: true }),
    updateBusiness: (body: Json) => this.request<Json>('/provider/business', { method: 'PATCH', body, auth: true }),
    resource: (name: string) => this.request<Json[]>(`/provider/business/${encodeURIComponent(name)}`, { auth: true }),
    createResource: (name: string, body: Json) => this.request<Json>(`/provider/business/${encodeURIComponent(name)}`, { method: 'POST', body, auth: true }),
    verification: () => this.request<Json>('/provider/verification', { auth: true }),
    submitVerification: (body: Json = {}) => this.request<Json>('/provider/verification', { method: 'POST', body, auth: true }),
    insight: (metric: string, query: Query = {}) => this.request<Json>(`/provider/insights/${encodeURIComponent(metric)}`, { query, auth: true }),
    subscription: () => this.request<Json>('/provider/subscription', { auth: true }),
    notifications: (query: Query = {}) => this.request<Json[]>('/provider/notifications', { query, auth: true }),
    readNotification: (id: Id) => this.request<Json>(`/provider/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH', auth: true }),
    readAllNotifications: () => this.request<Json>('/provider/notifications/read-all', { method: 'PATCH', auth: true }),
    profile: () => this.request<Profile>('/provider/profile', { auth: true }),
    updateProfile: (body: ProfileUpdateInput) => this.request<Profile>('/provider/profile', { method: 'PATCH', body, auth: true }),
  };
  uploads = {
    create: (file: File) => { const body = new FormData(); body.append('file', file); return this.request<UploadedFile>('/uploads', { method: 'POST', body, auth: true }); },
  };
  admin = {
    signin: (input: LoginInput) => this.request<TokenResponse>('/admin/signin', { method: 'POST', body: input }),
    signout: () => this.request<void>('/admin/signout', { method: 'POST', auth: true }),
    verificationQueue: () => this.request<Business[]>('/admin/verification', { auth: true }),
    verifyBusiness: (id: Id, verified: boolean) => this.request<Business>(`/admin/verification/${encodeURIComponent(id)}`, { method: 'PATCH', body: { verified }, auth: true }),
    stats: () => this.request<AdminStats>('/admin/stats', { auth: true }),
    reviewQueue: () => this.request<Review[]>('/admin/moderation/reviews', { auth: true }),
    moderateReview: (id: Id, approved: boolean) => this.request<Review>(`/admin/moderation/reviews/${encodeURIComponent(id)}`, { method: 'PATCH', body: { approved }, auth: true }),
    me: () => this.request<Json>('/admin/me', { auth: true }),
    dashboard: () => this.request<Json>('/admin/dashboard', { auth: true }),
    auditLogs: (query: Query = {}) => this.request<Json[]>('/admin/audit-logs', { query, auth: true }),
    queue: () => this.request<Json>('/admin/action-queue', { auth: true }),
    contactMessages: (query: Query = {}) => this.request<Json[]>('/admin/contact-messages', { query, auth: true }),
    contactMessage: (id: Id) => this.request<Json>(`/admin/contact-messages/${encodeURIComponent(id)}`, { auth: true }),
    updateContactMessage: (id: Id, body: Json) => this.request<Json>(`/admin/contact-messages/${encodeURIComponent(id)}`, { method: 'PATCH', body, auth: true }),
    list: (resource: string, query: Query = {}) => this.request<Json[]>(`/admin/${encodeURIComponent(resource)}`, { query, auth: true }),
    get: (resource: string, id: Id) => this.request<Json>(`/admin/${encodeURIComponent(resource)}/${encodeURIComponent(id)}`, { auth: true }),
    update: (resource: string, id: Id, body: Json) => this.request<Json>(`/admin/${encodeURIComponent(resource)}/${encodeURIComponent(id)}`, { method: 'PATCH', body, auth: true }),
    remove: (resource: string, id: Id) => this.request<void>(`/admin/${encodeURIComponent(resource)}/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true }),
    action: (resource: string, id: Id, action: string, body: Json = {}) => this.request<Json>(`/admin/${encodeURIComponent(resource)}/${encodeURIComponent(id)}/${encodeURIComponent(action)}`, { method: 'POST', body, auth: true }),
    analytics: (metric: string, query: Query = {}) => this.request<Json>(`/admin/analytics/${encodeURIComponent(metric)}`, { query, auth: true }),
    settings: () => this.request<Json>('/admin/settings', { auth: true }),
    updateSettings: (body: Json) => this.request<Json>('/admin/settings', { method: 'PATCH', body, auth: true }),
    settingsSection: (section: string) => this.request<Json>(`/admin/settings/${encodeURIComponent(section)}`, { auth: true }),
    updateSettingsSection: (section: string, body: Json) => this.request<Json>(`/admin/settings/${encodeURIComponent(section)}`, { method: 'PATCH', body, auth: true }),
    uploadBrandAsset: (kind: 'logo'|'favicon', file: File) => { const body=new FormData(); body.append('file',file); return this.request<Json>(`/admin/settings/general/${kind}`,{method:'POST',body,auth:true}) },
    generalOptions: () => this.request<Json>('/admin/settings/general/options', { auth: true }),
    settingsImpact: (section: 'marketplace'|'trust-safety'|'privacy', body: Json) => this.request<Json>(`/admin/settings/${section}/impact-preview`, { method: 'POST', body, auth: true }),
    blockedKeywords: () => this.request<Json[]>('/admin/blocked-keywords', { auth: true }),
    verificationDocuments: () => this.request<Json[]>('/admin/verification-documents', { auth: true }),
    addBlockedKeyword: (value: string) => this.request<Json>('/admin/blocked-keywords', { method: 'POST', body: { value }, auth: true }),
    removeBlockedKeyword: (id: Id) => this.request<void>(`/admin/blocked-keywords/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true }),
    testEmail: (recipient: string) => this.request<Json>('/admin/communications/test-email', { method: 'POST', body: { recipient }, auth: true }),
    communicationTemplates: () => this.request<Json[]>('/admin/communication-templates', { auth: true }),
    communicationTemplate: (id: Id) => this.request<Json>(`/admin/communication-templates/${encodeURIComponent(id)}`, { auth: true }),
    updateCommunicationTemplate: (id: Id, body: Json) => this.request<Json>(`/admin/communication-templates/${encodeURIComponent(id)}`, { method: 'PATCH', body, auth: true }),
    previewCommunicationTemplate: (id: Id, body: Json = {}) => this.request<Json>(`/admin/communication-templates/${encodeURIComponent(id)}/preview`, { method: 'POST', body, auth: true }),
    testCommunicationTemplate: (id: Id, body: Json = {}) => this.request<Json>(`/admin/communication-templates/${encodeURIComponent(id)}/test`, { method: 'POST', body, auth: true }),
    resetCommunicationTemplate: (id: Id) => this.request<Json>(`/admin/communication-templates/${encodeURIComponent(id)}/reset`, { method: 'POST', auth: true }),
    sessions: (query: Query = {}) => this.request<Json[]>('/admin/sessions', { query, auth: true }),
    revokeSession: (id: Id) => this.request<void>(`/admin/sessions/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true }),
    revokeAllSessions: () => this.request<Json>('/admin/sessions/revoke-all', { method: 'POST', auth: true }),
    roles: () => this.request<Json[]>('/admin/roles', { auth: true }),
    createRole: (body: Json) => this.request<Json>('/admin/roles', { method: 'POST', body, auth: true }),
    updateRole: (id: Id, body: Json) => this.request<Json>(`/admin/roles/${encodeURIComponent(id)}`, { method: 'PATCH', body, auth: true }),
    permissions: () => this.request<Json[]>('/admin/permissions', { auth: true }),
    securityEvents: (query: Query = {}) => this.request<Json[]>('/admin/security-events', { query, auth: true }),
    adminMfaStatus: (id: Id) => this.request<Json>(`/admin/admins/${encodeURIComponent(id)}/mfa-status`, { auth: true }),
    settingsApprovals: (query: Query = {}) => this.request<Json[]>('/admin/settings/approvals', { query, auth: true }),
    requestSettingsApproval: (body: Json) => this.request<Json>('/admin/settings/approvals', { method: 'POST', body, auth: true }),
    decideSettingsApproval: (id: Id, decision: string) => this.request<Json>(`/admin/settings/approvals/${encodeURIComponent(id)}/${encodeURIComponent(decision)}`, { method: 'POST', auth: true }),
    integrations: () => this.request<Json>('/admin/integrations', { auth: true }),
    integration: (provider: string) => this.request<Json>(`/admin/integrations/${encodeURIComponent(provider)}`, { auth: true }),
    configureIntegration: (provider: string, body: Json) => this.request<Json>(`/admin/integrations/${encodeURIComponent(provider)}`, { method: 'PATCH', body, auth: true }),
    connectIntegration: (provider: string) => this.request<Json>(`/admin/integrations/${encodeURIComponent(provider)}/connect`, { method: 'POST', auth: true }),
    disconnectIntegration: (provider: string) => this.request<void>(`/admin/integrations/${encodeURIComponent(provider)}`, { method: 'DELETE', auth: true }),
    featureFlags: () => this.request<Json>('/admin/feature-flags', { auth: true }),
    updateFeatureFlag: (key: string, body: Json) => this.request<Json>(`/admin/feature-flags/${encodeURIComponent(key)}`, { method: 'PATCH', body, auth: true }),
    featureFlagImpact: (key: string, body: Json) => this.request<Json>(`/admin/feature-flags/${encodeURIComponent(key)}/impact-preview`, { method: 'POST', body, auth: true }),
    rollbackFeatureFlag: (key: string) => this.request<Json>(`/admin/feature-flags/${encodeURIComponent(key)}/rollback`, { method: 'POST', auth: true }),
    featureFlagHistory: (key: string) => this.request<Json[]>(`/admin/feature-flags/${encodeURIComponent(key)}/history`, { auth: true }),
    systemHealth: () => this.request<Json>('/admin/system/health', { auth: true }),
    detailedSystemHealth: () => this.request<Json>('/admin/system/health/details', { auth: true }),
    runSystemHealthCheck: () => this.request<Json>('/admin/system/health/check', { method: 'POST', auth: true }),
    systemIncidents: (query: Query = {}) => this.request<Json[]>('/admin/system/incidents', { query, auth: true }),
    testIntegration: (provider: string) => this.request<Json>(`/admin/integrations/${encodeURIComponent(provider)}/test`, { method: 'POST', auth: true }),
    maintenance: () => this.request<Json>('/admin/maintenance', { auth: true }),
    previewMaintenance: (body: Json) => this.request<Json>('/admin/maintenance/preview', { method: 'POST', body, auth: true }),
    enableMaintenance: (body: Json) => this.request<Json>('/admin/maintenance/enable', { method: 'POST', body, auth: true }),
    disableMaintenance: (body: Json) => this.request<Json>('/admin/maintenance/disable', { method: 'POST', body, auth: true }),
    requestPlatformExport: (body: Json = {}) => this.request<Json>('/admin/data-exports', { method: 'POST', body, auth: true }),
    platformExport: (id: Id) => this.request<Json>(`/admin/data-exports/${encodeURIComponent(id)}`, { auth: true }),
    deletionRequests: (query: Query = {}) => this.request<Json[]>('/admin/deletion-requests', { query, auth: true }),
    deletionRequest: (id: Id) => this.request<Json>(`/admin/deletion-requests/${encodeURIComponent(id)}`, { auth: true }),
    decideDeletionRequest: (id: Id, decision: 'approve'|'reject', body: Json = {}) => this.request<Json>(`/admin/deletion-requests/${encodeURIComponent(id)}/${decision}`, { method: 'POST', body, auth: true }),
    backupStatus: () => this.request<Json>('/admin/backups/status', { auth: true }),
    privacyImpact: (body: Json) => this.request<Json>('/admin/privacy/impact-preview', { method: 'POST', body, auth: true }),
    createAnonymizationJob: () => this.request<Json>('/admin/privacy/anonymization-jobs', { method: 'POST', auth: true }),
    settingsAuditLog: (query: Query = {}) => this.request<Json[]>('/admin/settings/audit-log', { query, auth: true }),
    homepageContent: () => this.request<HomepageContentResponse>('/admin/homepage-content', { auth: true }),
    publishHomepageContent: (body: HomepageContentResponse) => this.request<HomepageContentResponse>('/admin/homepage-content', { method: 'PUT', body, auth: true }),
    resetHomepageContent: () => this.request<HomepageContentResponse>('/admin/homepage-content/reset', { method: 'POST', auth: true }),
    previewHomepageContent: (body: HomepageContentResponse) => this.request<HomepageContentResponse>('/admin/homepage-content/preview', { method: 'POST', body, auth: true }),
  };
}

export const TOKEN_STORAGE_KEY = 'access_token';
export const ADMIN_TOKEN_STORAGE_KEY = 'admin_access_token';
export const ROLE_STORAGE_KEY = 'hirepro_account_role';
export const hireProApi = new HireProApi(process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000');

export function hydrateApiToken() {
  if (typeof window !== 'undefined') hireProApi.setToken(localStorage.getItem(TOKEN_STORAGE_KEY));
}

export function saveApiToken(token: string) {
  hireProApi.setToken(token);
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function hydrateAdminToken() {
  if (typeof window !== 'undefined') hireProApi.setToken(localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY));
}

export function saveAdminToken(token: string) {
  hireProApi.setToken(token);
  localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
}

export function saveAccountRole(role: AccountRole) {
  localStorage.setItem(ROLE_STORAGE_KEY, role);
}

export function dashboardForRole(role: AccountRole) {
  return role === 'business' ? '/provider/dashboard' : '/customer/dashboard';
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}
