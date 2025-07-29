# Idea Forum - Project Specification v2.0
*Incorporating Flarum-inspired Design Language*

## 🎯 Project Vision
A collaborative document editing platform that combines the clean, modern aesthetics of Flarum with advanced document management, real-time collaboration, and intelligent content organization through thread and wiki views.

## 🎨 Design Philosophy (Flarum-Inspired)

### Visual Design Language
- **Clean Minimalism**: Emphasis on whitespace, subtle shadows, and clean typography
- **Card-Based Layout**: Content organized in clean cards with subtle borders and hover effects
- **Consistent Color Palette**: Muted backgrounds with accent colors for actions and states
- **Typography Hierarchy**: Clear font weights and sizes for content hierarchy
- **Responsive Grid**: Fluid layouts that adapt seamlessly across devices

### UI/UX Principles
- **Content-First**: Design serves content, not the other way around
- **Progressive Disclosure**: Show relevant information when needed
- **Intuitive Navigation**: Clear breadcrumbs and contextual navigation
- **Subtle Interactions**: Smooth transitions and micro-animations
- **Accessibility**: WCAG 2.1 AA compliance with proper contrast and keyboard navigation

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS (customized for Flarum aesthetics)
- **Backend**: Node.js + GraphQL + Apollo Server
- **Database**: PostgreSQL with Redis caching
- **Real-time**: GraphQL Subscriptions over WebSocket
- **Authentication**: JWT + Passwordless login + OAuth (Google)
- **Deployment**: Docker containers with Docker Compose

### Core Components
1. **Document Management System**: Create, edit, organize collaborative documents
2. **Threading System**: Nested discussions with voting and consensus mechanisms
3. **Wiki View**: Alternative presentation mode for finalized content
4. **Real-time Collaboration**: Live updates and collaborative editing
5. **User Management**: Authentication, profiles, and permissions
6. **Search & Discovery**: Full-text search with intelligent filtering

## 🎨 Design System Specification

### Color Palette (Flarum-Inspired)
```css
/* Primary Colors */
--primary-50: #f0f9ff;    /* Light blue backgrounds */
--primary-100: #e0f2fe;   /* Subtle highlights */
--primary-500: #0ea5e9;   /* Primary actions */
--primary-600: #0284c7;   /* Hover states */
--primary-700: #0369a1;   /* Active states */

/* Neutral Colors */
--gray-50: #f9fafb;       /* Page backgrounds */
--gray-100: #f3f4f6;      /* Card backgrounds */
--gray-200: #e5e7eb;      /* Borders */
--gray-300: #d1d5db;      /* Dividers */
--gray-400: #9ca3af;      /* Placeholder text */
--gray-500: #6b7280;      /* Secondary text */
--gray-700: #374151;      /* Primary text */
--gray-900: #111827;      /* Headings */

/* Semantic Colors */
--success-500: #10b981;   /* Success states */
--warning-500: #f59e0b;   /* Warning states */
--error-500: #ef4444;     /* Error states */
```

### Typography Scale
```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Scale */
--text-xs: 0.75rem;       /* 12px - Meta information */
--text-sm: 0.875rem;      /* 14px - Secondary text */
--text-base: 1rem;        /* 16px - Body text */
--text-lg: 1.125rem;      /* 18px - Large body */
--text-xl: 1.25rem;       /* 20px - Small headings */
--text-2xl: 1.5rem;       /* 24px - Section headings */
--text-3xl: 1.875rem;     /* 30px - Page headings */
--text-4xl: 2.25rem;      /* 36px - Hero headings */
```

### Spacing System
```css
/* Consistent 4px base unit */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Component Specifications

#### Cards
```css
.card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.card:hover {
  border-color: var(--gray-300);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

#### Buttons
```css
.btn-primary {
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
}
```

## 📱 User Interface Specifications

### Homepage Layout (Flarum-Inspired)
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Logo | Search | User Menu                           │
├─────────────────────────────────────────────────────────────┤
│ Navigation: Latest | Categories | Tags | Create             │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Document Card                                           │ │
│ │ ┌─────┐ Title                              Meta Info    │ │
│ │ │ Img │ Description excerpt...             Author       │ │
│ │ │     │ Tags: [tag1] [tag2]               Date          │ │
│ │ └─────┘ Stats: 👁 views | 💬 sections | ⭐ votes      │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Document Card                                           │ │
│ │ ...                                                     │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Footer: Links | Copyright                                   │
└─────────────────────────────────────────────────────────────┘
```

### Document View Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumb: Home > Category > Document Title               │
├─────────────────────────────────────────────────────────────┤
│ Document Header                                             │
│ ┌─────┐ Title                    Actions: Edit | Share     │
│ │ Img │ Description               Views: 1.2k | Created    │
│ │     │ Tags: [tag1] [tag2]      Author: @username         │
│ └─────┘ Last updated: 2 hours ago                          │
├─────────────────────────────────────────────────────────────┤
│ View Toggle: [Thread View] [Wiki View]                     │
├─────────────────────────────────────────────────────────────┤
│ Content Area                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Section Card                                            │ │
│ │ ┌─────┐ @author • 2h ago        [↑ 12] [↓ 2] [Reply]   │ │
│ │ │ Img │ Section content...                              │ │
│ │ └─────┘                                                 │ │
│ │   ┌─────────────────────────────────────────────────┐   │ │
│ │   │ Nested Reply                                    │   │ │
│ │   │ ┌─────┐ @replier • 1h ago    [↑ 5] [↓ 0]       │   │ │
│ │   │ │ Img │ Reply content...                        │   │ │
│ │   │ └─────┘                                         │   │ │
│ │   └─────────────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Add Section: [Rich Text Editor] [Submit]                   │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Feature Specifications

### 1. Document Management
- **Creation**: Rich form with title, description, tags, privacy settings
- **Editing**: In-place editing with auto-save and version history
- **Organization**: Categories, tags, and search-based discovery
- **Permissions**: Public/private documents with granular sharing

### 2. Threading System
- **Nested Discussions**: Unlimited depth with visual indentation
- **Voting Mechanism**: Upvote/downvote with promotion to wiki
- **Consensus Tracking**: Visual indicators for community agreement
- **Moderation**: Flagging, hiding, and community moderation tools

### 3. Wiki View
- **Curated Content**: Promoted sections displayed as cohesive document
- **Edit History**: Track changes and contributor attribution
- **Table of Contents**: Auto-generated navigation for long documents
- **Export Options**: PDF, Markdown, and HTML export

### 4. Real-time Features
- **Live Updates**: Real-time section additions and edits
- **Presence Indicators**: Show active users and their cursors
- **Notifications**: In-app and email notifications for updates
- **Collaborative Editing**: Conflict resolution and merge strategies

### 5. User Experience
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Dark Mode**: Toggle between light and dark themes
- **Accessibility**: Screen reader support and keyboard navigation
- **Performance**: Lazy loading and optimistic updates

## 📊 Data Models

### User
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  reputation: number;
  joinDate: Date;
  lastActive: Date;
  preferences: UserPreferences;
}
```

### Document
```typescript
interface Document {
  id: string;
  title: string;
  description?: string;
  slug: string;
  author: User;
  category?: Category;
  tags: string[];
  isPublic: boolean;
  viewCount: number;
  sections: Section[];
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
}
```

### Section
```typescript
interface Section {
  id: string;
  document: Document;
  content: string;
  author: User;
  parent?: Section;
  children: Section[];
  position: number;
  votes: Vote[];
  voteScore: number;
  isPromoted: boolean;
  metadata: SectionMetadata;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Completed ✅)
- [x] Project setup and infrastructure
- [x] Authentication system
- [x] Basic document CRUD
- [x] GraphQL API foundation
- [x] React frontend setup

### Phase 2: Core Features (In Progress)
- [x] Document creation and viewing
- [x] User authentication flow
- [ ] Flarum-inspired UI redesign
- [ ] Section threading system
- [ ] Voting mechanism
- [ ] Real-time updates

### Phase 3: Advanced Features
- [ ] Wiki view implementation
- [ ] Rich text editor integration
- [ ] Search and filtering
- [ ] User profiles and reputation
- [ ] Mobile responsiveness optimization

### Phase 4: Polish & Launch
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Testing and bug fixes
- [ ] Documentation and deployment
- [ ] Community features

## 🎯 Success Metrics

### User Engagement
- **Daily Active Users**: Target 100+ within first month
- **Document Creation Rate**: 10+ new documents per day
- **Section Engagement**: Average 5+ sections per document
- **User Retention**: 60% weekly retention rate

### Content Quality
- **Consensus Rate**: 70% of sections reach community consensus
- **Wiki Promotion**: 30% of quality sections promoted to wiki view
- **Search Success**: 80% of searches result in relevant content
- **User Satisfaction**: 4.5+ star rating from user feedback

### Technical Performance
- **Page Load Time**: < 2 seconds for initial load
- **Real-time Latency**: < 100ms for live updates
- **Uptime**: 99.9% availability
- **Mobile Performance**: Lighthouse score > 90

## 🔒 Security & Privacy

### Data Protection
- **Encryption**: All data encrypted at rest and in transit
- **Privacy Controls**: Granular privacy settings for documents
- **GDPR Compliance**: Right to deletion and data portability
- **Audit Logging**: Complete audit trail for all actions

### Authentication Security
- **Passwordless Login**: Secure email-based authentication
- **OAuth Integration**: Google OAuth with secure token handling
- **Session Management**: Secure JWT tokens with refresh mechanism
- **Rate Limiting**: Protection against brute force attacks

## 📈 Scalability Considerations

### Technical Scalability
- **Database Optimization**: Proper indexing and query optimization
- **Caching Strategy**: Redis for session and content caching
- **CDN Integration**: Static asset delivery optimization
- **Horizontal Scaling**: Containerized architecture for easy scaling

### Content Scalability
- **Pagination**: Efficient pagination for large document lists
- **Search Optimization**: Elasticsearch integration for large datasets
- **Media Handling**: Optimized image and file upload handling
- **Archive Strategy**: Automated archiving of inactive content

---

*This specification reflects the current state of the Idea Forum project with Flarum-inspired design principles and serves as the roadmap for continued development.*

**Last Updated**: 2025-07-29  
**Version**: 2.0  
**Status**: Active Development
