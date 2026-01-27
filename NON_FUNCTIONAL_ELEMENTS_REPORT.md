# Non-Functional Interactive Elements Report

This document outlines all interactive elements that are currently non-functional and require backend integration or additional implementation.

## Elements Requiring Backend/State Management

### 1. Poll Voting (CommunitySection - Home Page)
**Location:** `components/section/home/CommunitySection.tsx`

**Current State:** Poll buttons are clickable but don't perform any action. The poll displays static vote percentages.

**Required Implementation:**
- Backend API endpoint for submitting votes
- User authentication to prevent duplicate voting
- Real-time vote counting and percentage calculation
- State management to update UI after voting
- Optionally: Link to `/community/polls-and-voting` for full poll functionality

**Suggested Approach:**
- Integrate with existing poll system at `/community/polls-and-voting`
- Add vote submission API endpoint
- Use React state or Zustand store for vote management
- Show success/error feedback after voting

---

### 2. Like/Favorite Buttons (MusicCard, VideoCard)
**Location:** 
- `components/cards/MusicCard.tsx` (Heart button)
- `components/cards/VideoCard.tsx` (Heart button)

**Current State:** Buttons are visible on hover but don't perform any action when clicked.

**Required Implementation:**
- User authentication system
- Backend API to save/retrieve user favorites
- Database table for user_favorites
- State management to track favorite status
- Visual feedback (filled/outlined heart icon)

**Suggested Approach:**
- Create `/api/favorites` endpoint (POST/DELETE)
- Use Zustand store for favorite state
- Add loading states and error handling
- Show toast notifications for success/error

---

### 3. Download Functionality (MusicCard)
**Location:** `components/cards/MusicCard.tsx` (Download button)

**Current State:** Download button is visible but doesn't trigger any download action.

**Required Implementation:**
- File storage system (S3, Cloudinary, etc.)
- Backend API to generate secure download links
- Download tracking/analytics
- User authentication (optional, depending on business rules)
- File metadata (size, format, etc.)

**Suggested Approach:**
- Create `/api/download/[id]` endpoint
- Generate signed URLs for secure downloads
- Track download counts in database
- Handle different file formats (MP3, WAV, etc.)
- Show download progress indicator

---

### 4. Share Functionality (VideoCard)
**Location:** `components/cards/VideoCard.tsx` (Share button)

**Current State:** Share button is visible but doesn't perform any action.

**Required Implementation:**
- Web Share API integration (for native sharing)
- Social media sharing links (Facebook, Twitter, etc.)
- Copy-to-clipboard functionality for shareable links
- Share tracking/analytics

**Suggested Approach:**
- Use Web Share API when available (mobile)
- Fallback to custom share modal with social links
- Generate shareable URLs with tracking parameters
- Add copy-to-clipboard functionality
- Show share success feedback

---

### 5. Newsletter Subscription (Footer)
**Location:** `components/layout/Footer.tsx`

**Current State:** Input and button are disabled with a note that backend integration is required.

**Required Implementation:**
- Email service integration (SendGrid, Mailchimp, etc.)
- Backend API endpoint for email subscriptions
- Database table for newsletter subscribers
- Email validation
- Double opt-in (optional)
- Unsubscribe functionality

**Suggested Approach:**
- Create `/api/newsletter/subscribe` endpoint
- Integrate with email service provider
- Add email validation on frontend and backend
- Show success/error messages
- Store subscriber data in database
- Send confirmation email

---

### 6. Play Functionality (MusicCard, VideoCard)
**Location:**
- `components/cards/MusicCard.tsx` (Play button)
- `components/cards/VideoCard.tsx` (Play button)

**Current State:** Play buttons are visible but don't trigger audio/video playback.

**Required Implementation:**
- Audio/video player component
- Media file URLs from backend
- Playback state management
- Playlist/queue functionality (optional)
- Progress tracking
- Play count analytics

**Suggested Approach:**
- Create AudioPlayer and VideoPlayer components
- Use HTML5 audio/video elements or library (react-player, howler.js)
- Global state management for currently playing media
- Add play/pause controls
- Track play events for analytics
- Handle different media formats

---

## Elements Requiring New Pages

### 1. `/music/upload` - Music Upload Page
**Current State:** Links point to `/community/promote-your-content` as a workaround.

**Required Implementation:**
- Create dedicated music upload page
- File upload component with drag-and-drop
- Form for metadata (title, artist, genre, etc.)
- Backend API for file upload
- Progress tracking
- Success/error handling

**Suggested Approach:**
- Create `app/music/upload/page.tsx`
- Use existing upload form components if available
- Integrate with file storage service
- Add validation and error handling

---

### 2. `/music/submit-beats` - Beats Submission Page
**Current State:** Links point to `/community/promote-your-content` as a workaround.

**Required Implementation:**
- Similar to music upload page
- Specialized form for beat submissions
- Different metadata fields (BPM, key, etc.)

**Suggested Approach:**
- Create `app/music/submit-beats/page.tsx`
- Reuse upload components with different fields
- Add beat-specific metadata

---

### 3. `/music/recent` - Recent Uploads Page
**Current State:** "View All" button in RecentUploads section doesn't link anywhere.

**Required Implementation:**
- Create page to display recent music uploads
- Filtering and sorting options
- Pagination

**Suggested Approach:**
- Create `app/music/recent/page.tsx`
- Use existing music listing components
- Add date-based filtering

---

### 4. `/videos/upload` - Video Upload Page
**Current State:** Links point to `/community/promote-your-content` as a workaround.

**Required Implementation:**
- Similar to music upload but for videos
- Video file upload with preview
- Thumbnail generation
- Video processing/transcoding

**Suggested Approach:**
- Create `app/videos/upload/page.tsx`
- Use video upload components
- Integrate with video processing service

---

### 5. `/help-center` or `/guidelines` - Help/Guidelines Page
**Current State:** Footer links to `/contact` and `/terms-and-conditions` as alternatives.

**Required Implementation:**
- Create help center page with FAQ
- Search functionality
- Category organization
- Contact support form

**Suggested Approach:**
- Create `app/help-center/page.tsx` or `app/guidelines/page.tsx`
- Add FAQ component
- Include search functionality
- Link to contact form

---

## Elements That Can Use Existing Features

### 1. Upload Buttons
**Status:** ✅ **RESOLVED** - All upload buttons now link to `/community/promote-your-content` which exists.

### 2. Genre/Category Filters
**Status:** ✅ **RESOLVED** - Genre and category filters are now functional on home page sections with local state management.

### 3. Artist Cards
**Status:** ✅ **RESOLVED** - Artist cards link to `/music/artists` page.

---

## Implementation Priority Recommendations

### High Priority (User Experience Impact)
1. **Play Functionality** - Core feature for music/video platform
2. **Download Functionality** - Important for user engagement
3. **Like/Favorite System** - Enhances user engagement and retention

### Medium Priority (Engagement Features)
4. **Share Functionality** - Helps with content distribution
5. **Poll Voting** - Community engagement feature
6. **Newsletter Subscription** - Marketing and user retention

### Low Priority (Nice to Have)
7. **Dedicated Upload Pages** - Current workaround (linking to promote page) is acceptable)
8. **Help Center Page** - Current alternatives (contact, terms) are functional

---

## Notes

- All non-functional elements have been identified and documented
- Where possible, workarounds have been implemented (e.g., linking to existing pages)
- Interactive elements that don't require backend (like filters) have been implemented
- Cards are now clickable and route to detail pages when IDs are available
- Footer links have been updated to point to existing pages

---

**Last Updated:** January 26, 2025
**Status:** All linking tasks completed. Backend integration tasks documented for future implementation.
