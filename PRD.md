# PRD: Accurate Weather App with Real-Time Maps

## Introduction

Build a clean, Apple Weather-style weather application using Next.js (frontend) and Node.js (backend) that delivers accurate, real-time weather data from multiple reliable providers. The app will display current conditions (feels-like temp, humidity, wind), daily forecasts (max/min temps), hourly forecasts, and an interactive map showing real-time satellite/cloud imagery. This solves the problem of navigating fake weather apps by using trusted, verified data sources.

## Goals

- Display accurate current weather with feels-like temperature
- Show daily forecast with high/low temperatures
- Provide hourly breakdown for the next 24-48 hours
- Display weather parameters (humidity, wind speed, pressure, UV index, visibility)
- Render real-time satellite/cloud map overlay with interactive features
- Support geolocation-based detection + manual location search
- Maintain location favorites/history for quick access
- Use multiple data providers with automatic fallback for reliability
- Deliver Apple Weather-inspired UI with animations

## User Stories

### US-001: Set up multi-provider weather backend with fallback logic
**Description:** As a developer, I need a reliable backend service that queries multiple weather providers (Open-Meteo, OpenWeatherMap, WeatherAPI) with fallback logic so users always get data even if one provider fails.

**Acceptance Criteria:**
- [x] Create Node.js weather service with Open-Meteo, OpenWeatherMap, WeatherAPI clients
- [x] Implement fallback chain: Open-Meteo → OpenWeatherMap → WeatherAPI
- [x] Cache responses for 10 minutes to reduce API calls
- [x] API endpoint: GET /api/weather?lat={lat}&lon={lon} returns unified format
- [x] Return response includes: current, hourly (48h), daily (7d), alerts
- [x] Error handling returns 503 if all providers fail
- [x] Typecheck passes

### US-002: Create database schema for user locations and favorites
**Description:** As a developer, I need to store user location history and favorites so users can quickly access weather for saved places.

**Acceptance Criteria:**
- [x] Create `locations` table: id, userId, name, latitude, longitude, isFavorite, createdAt, lastAccessedAt
- [x] Create `location_history` table: id, userId, locationId, accessedAt
- [x] Add indices for userId, isFavorite, lastAccessedAt
- [x] Generate and run migrations successfully
- [x] Typecheck passes

### US-003: Build authentication and location management API endpoints
**Description:** As a developer, I need API endpoints for user authentication and location management so the app can save and retrieve user data.

**Acceptance Criteria:**
- [x] POST /api/auth/register - register new user
- [x] POST /api/auth/login - authenticate user
- [x] POST /api/locations - add new location/favorite
- [x] GET /api/locations - fetch all saved locations
- [x] DELETE /api/locations/{id} - remove location
- [x] PATCH /api/locations/{id} - toggle favorite flag
- [x] All endpoints include JWT authentication
- [x] Typecheck passes

### US-004: Build current weather display component (Apple Weather style)
**Description:** As a user, I want to see current weather prominently with feels-like temp, condition description, and key metrics so I understand conditions at a glance.

**Acceptance Criteria:**
- [x] Large current temperature display (feels-like temp highlighted)
- [x] Weather condition icon + description
- [x] Grid showing: Humidity, Wind Speed, Pressure, UV Index, Visibility
- [x] Responsive layout (mobile, tablet, desktop)
- [x] Smooth animations on data refresh
- [x] Typecheck passes
- [x] Verify changes work in browser

### US-005: Build hourly forecast component with interactive timeline
**Description:** As a user, I want to see hourly weather (next 24-48 hours) in a scrollable timeline with temperatures and icons so I can plan my day.

**Acceptance Criteria:**
- [x] Horizontal scrollable hourly list with: time, temp, condition icon, precipitation %
- [x] Highlight current hour
- [x] Tap/click hour to show detailed info (feels-like, wind, humidity)
- [x] Support 24 and 48-hour modes with toggle
- [x] Responsive and smooth scroll
- [x] Typecheck passes
- [x] Verify changes work in browser

### US-006: Build daily forecast component with max/min temps
**Description:** As a user, I want to see a 7-day forecast with high/low temps and condition icons so I can plan ahead.

**Acceptance Criteria:**
- [x] Daily forecast cards: day, high/low temps, condition icon, precipitation chance
- [x] Expandable cards to show hourly breakdown for that day
- [x] Smooth expand/collapse animations
- [x] Mobile-friendly vertical scroll
- [x] Typecheck passes
- [x] Verify changes work in browser

### US-007: Implement real-time satellite/cloud map with Leaflet/Mapbox
**Description:** As a user, I want to see an interactive map with real-time satellite imagery and cloud overlay so I can visualize weather patterns.

**Acceptance Criteria:**
- [x] Integrate Leaflet or Mapbox with OpenWeatherMap tile layer (clouds)
- [x] Display current location marker
- [x] Support zoom, pan, fullscreen controls
- [x] Show weather alerts/warnings as map overlays if available
- [x] Responsive map that resizes with window
- [x] Update cloud layer every 5-10 minutes
- [x] Typecheck passes
- [x] Verify changes work in browser

### US-008: Add geolocation detection and permission handling
**Description:** As a user, I want the app to detect my location automatically and ask permission gracefully so I can see my local weather instantly.

**Acceptance Criteria:**
- [x] Request geolocation on first load with clear permission prompt
- [x] Store permission preference in localStorage
- [x] Fall back to default location (e.g., NYC) if denied
- [x] Show "Enable location" button in settings if previously denied
- [x] Handle errors (permissions denied, location unavailable)
- [x] Update weather when location changes
- [x] Typecheck passes
- [x] Verify changes work in browser

### US-009: Build location search with autocomplete
**Description:** As a user, I want to search for cities/locations with autocomplete suggestions so I can quickly check weather anywhere.

**Acceptance Criteria:**
- [x] Search input with debounced autocomplete (300ms)
- [x] Show 5-10 location suggestions as user types
- [x] Clicking suggestion fetches weather for that location
- [x] Adds location to history automatically
- [x] Search works for city names, zip codes, coordinates
- [x] Loading state during search
- [x] Typecheck passes
- [x] Verify changes work in browser

### US-010: Build location favorites sidebar/panel
**Description:** As a user, I want to see my favorite locations in a sidebar so I can quickly switch between saved places.

**Acceptance Criteria:**
- [x] Sidebar/drawer showing all saved locations
- [x] Star icon to toggle favorite status
- [x] Recently accessed locations shown first
- [x] Tap to switch weather view to that location
- [x] Add new location button opens search
- [x] Long press/right-click to delete location
- [x] Smooth slide animations
- [x] Typecheck passes
- [x] Verify changes work in browser

### US-011: Implement data persistence and offline mode
**Description:** As a user, I want the app to work offline with cached weather data so I can view last-known conditions without internet.

**Acceptance Criteria:**
- [x] Cache current + hourly + daily data in localStorage
- [x] Cache expires after 1 hour (show "last updated" time)
- [x] On offline, display cached data with "offline" indicator
- [x] Attempt to refresh data when connection returns
- [x] Service worker caches static assets (JS, CSS, fonts)
- [x] Typecheck passes
- [x] Verify changes work in browser

### US-012: Add settings panel with theme and units toggle
**Description:** As a user, I want to toggle between Celsius/Fahrenheit and light/dark themes so I can customize the app to my preferences.

**Acceptance Criteria:**
- [ ] Settings modal/drawer with toggles for:
  - [ ] Temperature unit (°C / °F)
  - [ ] Speed unit (km/h / mph)
  - [ ] Theme (Light / Dark / Auto)
  - [ ] Pressure unit (hPa / inHg / mmHg)
- [ ] Settings persist in localStorage
- [ ] Theme changes apply instantly
- [ ] All values update throughout app when units change
- [ ] Typecheck passes
- [ ] Verify changes work in browser

### US-013: Create main app layout and navigation
**Description:** As a user, I want a clean, intuitive layout with easy navigation so I can access all features smoothly.

**Acceptance Criteria:**
- [ ] Header: app title, settings icon, refresh button
- [ ] Main view: current weather + map (toggleable tabs or split view)
- [ ] Hourly forecast below current weather
- [ ] Daily forecast below hourly
- [ ] Sidebar/bottom drawer: location favorites
- [ ] Smooth transitions between views
- [ ] Mobile: hamburger menu for favorites, tabs for weather/map
- [ ] Desktop: sidebar always visible
- [ ] Typecheck passes
- [ ] Verify changes work in browser

### US-014: Add weather alerts and notifications
**Description:** As a user, I want to see weather alerts (severe weather, extreme temps) prominently so I can stay informed of dangerous conditions.

**Acceptance Criteria:**
- [ ] Display alert banner at top if available
- [ ] Show alert type (severe weather, extreme heat, etc.)
- [ ] Include alert description and time range
- [ ] Color coding: red=severe, orange=warning, yellow=advisory
- [ ] Dismissible alerts
- [ ] Optional: browser push notifications for severe alerts
- [ ] Typecheck passes
- [ ] Verify changes work in browser

### US-015: Optimize performance and add loading states
**Description:** As a developer, I need fast load times and clear loading states so users see progress and the app feels responsive.

**Acceptance Criteria:**
- [ ] API calls timeout after 8 seconds
- [ ] Skeleton loaders for current weather, hourly, daily sections
- [ ] Pull-to-refresh gesture on mobile
- [ ] Manual refresh button shows spinner
- [ ] Lazy load map (load only when viewing map tab)
- [ ] Image optimization for weather icons
- [ ] Lighthouse score: Performance >85
- [ ] Typecheck passes
- [ ] Verify changes work in browser

## Non-Goals

- No push notifications for weather events (can add later)
- No rainfall prediction graphs (show % only)
- No air quality index (AQI) display
- No pollen count or allergy tracking
- No social features (sharing forecasts, comparing with friends)
- No voice control or Alexa integration
- No augmented reality (AR) weather view
- No detailed climate data or historical weather analysis

## Technical Considerations

- **Frontend:** Next.js 14+ with TypeScript, Tailwind CSS for styling
- **Backend:** Node.js with Express, weather provider SDKs
- **Database:** PostgreSQL with Prisma ORM
- **Map:** Leaflet (open-source) or Mapbox GL (premium, better styling)
- **Caching:** Redis for API response caching
- **Auth:** JWT with refresh tokens
- **Weather Providers:**
  - Open-Meteo (free, no key, excellent accuracy)
  - OpenWeatherMap (backup, requires key)
  - WeatherAPI (tertiary, detailed data)
- **Hosting:** Vercel (Next.js), Railway or Render (Node.js backend)
- **Rate limiting:** Implement per-user API call limits to manage costs

---

## Priority & Sequencing

**Phase 1 (MVP):** US-001, US-004, US-007, US-008 → Minimum viable weather app
**Phase 2 (Core):** US-005, US-006, US-002, US-003, US-009, US-010 → Full feature set
**Phase 3 (Polish):** US-011, US-012, US-013, US-014, US-015 → Refinement & optimization
