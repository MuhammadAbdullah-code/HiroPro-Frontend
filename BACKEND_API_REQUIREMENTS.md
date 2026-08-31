# HirePro Backend API Requirements

This document outlines all backend APIs, endpoints, and data models required to support the HirePro frontend application.

---

## 📋 Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [User Management](#user-management)
3. [Categories](#categories)
4. [Businesses](#businesses)
5. [Reviews & Ratings](#reviews--ratings)
6. [Search & Filtering](#search--filtering)
7. [Quote Requests](#quote-requests)
8. [Favorites & Bookmarks](#favorites--bookmarks)
9. [Business Onboarding](#business-onboarding)
10. [Contact & Support](#contact--support)
11. [Notifications](#notifications)
12. [Analytics & Tracking](#analytics--tracking)
13. [Admin Panel](#admin-panel)
14. [Data Models](#data-models)

---

## 🔐 Authentication & Authorization

### Endpoints

#### `POST /api/auth/register`
**Purpose:** User registration (customers and businesses)  
**Required Pages:** `/register`

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "customer" | "business",
  "marketingConsent": boolean
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "email": "string",
    "role": "string",
    "token": "string"
  }
}
```

---

#### `POST /api/auth/login`
**Purpose:** User login  
**Required Pages:** `/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "rememberMe": boolean
}
```

**Response:**
```json
{
  "success": true,
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "customer" | "business"
  }
}
```

---

#### `POST /api/auth/oauth/google`
**Purpose:** Google OAuth login  
**Required Pages:** `/login`, `/register`

**Request Body:**
```json
{
  "idToken": "string",
  "role": "customer" | "business"
}
```

**Response:** Same as login response

---

#### `POST /api/auth/logout`
**Purpose:** User logout  
**Required Pages:** All authenticated pages

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### `POST /api/auth/forgot-password`
**Purpose:** Request password reset email  
**Required Pages:** `/login`

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

#### `POST /api/auth/reset-password`
**Purpose:** Reset password with token  
**Required Pages:** Password reset page (not yet created)

**Request Body:**
```json
{
  "token": "string",
  "newPassword": "string"
}
```

---

#### `GET /api/auth/me`
**Purpose:** Get current user profile  
**Required Pages:** All authenticated pages

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "customer" | "business",
  "avatar": "string",
  "businessId": "string" (if role is business)
}
```

---

## 👤 User Management

#### `PUT /api/users/profile`
**Purpose:** Update user profile  
**Required Pages:** User dashboard (future)

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "avatar": "string"
}
```

---

#### `DELETE /api/users/account`
**Purpose:** Delete user account  
**Required Pages:** Account settings (future)

**Headers:** `Authorization: Bearer <token>`

---

## 📂 Categories

#### `GET /api/categories`
**Purpose:** Get all categories with business counts  
**Required Pages:** `/categories`, homepage

**Query Parameters:**
- `search` (optional): Filter by name
- `groupBy` (optional): Group categories (home-services, outdoor, automotive, etc.)

**Response:**
```json
{
  "categories": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "icon": "string",
      "description": "string",
      "businessCount": number,
      "group": "string"
    }
  ]
}
```

---

#### `GET /api/categories/:slug`
**Purpose:** Get category details  
**Required Pages:** `/categories/[category]`

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "description": "string",
  "icon": "string",
  "businessCount": number,
  "topBusinesses": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "rating": number,
      "reviewCount": number,
      "verified": boolean,
      "logo": "string",
      "coverPhoto": "string",
      "categories": ["string"],
      "city": "string"
    }
  ],
  "availableCities": [
    {
      "city": "string",
      "businessCount": number
    }
  ],
  "faqs": [
    {
      "question": "string",
      "answer": "string"
    }
  ]
}
```

---

## 🏢 Businesses

#### `GET /api/businesses`
**Purpose:** Search and filter businesses  
**Required Pages:** `/businesses`, homepage search

**Query Parameters:**
- `q` (optional): Search query
- `category` (optional): Category slug
- `city` (optional): City name
- `rating` (optional): Minimum rating (1-5)
- `verified` (optional): boolean
- `distance` (optional): Max distance in miles
- `lat` (optional): User latitude
- `lng` (optional): User longitude
- `sort` (optional): `relevance`, `rating`, `reviews`, `distance`
- `page` (optional): Page number
- `limit` (optional): Results per page

**Response:**
```json
{
  "businesses": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "logo": "string",
      "coverPhoto": "string",
      "rating": number,
      "reviewCount": number,
      "verified": boolean,
      "categories": ["string"],
      "city": "string",
      "state": "string",
      "distance": number,
      "tagline": "string",
      "priceRange": "$" | "$$" | "$$$"
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  },
  "filters": {
    "availableCategories": ["string"],
    "availableCities": ["string"],
    "ratingDistribution": {
      "5": number,
      "4": number,
      "3": number,
      "2": number,
      "1": number
    }
  }
}
```

---

#### `GET /api/businesses/:slug`
**Purpose:** Get business profile details  
**Required Pages:** `/businesses/[slug]`

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "logo": "string",
  "coverPhoto": "string",
  "tagline": "string",
  "description": "string",
  "verified": boolean,
  "rating": number,
  "reviewCount": number,
  "categories": ["string"],
  "services": [
    {
      "name": "string",
      "description": "string",
      "price": "string"
    }
  ],
  "contact": {
    "phone": "string",
    "email": "string",
    "website": "string"
  },
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "lat": number,
    "lng": number
  },
  "hours": {
    "monday": { "open": "string", "close": "string", "closed": boolean },
    "tuesday": { "open": "string", "close": "string", "closed": boolean },
    "wednesday": { "open": "string", "close": "string", "closed": boolean },
    "thursday": { "open": "string", "close": "string", "closed": boolean },
    "friday": { "open": "string", "close": "string", "closed": boolean },
    "saturday": { "open": "string", "close": "string", "closed": boolean },
    "sunday": { "open": "string", "close": "string", "closed": boolean }
  },
  "coverageArea": ["string"],
  "portfolio": [
    {
      "id": "string",
      "imageUrl": "string",
      "caption": "string"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "year": number
    }
  ],
  "ratingBreakdown": {
    "overall": number,
    "quality": number,
    "professionalism": number,
    "value": number,
    "responsiveness": number
  }
}
```

---

#### `POST /api/businesses`
**Purpose:** Create new business listing  
**Required Pages:** `/add-your-business`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string",
  "tagline": "string",
  "description": "string",
  "categories": ["string"],
  "phone": "string",
  "email": "string",
  "website": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zip": "string"
  },
  "hours": { /* hours object */ },
  "plan": "free" | "pro"
}
```

---

#### `PUT /api/businesses/:id`
**Purpose:** Update business profile  
**Required Pages:** Business dashboard (future)

**Headers:** `Authorization: Bearer <token>`

---

#### `DELETE /api/businesses/:id`
**Purpose:** Delete business listing  
**Required Pages:** Business dashboard (future)

**Headers:** `Authorization: Bearer <token>`

---

#### `POST /api/businesses/:id/verification`
**Purpose:** Submit verification documents  
**Required Pages:** Business dashboard (future)

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "licenseDocument": "string (file upload)",
  "insuranceDocument": "string (file upload)",
  "certifications": ["string (file uploads)"]
}
```

---

## ⭐ Reviews & Ratings

#### `GET /api/businesses/:slug/reviews`
**Purpose:** Get business reviews  
**Required Pages:** `/businesses/[slug]`

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Results per page
- `sort` (optional): `recent`, `highest`, `lowest`

**Response:**
```json
{
  "reviews": [
    {
      "id": "string",
      "author": {
        "name": "string",
        "avatar": "string"
      },
      "rating": number,
      "ratings": {
        "quality": number,
        "professionalism": number,
        "value": number,
        "responsiveness": number
      },
      "comment": "string",
      "date": "string (ISO date)",
      "verified": boolean,
      "helpful": number,
      "businessResponse": {
        "comment": "string",
        "date": "string (ISO date)"
      } | null
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

---

#### `POST /api/businesses/:slug/reviews`
**Purpose:** Submit a review  
**Required Pages:** Business profile (after service completion)

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rating": number,
  "ratings": {
    "quality": number,
    "professionalism": number,
    "value": number,
    "responsiveness": number
  },
  "comment": "string",
  "serviceDate": "string (ISO date)"
}
```

---

#### `POST /api/reviews/:id/response`
**Purpose:** Business responds to review  
**Required Pages:** Business dashboard (future)

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "comment": "string"
}
```

---

#### `POST /api/reviews/:id/helpful`
**Purpose:** Mark review as helpful  
**Required Pages:** `/businesses/[slug]`

**Headers:** `Authorization: Bearer <token>` (optional)

---

## 🔍 Search & Filtering

#### `GET /api/search/autocomplete`
**Purpose:** Search autocomplete suggestions  
**Required Pages:** Homepage, `/businesses`

**Query Parameters:**
- `q`: Search query

**Response:**
```json
{
  "suggestions": [
    {
      "type": "category" | "business" | "city",
      "name": "string",
      "slug": "string",
      "extra": "string"
    }
  ]
}
```

---

#### `GET /api/search/popular`
**Purpose:** Get popular searches  
**Required Pages:** Homepage

**Response:**
```json
{
  "popularSearches": [
    {
      "term": "string",
      "count": number
    }
  ]
}
```

---

## 💬 Quote Requests

#### `POST /api/quotes`
**Purpose:** Submit quote request  
**Required Pages:** `/businesses/[slug]`

**Headers:** `Authorization: Bearer <token>` (optional)

**Request Body:**
```json
{
  "businessId": "string",
  "customerName": "string",
  "customerEmail": "string",
  "customerPhone": "string",
  "serviceNeeded": "string",
  "description": "string",
  "preferredDate": "string (ISO date)",
  "budget": "string"
}
```

**Response:**
```json
{
  "success": true,
  "quoteId": "string",
  "message": "Quote request sent successfully"
}
```

---

#### `GET /api/quotes`
**Purpose:** Get user's quote requests (customer view)  
**Required Pages:** Customer dashboard (future)

**Headers:** `Authorization: Bearer <token>`

---

#### `GET /api/businesses/:id/quotes`
**Purpose:** Get business quote requests (business view)  
**Required Pages:** Business dashboard (future)

**Headers:** `Authorization: Bearer <token>`

---

#### `PUT /api/quotes/:id/status`
**Purpose:** Update quote status  
**Required Pages:** Business dashboard (future)

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "pending" | "responded" | "accepted" | "declined",
  "response": "string",
  "estimatedPrice": "string"
}
```

---

## ❤️ Favorites & Bookmarks

#### `GET /api/favorites`
**Purpose:** Get user's favorite businesses  
**Required Pages:** Customer dashboard (future)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "favorites": [
    {
      "id": "string",
      "businessId": "string",
      "business": { /* business object */ },
      "addedAt": "string (ISO date)"
    }
  ]
}
```

---

#### `POST /api/favorites`
**Purpose:** Add business to favorites  
**Required Pages:** `/businesses/[slug]`, `/businesses`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "businessId": "string"
}
```

---

#### `DELETE /api/favorites/:businessId`
**Purpose:** Remove business from favorites  
**Required Pages:** `/businesses/[slug]`, `/businesses`

**Headers:** `Authorization: Bearer <token>`

---

## 🚀 Business Onboarding

#### `POST /api/onboarding/business`
**Purpose:** Complete business onboarding wizard  
**Required Pages:** `/add-your-business`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "step": number,
  "data": {
    /* Step-specific data */
  }
}
```

---

#### `POST /api/subscriptions/create`
**Purpose:** Create Pro subscription  
**Required Pages:** `/add-your-business`, Business dashboard

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "businessId": "string",
  "plan": "pro",
  "paymentMethod": {
    "cardNumber": "string",
    "expMonth": number,
    "expYear": number,
    "cvc": "string"
  }
}
```

---

#### `PUT /api/subscriptions/:id`
**Purpose:** Update subscription  
**Required Pages:** Business dashboard (future)

**Headers:** `Authorization: Bearer <token>`

---

#### `DELETE /api/subscriptions/:id`
**Purpose:** Cancel subscription  
**Required Pages:** Business dashboard (future)

**Headers:** `Authorization: Bearer <token>`

---

## 📧 Contact & Support

#### `POST /api/contact`
**Purpose:** Submit contact form  
**Required Pages:** `/contact`

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "topic": "customer" | "business" | "general" | "technical" | "feedback",
  "message": "string"
}
```

**Response:**
```json
{
  "success": true,
  "ticketId": "string",
  "message": "Message sent successfully"
}
```

---

## 🔔 Notifications

#### `GET /api/notifications`
**Purpose:** Get user notifications  
**Required Pages:** All authenticated pages (notification dropdown)

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `unreadOnly` (optional): boolean
- `page` (optional): Page number
- `limit` (optional): Results per page

**Response:**
```json
{
  "notifications": [
    {
      "id": "string",
      "type": "quote_received" | "review_posted" | "response_received",
      "title": "string",
      "message": "string",
      "read": boolean,
      "createdAt": "string (ISO date)",
      "link": "string"
    }
  ],
  "unreadCount": number
}
```

---

#### `PUT /api/notifications/:id/read`
**Purpose:** Mark notification as read  
**Required Pages:** All authenticated pages

**Headers:** `Authorization: Bearer <token>`

---

## 📊 Analytics & Tracking

#### `POST /api/analytics/page-view`
**Purpose:** Track page views  
**Required Pages:** All pages

**Request Body:**
```json
{
  "page": "string",
  "referrer": "string",
  "userId": "string" (optional)
}
```

---

#### `POST /api/analytics/business-click`
**Purpose:** Track business profile clicks  
**Required Pages:** `/businesses`, `/categories/[category]`

**Request Body:**
```json
{
  "businessId": "string",
  "source": "search" | "category" | "homepage"
}
```

---

#### `POST /api/analytics/quote-conversion`
**Purpose:** Track quote request conversions  
**Required Pages:** `/businesses/[slug]`

**Request Body:**
```json
{
  "businessId": "string",
  "quoteId": "string"
}
```

---

## 🛠️ Admin Panel

#### `GET /api/admin/businesses/pending-verification`
**Purpose:** Get businesses pending verification  
**Required Pages:** Admin dashboard

**Headers:** `Authorization: Bearer <admin-token>`

---

#### `PUT /api/admin/businesses/:id/verify`
**Purpose:** Approve business verification  
**Required Pages:** Admin dashboard

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "approved": boolean,
  "reason": "string" (if rejected)
}
```

---

#### `GET /api/admin/reports/flagged-reviews`
**Purpose:** Get flagged reviews for moderation  
**Required Pages:** Admin dashboard

**Headers:** `Authorization: Bearer <admin-token>`

---

#### `DELETE /api/admin/reviews/:id`
**Purpose:** Delete inappropriate review  
**Required Pages:** Admin dashboard

**Headers:** `Authorization: Bearer <admin-token>`

---

#### `GET /api/admin/stats`
**Purpose:** Get platform statistics  
**Required Pages:** Admin dashboard

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**
```json
{
  "totalBusinesses": number,
  "totalUsers": number,
  "totalReviews": number,
  "totalQuotes": number,
  "activeSubscriptions": number,
  "monthlyRevenue": number
}
```

---

## 📐 Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  password: string; // hashed
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'business' | 'admin';
  emailVerified: boolean;
  marketingConsent: boolean;
  businessId?: string; // if role is business
  createdAt: Date;
  updatedAt: Date;
}
```

### Business
```typescript
interface Business {
  id: string;
  ownerId: string; // FK to User
  name: string;
  slug: string; // unique
  logo?: string;
  coverPhoto?: string;
  tagline: string;
  description: string;
  verified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verificationDocuments?: {
    license?: string;
    insurance?: string;
    certifications?: string[];
  };
  plan: 'free' | 'pro';
  subscriptionId?: string;
  categories: string[]; // FK to Category
  services: Service[];
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    lat: number;
    lng: number;
  };
  hours: BusinessHours;
  coverageArea: string[]; // cities
  portfolio: PortfolioItem[];
  certifications: Certification[];
  rating: number; // calculated
  reviewCount: number; // calculated
  ratingBreakdown: {
    overall: number;
    quality: number;
    professionalism: number;
    value: number;
    responsiveness: number;
  };
  priceRange?: '$' | '$$' | '$$$';
  createdAt: Date;
  updatedAt: Date;
}
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  slug: string; // unique
  description: string;
  icon: string;
  group: 'home-services' | 'outdoor' | 'automotive' | 'beauty' | 'professional' | 'pet-childcare' | 'food';
  businessCount: number; // calculated
  createdAt: Date;
  updatedAt: Date;
}
```

### Review
```typescript
interface Review {
  id: string;
  businessId: string; // FK to Business
  customerId: string; // FK to User
  rating: number; // 1-5
  ratings: {
    quality: number;
    professionalism: number;
    value: number;
    responsiveness: number;
  };
  comment: string;
  serviceDate: Date;
  verified: boolean; // verified purchase
  helpful: number; // count of helpful votes
  businessResponse?: {
    comment: string;
    date: Date;
  };
  flagged: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Quote
```typescript
interface Quote {
  id: string;
  businessId: string; // FK to Business
  customerId?: string; // FK to User (optional - can be anonymous)
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceNeeded: string;
  description: string;
  preferredDate?: Date;
  budget?: string;
  status: 'pending' | 'responded' | 'accepted' | 'declined';
  businessResponse?: {
    comment: string;
    estimatedPrice?: string;
    responseDate: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Subscription
```typescript
interface Subscription {
  id: string;
  businessId: string; // FK to Business
  plan: 'pro';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  paymentMethodId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Favorite
```typescript
interface Favorite {
  id: string;
  userId: string; // FK to User
  businessId: string; // FK to Business
  createdAt: Date;
}
```

### Notification
```typescript
interface Notification {
  id: string;
  userId: string; // FK to User
  type: 'quote_received' | 'review_posted' | 'response_received' | 'subscription_expiring';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: Date;
}
```

---

## 🔒 Authentication & Security Requirements

1. **JWT Tokens**: Use JWT for authentication with refresh tokens
2. **Password Hashing**: bcrypt with min 10 salt rounds
3. **Rate Limiting**: Implement rate limiting on all endpoints (e.g., 100 req/min)
4. **CORS**: Configure CORS for frontend domain
5. **Input Validation**: Validate all inputs (use Joi, Zod, or similar)
6. **SQL Injection Prevention**: Use parameterized queries
7. **XSS Prevention**: Sanitize all user inputs
8. **CSRF Protection**: Implement CSRF tokens for state-changing operations
9. **File Upload Security**: Validate file types, size limits, scan for malware
10. **HTTPS Only**: Enforce HTTPS in production

---

## 🌐 Third-Party Integrations

1. **Google OAuth**: Authentication integration
2. **Google Maps API**: Geocoding, distance calculations, map display
3. **Stripe/PayPal**: Payment processing for Pro subscriptions
4. **SendGrid/Mailgun**: Email notifications
5. **Twilio**: SMS notifications (optional)
6. **AWS S3/Cloudinary**: Image storage for logos, photos, documents
7. **Google Analytics**: Traffic analytics
8. **Sentry**: Error tracking

---

## 📦 Additional Backend Requirements

### Email Templates
- Welcome email
- Email verification
- Password reset
- Quote received (business)
- Quote response (customer)
- Review notification
- Subscription confirmation
- Subscription expiring/expired

### Background Jobs
- Calculate business ratings (nightly)
- Update business counts for categories (nightly)
- Send subscription renewal reminders
- Clean up expired quote requests
- Generate analytics reports

### Caching Strategy
- Cache popular searches (Redis)
- Cache category listings (Redis, 1 hour TTL)
- Cache business profiles (Redis, 15 min TTL)
- CDN for static assets

### Database Indexes
- User: email (unique), role
- Business: slug (unique), verified, rating, categories
- Category: slug (unique)
- Review: businessId, customerId, rating
- Quote: businessId, status, createdAt
- Favorite: userId + businessId (unique composite)

### File Storage Structure
```
/uploads
  /businesses
    /{businessId}
      /logo.jpg
      /cover.jpg
      /portfolio
        /{imageId}.jpg
  /documents
    /{businessId}
      /license.pdf
      /insurance.pdf
      /certifications
        /{certId}.pdf
  /avatars
    /{userId}.jpg
```

---

## 🚀 Deployment Checklist

- [ ] Set up production database (PostgreSQL recommended)
- [ ] Configure environment variables
- [ ] Set up Redis for caching
- [ ] Configure file storage (S3/Cloudinary)
- [ ] Set up email service
- [ ] Configure payment gateway
- [ ] Set up SSL certificates
- [ ] Configure domain and DNS
- [ ] Set up monitoring and logging
- [ ] Create database backups
- [ ] Load test API endpoints
- [ ] Set up CI/CD pipeline

---

## 📝 Notes

- All TODO comments in frontend files indicate where API calls should be integrated
- Consider implementing GraphQL for more flexible querying
- Implement proper error handling with standardized error codes
- Add API versioning (e.g., `/api/v1/...`)
- Document all APIs with Swagger/OpenAPI
- Implement webhook endpoints for payment provider callbacks
- Consider adding real-time features with WebSockets for notifications

---

**Total Endpoints Required:** ~50+ endpoints
**Estimated Development Time:** 8-12 weeks (backend only)
**Recommended Stack:** Node.js (Express/NestJS) + PostgreSQL + Redis + S3
