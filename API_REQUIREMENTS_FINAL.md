# HirePro Complete API Requirements
*Based on Current Frontend Implementation*

## 📋 Overview
This document lists **ALL** APIs required to support the existing HirePro frontend pages. Each endpoint is mapped to specific pages that need it.

---

## 🔐 1. Authentication & Authorization APIs

### `POST /api/v1/auth/register`
**Pages:** `/register`  
**Purpose:** User registration with email/password

**Request:**
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "marketingConsent": boolean
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
    "fullName": "string",
    "role": "customer"
  }
}
```

**Validation:**
- Email format check
- Password min 8 chars, uppercase, lowercase, number
- Duplicate email check

---

### `POST /api/v1/auth/login`
**Pages:** `/login`  
**Purpose:** User login with email/password

**Request:**
```json
{
  "email": "string",
  "password": "string"
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
    "fullName": "string",
    "role": "customer" | "business"
  }
}
```

**Error Codes:**
- 401: Invalid credentials
- 404: User not found

---

### `POST /api/v1/auth/oauth/google`
**Pages:** `/login`, `/register`  
**Purpose:** Google OAuth login/signup

**Request:**
```json
{
  "idToken": "string"
}
```

**Response:** Same as login

---

### `POST /api/v1/auth/logout`
**Pages:** All authenticated pages  
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true
}
```

---

### `POST /api/v1/auth/forgot-password`
**Pages:** `/login` (forgot password link)  
**Purpose:** Send password reset email

**Request:**
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

### `GET /api/v1/auth/me`
**Pages:** All authenticated pages (header, nav)  
**Headers:** `Authorization: Bearer <token>`  
**Purpose:** Get current user session

**Response:**
```json
{
  "id": "string",
  "email": "string",
  "fullName": "string",
  "avatar": "string",
  "role": "customer" | "business",
  "businessId": "string"
}
```

---

## 📂 2. Categories APIs

### `GET /api/v1/categories`
**Pages:** `/categories`, `/` (homepage)  
**Purpose:** List all categories with business counts

**Query Params:**
- `search`: string (optional)
- `groupBy`: string (optional) - "home-services", "outdoor", etc.

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

**Frontend Uses:**
- Homepage: Top 8 categories
- Categories page: All 50+ categories grouped

---

### `GET /api/v1/categories/:slug`
**Pages:** `/categories/[category]`  
**Purpose:** Get single category with businesses and FAQs

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
      "logo": "string",
      "rating": number,
      "reviewCount": number,
      "verified": boolean,
      "categories": ["string"],
      "city": "string",
      "tagline": "string"
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

## 🏢 3. Businesses APIs

### `GET /api/v1/businesses`
**Pages:** `/businesses`, `/` (featured section)  
**Purpose:** Search and filter businesses

**Query Params:**
- `q`: string (search query)
- `category`: string (slug)
- `city`: string
- `rating`: number (min rating 1-5)
- `verified`: boolean
- `distance`: number (miles)
- `lat`: number
- `lng`: number
- `sort`: "relevance" | "rating" | "reviews" | "distance"
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `view`: "grid" | "list"

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

**Frontend State:**
- Businesses page: Full search with all filters
- Homepage: Top 4 featured businesses (limit=4, sort=rating)

---

### `GET /api/v1/businesses/:slug`
**Pages:** `/businesses/[slug]`  
**Purpose:** Get full business profile

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
  "verifiedBadge": {
    "licenseVerified": boolean,
    "insuranceVerified": boolean,
    "backgroundCheckVerified": boolean
  },
  "rating": number,
  "reviewCount": number,
  "categories": ["string"],
  "services": [
    {
      "id": "string",
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
      "caption": "string",
      "order": number
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "year": number,
      "imageUrl": "string"
    }
  ],
  "ratingBreakdown": {
    "overall": number,
    "quality": number,
    "professionalism": number,
    "value": number,
    "responsiveness": number
  },
  "about": {
    "yearsInBusiness": number,
    "teamSize": string,
    "languages": ["string"],
    "specialties": ["string"]
  }
}
```

**Frontend Tabs:**
- About: description, about section, contact, hours, coverage
- Services: services array
- Reviews: separate API (see below)
- Portfolio: portfolio array

---

### `POST /api/v1/businesses`
**Pages:** `/add-your-business`  
**Headers:** `Authorization: Bearer <token>`  
**Purpose:** Create new business listing

**Request:**
```json
{
  "name": "string",
  "tagline": "string",
  "description": "string",
  "categories": ["string"],
  "contact": {
    "phone": "string",
    "email": "string",
    "website": "string"
  },
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

**Response:**
```json
{
  "success": true,
  "business": {
    "id": "string",
    "slug": "string",
    "status": "pending_verification"
  }
}
```

---

### `POST /api/v1/businesses/:id/favorite`
**Pages:** `/businesses`, `/businesses/[slug]`, `/categories/[category]`  
**Headers:** `Authorization: Bearer <token>`  
**Purpose:** Toggle favorite status

**Request:**
```json
{
  "action": "add" | "remove"
}
```

**Response:**
```json
{
  "success": true,
  "isFavorite": boolean
}
```

**Frontend Component:** `BusinessCard.tsx` - heart icon toggle

---

### `POST /api/v1/businesses/:id/share`
**Pages:** `/businesses/[slug]`  
**Purpose:** Track share analytics

**Request:**
```json
{
  "platform": "facebook" | "twitter" | "email" | "link"
}
```

**Response:**
```json
{
  "success": true,
  "shareUrl": "string"
}
```

---

## ⭐ 4. Reviews & Ratings APIs

### `GET /api/v1/businesses/:slug/reviews`
**Pages:** `/businesses/[slug]` (Reviews tab)  
**Purpose:** Get paginated reviews for a business

**Query Params:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `sort`: "recent" | "highest" | "lowest" | "helpful"

**Response:**
```json
{
  "reviews": [
    {
      "id": "string",
      "author": {
        "id": "string",
        "name": "string",
        "avatar": "string",
        "reviewCount": number
      },
      "rating": number,
      "ratings": {
        "quality": number,
        "professionalism": number,
        "value": number,
        "responsiveness": number
      },
      "comment": "string",
      "date": "string (ISO)",
      "verified": boolean,
      "helpful": number,
      "photos": ["string"],
      "businessResponse": {
        "comment": "string",
        "date": "string (ISO)"
      } | null
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  },
  "summary": {
    "averageRating": number,
    "totalReviews": number,
    "distribution": {
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

### `POST /api/v1/businesses/:slug/reviews`
**Pages:** `/businesses/[slug]` (after service)  
**Headers:** `Authorization: Bearer <token>`  
**Purpose:** Submit a review

**Request:**
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
  "serviceDate": "string (ISO)",
  "photos": ["string (base64 or URLs)"]
}
```

**Response:**
```json
{
  "success": true,
  "review": {
    "id": "string",
    "createdAt": "string"
  }
}
```

**Validation:**
- Must be logged in
- Can only review once per business (or once per service)
- Comment min 10 chars

---

### `POST /api/v1/reviews/:id/helpful`
**Pages:** `/businesses/[slug]` (Reviews tab)  
**Headers:** `Authorization: Bearer <token>` (optional)  
**Purpose:** Mark review as helpful

**Response:**
```json
{
  "success": true,
  "helpfulCount": number
}
```

---

### `POST /api/v1/reviews/:id/response`
**Pages:** Business dashboard (future)  
**Headers:** `Authorization: Bearer <token>`  
**Purpose:** Business responds to review

**Request:**
```json
{
  "comment": "string"
}
```

**Response:**
```json
{
  "success": true,
  "response": {
    "id": "string",
    "comment": "string",
    "date": "string"
  }
}
```

---

## 💬 5. Quote/Lead Request APIs

### `POST /api/v1/quotes`
**Pages:** `/businesses/[slug]` (Request Quote button)  
**Headers:** `Authorization: Bearer <token>` (optional)  
**Purpose:** Submit quote request

**Request:**
```json
{
  "businessId": "string",
  "customerName": "string",
  "customerEmail": "string",
  "customerPhone": "string",
  "serviceNeeded": "string",
  "description": "string",
  "preferredDate": "string (ISO)",
  "budget": "string",
  "urgency": "immediate" | "this_week" | "flexible"
}
```

**Response:**
```json
{
  "success": true,
  "quoteId": "string",
  "message": "Quote request sent successfully",
  "estimatedResponseTime": "string"
}
```

**Email Triggers:**
- Send to business owner
- Send confirmation to customer

---

### `GET /api/v1/quotes`
**Pages:** Customer dashboard (future)  
**Headers:** `Authorization: Bearer <token>`  
**Purpose:** Get user's quote requests

**Response:**
```json
{
  "quotes": [
    {
      "id": "string",
      "business": {
        "name": "string",
        "logo": "string",
        "slug": "string"
      },
      "serviceNeeded": "string",
      "status": "pending" | "responded" | "accepted" | "declined" | "expired",
      "createdAt": "string",
      "businessResponse": {
        "message": "string",
        "estimatedPrice": "string",
        "estimatedTime": "string",
        "respondedAt": "string"
      } | null
    }
  ]
}
```

---

## ❤️ 6. Favorites APIs

### `GET /api/v1/favorites`
**Pages:** Customer dashboard (future), `/businesses` (filter)  
**Headers:** `Authorization: Bearer <token>`  
**Purpose:** Get user's favorite businesses

**Response:**
```json
{
  "favorites": [
    {
      "id": "string",
      "businessId": "string",
      "business": {
        "name": "string",
        "slug": "string",
        "logo": "string",
        "rating": number,
        "reviewCount": number,
        "verified": boolean,
        "categories": ["string"]
      },
      "addedAt": "string"
    }
  ]
}
```

---

## 🔍 7. Search & Autocomplete APIs

### `GET /api/v1/search/autocomplete`
**Pages:** `/businesses` (search bar), Homepage  
**Purpose:** Real-time search suggestions

**Query Params:**
- `q`: string (min 2 chars)
- `limit`: number (default: 10)

**Response:**
```json
{
  "suggestions": [
    {
      "type": "category" | "business" | "city" | "service",
      "name": "string",
      "slug": "string",
      "meta": "string",
      "icon": "string"
    }
  ]
}
```

**Frontend Behavior:**
- Debounce: 300ms
- Shows categories, businesses, cities

---

### `GET /api/v1/search/popular`
**Pages:** `/` (homepage)  
**Purpose:** Get popular/trending searches

**Response:**
```json
{
  "popularSearches": [
    {
      "term": "string",
      "count": number,
      "slug": "string"
    }
  ]
}
```

**Frontend:** Chips below hero search

---

## 📧 8. Contact & Support APIs

### `POST /api/v1/contact`
**Pages:** `/contact`  
**Purpose:** Submit contact form

**Request:**
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
  "message": "Message sent successfully. We'll respond within 24 hours."
}
```

**Email Triggers:**
- Send to support team
- Send confirmation to user

---

### `GET /api/v1/faq`
**Pages:** `/faq`  
**Purpose:** Get FAQ content

**Query Params:**
- `category`: "customers" | "businesses" | "payments" | "trust"

**Response:**
```json
{
  "categories": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "faqs": [
        {
          "id": "string",
          "question": "string",
          "answer": "string",
          "order": number
        }
      ]
    }
  ]
}
```

**Frontend Behavior:**
- Tab switching between categories
- Search filter (client-side)
- Accordion expand/collapse

---

## 🚀 9. Business Onboarding APIs

### `POST /api/v1/onboarding/business/step`
**Pages:** `/add-your-business` (multi-step form)  
**Headers:** `Authorization: Bearer <token>`  
**Purpose:** Save onboarding progress

**Request:**
```json
{
  "step": number,
  "data": {
    /* Step-specific data */
  }
}
```

**Response:**
```json
{
  "success": true,
  "currentStep": number,
  "nextStep": number | null,
  "completed": boolean
}
```

**Steps:**
1. Business Info
2. Services & Pricing
3. Verification Documents
4. Plan Selection

---

### `POST /api/v1/subscriptions`
**Pages:** `/add-your-business` (Pro plan)  
**Headers:** `Authorization: Bearer <token>`  
**Purpose:** Create subscription

**Request:**
```json
{
  "businessId": "string",
  "plan": "pro",
  "paymentMethod": {
    "type": "card",
    "token": "string"
  },
  "billingCycle": "monthly" | "annual"
}
```

**Response:**
```json
{
  "success": true,
  "subscription": {
    "id": "string",
    "status": "active",
    "currentPeriodEnd": "string",
    "price": number
  }
}
```

---

## 📊 10. Analytics & Tracking APIs

### `POST /api/v1/analytics/page-view`
**Pages:** All pages  
**Purpose:** Track page views

**Request:**
```json
{
  "page": "string",
  "referrer": "string",
  "userId": "string" | null
}
```

**Response:**
```json
{
  "success": true
}
```

**Frontend:** Fire on page load (useEffect)

---

### `POST /api/v1/analytics/business-click`
**Pages:** `/businesses`, `/categories/[category]`  
**Purpose:** Track business profile clicks

**Request:**
```json
{
  "businessId": "string",
  "source": "search" | "category" | "homepage" | "featured"
}
```

---

### `POST /api/v1/analytics/quote-conversion`
**Pages:** `/businesses/[slug]`  
**Purpose:** Track quote request conversions

**Request:**
```json
{
  "businessId": "string",
  "quoteId": "string"
}
```

---

## 🔔 11. Notifications APIs

### `GET /api/v1/notifications`
**Pages:** All authenticated pages (header bell icon)  
**Headers:** `Authorization: Bearer <token>`  
**Purpose:** Get user notifications

**Query Params:**
- `unreadOnly`: boolean
- `page`: number
- `limit`: number

**Response:**
```json
{
  "notifications": [
    {
      "id": "string",
      "type": "quote_received" | "review_posted" | "response_received" | "subscription_expiring",
      "title": "string",
      "message": "string",
      "read": boolean,
      "link": "string",
      "createdAt": "string"
    }
  ],
  "unreadCount": number
}
```

---

### `PUT /api/v1/notifications/:id/read`
**Pages:** All authenticated pages  
**Headers:** `Authorization: Bearer <token>`  
**Purpose:** Mark notification as read

**Response:**
```json
{
  "success": true
}
```

---

### `PUT /api/v1/notifications/read-all`
**Pages:** Notifications dropdown  
**Headers:** `Authorization: Bearer <token>`  
**Purpose:** Mark all as read

**Response:**
```json
{
  "success": true,
  "markedCount": number
}
```

---

## 📱 12. User Preferences APIs

### `GET /api/v1/users/preferences`
**Pages:** User settings (future)  
**Headers:** `Authorization: Bearer <token>`  
**Purpose:** Get user preferences

**Response:**
```json
{
  "theme": "light" | "dark" | "system",
  "notifications": {
    "email": boolean,
    "push": boolean,
    "sms": boolean
  },
  "privacy": {
    "showEmail": boolean,
    "showPhone": boolean
  }
}
```

---

### `PUT /api/v1/users/preferences`
**Pages:** User settings  
**Headers:** `Authorization: Bearer <token>`  
**Purpose:** Update preferences

**Request:**
```json
{
  "theme": "light" | "dark" | "system",
  "notifications": {
    "email": boolean,
    "push": boolean,
    "sms": boolean
  }
}
```

---

## 🗺️ 13. Location & Geolocation APIs

### `GET /api/v1/locations/cities`
**Pages:** `/businesses` (location filter), `/categories/[category]`  
**Purpose:** Get available cities with business counts

**Response:**
```json
{
  "cities": [
    {
      "name": "string",
      "state": "string",
      "businessCount": number,
      "coordinates": {
        "lat": number,
        "lng": number
      }
    }
  ]
}
```

---

### `POST /api/v1/locations/geocode`
**Pages:** `/businesses` (location search)  
**Purpose:** Convert address to coordinates

**Request:**
```json
{
  "address": "string"
}
```

**Response:**
```json
{
  "lat": number,
  "lng": number,
  "formatted_address": "string",
  "city": "string",
  "state": "string"
}
```

---

### `GET /api/v1/locations/nearby`
**Pages:** `/businesses` (near me feature)  
**Purpose:** Get businesses near coordinates

**Query Params:**
- `lat`: number
- `lng`: number
- `radius`: number (miles, default: 25)
- `limit`: number

**Response:**
```json
{
  "businesses": [
    /* Same as businesses search response */
  ]
}
```

---

## 📄 14. Static Content APIs

### `GET /api/v1/content/legal/:page`
**Pages:** `/terms`, `/privacy`, `/cookies`  
**Purpose:** Get legal page content (for CMS updates)

**Response:**
```json
{
  "slug": "string",
  "title": "string",
  "lastUpdated": "string",
  "content": "string (HTML or Markdown)"
}
```

---

## 🛠️ 15. Admin APIs (Future Dashboard)

### `GET /api/v1/admin/businesses/pending`
**Purpose:** Get businesses awaiting verification  
**Headers:** `Authorization: Bearer <admin-token>`

---

### `PUT /api/v1/admin/businesses/:id/verify`
**Purpose:** Approve/reject business verification

---

### `GET /api/v1/admin/stats`
**Purpose:** Platform statistics dashboard

**Response:**
```json
{
  "totalBusinesses": number,
  "totalUsers": number,
  "totalReviews": number,
  "activeSubscriptions": number,
  "monthlyRevenue": number,
  "recentSignups": number,
  "conversionRate": number
}
```

---

## 📊 API Summary

### **Total Endpoints Required: 60+**

**By Category:**
- Authentication: 6 endpoints
- Categories: 2 endpoints
- Businesses: 5 endpoints
- Reviews: 3 endpoints
- Quotes: 2 endpoints
- Favorites: 1 endpoint
- Search: 2 endpoints
- Contact/Support: 2 endpoints
- Onboarding: 2 endpoints
- Subscriptions: 1 endpoint
- Analytics: 3 endpoints
- Notifications: 3 endpoints
- User Preferences: 2 endpoints
- Locations: 3 endpoints
- Static Content: 1 endpoint
- Admin: 3+ endpoints

---

## 🔒 Security Requirements

1. **JWT Authentication:**
   - Access tokens (15min expiry)
   - Refresh tokens (7 days)
   - Token rotation on refresh

2. **Rate Limiting:**
   - Auth endpoints: 5 req/min per IP
   - Search: 100 req/min per user
   - General: 60 req/min per user

3. **Input Validation:**
   - All inputs sanitized
   - SQL injection prevention
   - XSS protection

4. **CORS:**
   - Whitelist frontend domain
   - Credentials: include

5. **HTTPS Only:** All endpoints require HTTPS in production

---

## 🚀 Priority Implementation Order

### **Phase 1: MVP (Week 1-2)**
1. ✅ Auth endpoints (login, register, logout)
2. ✅ Categories (list, detail)
3. ✅ Businesses (search, detail)
4. ✅ Reviews (list only)

### **Phase 2: Core Features (Week 3-4)**
5. ✅ Quote requests
6. ✅ Favorites
7. ✅ Contact form
8. ✅ Search autocomplete

### **Phase 3: Enhancement (Week 5-6)**
9. ✅ Business onboarding
10. ✅ Subscriptions
11. ✅ Review submission
12. ✅ Notifications

### **Phase 4: Analytics & Admin (Week 7-8)**
13. ✅ Analytics tracking
14. ✅ Admin panel
15. ✅ User preferences

---

## 📝 Implementation Notes

### **Database Schema:**
- PostgreSQL recommended
- Tables: users, businesses, categories, reviews, quotes, favorites, subscriptions, notifications

### **Caching Strategy:**
- Redis for session management
- Cache categories (1 hour TTL)
- Cache business profiles (15 min TTL)
- Cache search results (5 min TTL)

### **File Storage:**
- AWS S3 or Cloudinary for images
- Max file size: 5MB per image
- Supported formats: JPG, PNG, WEBP

### **Third-Party Services:**
- Stripe for payments
- SendGrid for emails
- Google Maps API for geocoding
- Sentry for error tracking

### **API Documentation:**
- Swagger/OpenAPI spec
- Postman collection
- Example requests/responses

---

## ✅ Frontend Integration Checklist

### **Authentication Pages:**
- [ ] Login: Connect POST /api/v1/auth/login
- [ ] Register: Connect POST /api/v1/auth/register
- [ ] Google OAuth: Connect POST /api/v1/auth/oauth/google
- [ ] Forgot Password: Connect POST /api/v1/auth/forgot-password

### **Browse & Search:**
- [ ] Categories: Connect GET /api/v1/categories
- [ ] Category Detail: Connect GET /api/v1/categories/:slug
- [ ] Business Search: Connect GET /api/v1/businesses
- [ ] Search Autocomplete: Connect GET /api/v1/search/autocomplete

### **Business Profile:**
- [ ] Business Detail: Connect GET /api/v1/businesses/:slug
- [ ] Reviews: Connect GET /api/v1/businesses/:slug/reviews
- [ ] Quote Request: Connect POST /api/v1/quotes
- [ ] Favorite Toggle: Connect POST /api/v1/businesses/:id/favorite

### **User Actions:**
- [ ] Contact Form: Connect POST /api/v1/contact
- [ ] Add Business: Connect POST /api/v1/businesses
- [ ] Subscribe: Connect POST /api/v1/subscriptions

### **Static:**
- [ ] FAQ: Connect GET /api/v1/faq
- [ ] Analytics: Add tracking calls on all pages

---

**Last Updated:** January 2025  
**Frontend Version:** Next.js 16.3.0  
**API Version:** v1
