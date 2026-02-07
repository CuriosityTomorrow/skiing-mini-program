# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ski Resort Assistant (滑雪场助手) helps users find and compare ski resorts. The project has two implementations:

1. **WeChat Mini Program** (`/pages/`) - Production WeChat app with Amap API integration
2. **DDD Demo** (`demo.html`) - Browser-based reference implementation using Domain-Driven Design

**Key Features:**
- Search ski resorts by city/province/name with real-time Amap API data
- Multi-keyword intelligent search (10 keywords in parallel)
- Smart ski resort detection with confidence scoring
- Coordinate-based deduplication (<100m threshold)
- Distance calculation and relevance-based sorting
- Indoor/outdoor classification
- Community notes feature (experience sharing + ski partner matching)
- Resort details with transportation options
- User ski profile management

## Development Setup

### Running the Browser Demo

```bash
# Start local server
python3 -m http.server 8080

# Open in browser
open http://localhost:8080/demo.html
```

### Running the WeChat Mini Program

```bash
# Open WeChat Developer Tools and import the project
# Project directory: /Users/samdediannao/skiing

# CRITICAL: After importing, go to:
# 详情 → 本地设置 → 勾选 ✅ "不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书"
```

### Configuration

**Amap API Configuration:**
- **API Key**: `41f98310392808752b5e9ea1e6bc4776` (already configured)
- **Platform**: Must use "Web服务" (Web Service) type key, NOT Android/iOS SDK key
- **POI Type Code**: `080107` (ski resort classification)
- **Free Quota**: 300,000 requests/day
- **Current Mode**: Real API enabled (`devMode: false` in `config/amap.js`)

**Key Files:**
- `config/amap.js` - Mini Program API configuration
- `demo.html` - Browser demo (API key embedded in AmapRepository class)

## Architecture

### Page Structure (Mini Program)

**Tab Navigation** (bottom):
- `pages/index` - 发现 (Search/Find ski resorts)
- `pages/community` - 笔记 (Community notes, experience sharing, partner matching)
- `pages/profile` - 我的 (User profile)

**Other Pages**:
- `pages/resort` - Ski resort detail page
- `pages/compare` - Side-by-side resort comparison
- `pages/note-detail` - Note detail page
- `pages/note-publish` - Publish new note

### Data Flow

```
User Input (City/Location)
    ↓
AmapService (utils/amap-service.js)
    ├─ Multi-keyword search (10 keywords in parallel)
    └─ Geocode: city → coordinates
    ↓
SkiResortDetector (utils/ski-resort-detector.js)
    ├─ Confidence-based name filtering
    └─ Coordinate deduplication (<100m threshold)
    ↓
SkiResortManager (utils/ski-resort-manager.js)
    ├─ Distance calculation (Haversine fallback)
    ├─ Transportation estimation
    └─ Data formatting
    ↓
Page renders sorted results
```

### Browser Demo (demo.html) - DDD Architecture

The demo implements a clean 4-layer Domain-Driven Design architecture:

```
Presentation Layer (UI Rendering)
    ↓
Application Layer (SkiResortService)
    ↓
Domain Layer (SkiResort, Value Objects, Services)
    ↓
Infrastructure Layer (AmapRepository, LocalRepository)
```

**Domain Layer** (Entities and Value Objects):
- `SkiResort` - Aggregate root with business logic (isIndoor(), isOutdoor(), getDistanceText())
- `Location` - Value object: country, province, city, address, coordinates
- `Price` - Value object: min, max, unit with displayText getter
- `Facilities` - Value object: trails (distribution), elevation, lifts
- `SocialInfo` - Value object: popularityScore, favoriteCount, shareCount, rating
- `SearchService` - Logic-cohesive relevance calculation (60% distance + 30% name + 10% popularity)
- `RankingService` - Logic-coherent popularity scoring (searchVolume + shares + rating)

**Application Layer:**
- `SkiResortService` - Orchestrates repositories, applies filters, manages state

**Infrastructure Layer:**
- `AmapRepository` - Amap API integration (POI type 080107, geocoding, POI transformation)
- `LocalRepository` - 50 preset popular ski resorts with complete data

**Presentation Layer:**
- Vanilla JS rendering with card-based UI
- Filter by type (all/indoor/outdoor)
- Detail modal with full resort information
- Favorites saved to localStorage

### WeChat Mini Program - Core Utilities

`utils/amap-service.js`:
- `searchPoi()` - Multi-keyword POI search (10 keywords parallel)
- `searchAround()` - Nearby search by coordinates
- `geocode()` / `regeocode()` - Coordinate conversion
- `calculateDistance()` - Distance between two points
- `getDrivingRoute()` - Route planning
- `calculateBatchDistance()` - Batch distance calculation
- Built-in caching with 30-minute timeout

`utils/ski-resort-detector.js`:
- `isSkiResortByName()` - Confidence scoring (0.95 direct match, 0.85 brand names)
- `isSameSkiResort()` - Coordinate-based duplicate detection (<100m)
- `deduplicateSkiResorts()` - Remove duplicate POIs
- `filterSkiResorts()` - Main filtering function with deduplication
- `getSearchKeywords()` - Returns 10 search keywords
- Keyword libraries: `SKI_RESORT_KEYWORDS`, `EXCLUDE_KEYWORDS`

`utils/ski-resort-manager.js`:
- `searchFromCity()` - City-based search pipeline
- `searchNearbySkiResorts()` - Location-based search
- `searchSkiResortsByCity()` - Search by city with geocoding
- `formatPoiToResort()` - POI to resort object transformation
- `getTransportation()` - Multi-modal transport options (drive/train/flight)
- `estimateTransportation()` - Fallback transportation estimation

## Key Implementation Details

### Multi-Keyword Search (Mini Program)

Single keyword misses many resorts. Solution: 10 parallel searches:

```javascript
['滑雪场', '滑雪', '冰雪世界', '冰雪', '热雪',
 '乔波', '融雪', '室内滑雪', '滑雪度假村', '滑雪中心']
```

Results deduplicated by POI ID and filtered by confidence score.

### POI Type Classification (Demo)

Uses Amap's official POI classification system:
- **Code**: `080107` (ski resort category)
- **Indoor Detection**: Name-based keywords (融创, 乔波, 冰雪世界, 热雪奇迹, 雪乐山)
- **Type Determination**: Combined POI type + name analysis

### Relevance Scoring (Demo)

Multi-factor weighted scoring:
- **Distance (60%)**: Linear decay over 500km
- **Name Match (30%)**: Binary match on resort name
- **Popularity (10%)**: Normalized popularity score

Formula: `Σ(score × weight) / Σ(weight)`

### Popularity Scoring (Demo)

```javascript
searchVolume: favoriteCount × 1.0
shareCount: shareCount × 0.5
rating: rating × 10
total: sum of all factors
```

### Coordinate Deduplication

POIs within 100 meters considered same location. Handles:
- Multiple POI names for same resort
- Different spellings/translations
- Entrance vs. main location markers

### Distance Calculation

**Primary**: Amap Distance API (driving distance)
**Fallback**: Haversine formula (straight-line distance):

```javascript
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) × Math.PI / 180;
  const dLon = (lon2 - lon1) × Math.PI / 180;
  const a = sin²(dLat/2) + cos(lat1) × cos(lat2) × sin²(dLon/2);
  const c = 2 × atan2(√a, √(1-a));
  return R × c; // Distance in km
}
```

## Common Issues and Solutions

### Issue: Tab icons missing in WeChat Developer Tools

**Cause**: `app.json` tabBar config missing `iconPath` and `selectedIconPath`

**Solution**: Add icon files to `images/` directory and update app.json:
```json
"list": [
  {
    "pagePath": "pages/index/index",
    "text": "发现",
    "iconPath": "images/discover.png",
    "selectedIconPath": "images/discover-active.png"
  }
]
```

### Issue: All distances show 52km

**Cause**: Missing coordinates, using default values

**Solution**: Ensure POI `location` field is parsed correctly (lon,lat format). Check coordinate parsing in `formatPoiToResort()`.

### Issue: API returns `USERKEY_PLAT_NOMATCH`

**Cause**: Wrong API key type (Android/iOS SDK instead of Web Service)

**Solution**: Re-create key in Amap console, select "Web服务" platform

### Issue: Can't find specific resorts (e.g., 华发·冰工厂)

**Cause**: Single keyword search too narrow

**Solution**: Multi-keyword search already implemented in `utils/amap-service.js`. Add missing keywords to `getSearchKeywords()` in `utils/ski-resort-detector.js`.

### Issue: Duplicate resorts in results

**Cause**: Same location, multiple POI entries

**Solution**: Coordinate deduplication already implemented (100m threshold in `isSameSkiResort()`). Adjust threshold if needed.

### Issue: Indoor/outdoor classification inaccurate

**Cause**: Name-based detection insufficient

**Solution**: Add brand patterns to `SKI_RESORT_KEYWORDS` in `utils/ski-resort-detector.js`

## Data Structures

### SkiResort Entity (Demo)

```javascript
{
  id: string,                    // Unique ID
  name: string,                  // Chinese name
  nameEn: string,                // English name
  location: Location,            // Value object
  type: 'indoor' | 'outdoor',
  ticketPrice: Price,            // Value object
  facilities: Facilities,        // Value object
  social: SocialInfo,            // Value object
  distance: number | null,       // km, calculated dynamically
  source: 'preset' | 'amap',     // Data source
  description: string,
  images: string[],              // Image URLs
  season: string,                // e.g., '11月-3月'
  openingHours: string,

  // Methods
  isIndoor(): boolean,
  isOutdoor(): boolean,
  getDistanceText(): string      // '150km' or '2.3km'
}
```

### Resort Object (Mini Program)

```javascript
{
  id: 'B000A7BD6J',
  name: '万龙滑雪场',
  city: '张家口市',
  province: '河北省',
  country: '中国',
  type: 'outdoor',
  address: '崇礼区',
  longitude: 115.7697,
  latitude: 40.9515,
  distance: 150000,              // meters
  telephone: '0313-4618888',
  facilities: ['缆车', '餐厅'],
  transportation: [{ type, duration, distance, detail }],
  price: 680,
  priceUnit: '天',
  season: '11月-3月',
  elevation: 1200,
  trails: 32,
  rating: 4.8,
  reviewCount: 1250,
  images: ['https://...'],
  poi: {...}                    // Original Amap data
}
```

## Data Entities

### Note Entity (Community Notes)

Located in `data/resorts.js` as `notesData`. Used for community features.

```javascript
{
  id: string,                    // Note ID (1001-1008)
  type: 'experience' | 'partner', // Experience sharing or partner matching
  title: string,
  content: string,
  coverImage: string,
  images: string[],
  author: {
    id: string,
    nickname: string,
    avatar: string,
    displayTags: string[]        // User-defined tags
  },
  resortId?: string,             // Optional linked resort
  resortName?: string,
  partnerInfo?: {                // For type='partner' only
    plannedDate: Date,
    maxJoiners: number,
    currentJoiners: number,
    tags: string[],
    status: 'open' | 'full'
  },
  likes: number,
  comments: number,
  isLiked: boolean,
  isCollected: boolean,
  tags: string[],
  createTime: Date,
  location?: string
}
```

## Global State (app.js - Mini Program)

- `userInfo` - User profile data
- `userLocation` - Current GPS coordinates
- `selectedResorts` - Resorts for comparison (shared across pages)
- `skillLevels` - Array of skill level labels (小白 → 职业选手)
- `skiTypes` - Ski type options (单板/双板/都玩)

## Testing

### Browser Demo Testing

```bash
# Start local server
python3 -m http.server 8080

# Open in browser
open http://localhost:8080/demo.html              # DDD Demo
open http://localhost:8080/preview-community.html # Community preview
```

**Test cities:**
- 北京 (multiple outdoor resorts)
- 上海 (indoor: L+SNOW)
- 深圳 (indoor: 华发/热雪奇迹)
- 张家口 (outdoor: 万龙, 太舞, 云顶)
- 哈尔滨 (major outdoor resorts)

**Verify:**
- Default view shows 50 popular resorts sorted by popularity
- City search calculates and sorts by distance
- Indoor/outdoor filters work correctly
- Detail modal shows complete information
- Favorites persist across page reloads

### Mini Program Testing

1. Open WeChat Developer Tools
2. Import project: `/Users/samdediannao/skiing`
3. **CRITICAL**: 详情 → 本地设置 → ✅ "不校验合法域名"
4. Test cities: 北京, 上海, 深圳, 张家口, 哈尔滨, 成都, 武汉
5. Verify: search relevance, no duplicates, reasonable distances, indoor/outdoor accuracy

## Development Workflow

### Adding New Search Keywords

Edit `utils/ski-resort-detector.js`:

```javascript
function getSearchKeywords(city) {
  return [
    '滑雪场', '滑雪', '冰雪世界', '冰雪', '热雪',
    '乔波', '融雪', '室内滑雪', '滑雪度假村', '滑雪中心',
    'NEW_KEYWORD'  // Add here
  ];
}
```

### Modifying Confidence Thresholds

Edit `utils/amap-service.js` in `searchPoi()`:

```javascript
const filtered = detector.filterSkiResorts(poisArray, {
  minConfidence: 0.5,  // Adjust this (0.0-1.0)
  removeDuplicates: true,
  verbose: true
});
```

### Adjusting Deduplication Threshold

Edit `utils/ski-resort-detector.js` in `isSameSkiResort()`:

```javascript
// Current: 100 meters
if (distance < 100) {  // Adjust this value
  return true;
}
```

### Modifying Relevance Algorithm (Demo)

Edit `SearchService.calculateRelevance()` in demo.html:

```javascript
// Current: distance 60% + name 30% + popularity 10%
factors.push({ name: 'distance', score: distanceScore, weight: 0.6 });
factors.push({ name: 'name', score: nameScore, weight: 0.3 });
factors.push({ name: 'popularity', score: popularityScore, weight: 0.1 });
```

## File Summary

**Demo Implementation:**
- `demo.html` - Complete DDD reference implementation with search, filters, and favorites

**Mini Program - Core:**
- `app.js` / `app.json` / `app.wxss` - Application entry and global styles
- `config/amap.js` - Amap API configuration (key, endpoints, cache settings)
- `data/resorts.js` - Mock resort data + notes data (community notes)

**Mini Program - Utils:**
- `utils/amap-service.js` - Amap API wrapper with caching (413 lines)
- `utils/ski-resort-detector.js` - Smart POI filtering and deduplication (296 lines)
- `utils/ski-resort-manager.js` - Resort data management and formatting (423 lines)
- `utils/util.js` - Utility functions

**Mini Program - Pages:**
- `pages/index/` - Search/find ski resorts (city input, location input)
- `pages/community/` - Community notes waterfall (experience/partner tabs)
- `pages/note-detail/` - Note detail with likes/comments/join
- `pages/note-publish/` - Publish new note (image upload, form)
- `pages/resort/` - Resort detail with related notes
- `pages/compare/` - Side-by-side resort comparison
- `pages/profile/` - User ski profile
- `pages/explore/` - Explore page (regional browse, partners)

**Documentation:**
- `START_HERE.md` - Navigation hub
- `README.md` - Project overview
- `PROJECT_KNOWLEDGE.md` - Technical knowledge base
- `API_KEY_GUIDE.md` - Amap key application guide
- `QUICKSTART_REAL_DATA.md` - Real data integration guide
- `SESSION_SUMMARY_2025-02-04.md` - API integration session
- `SESSION_SUMMARY_2025-02-07.md` - Community feature session

**Preview Files:**
- `preview-community.html` - Browser preview of community page design

---

## Recent Development (2025-02-07)

### Community Notes Feature Added

New Note entity with experience sharing and partner matching:
- Waterfall layout in `pages/community/community`
- Note detail page in `pages/note-detail/`
- Publish page in `pages/note-publish/`
- Related notes section added to resort details

**Design System:**
- White snow mountain theme
- Cat skiing elements (🐱❄️, 🐱👥, 🐾)
- Color palette: white/ice blue/warm orange

**Known Issues:**
- Tab icons missing in app.json (need iconPath)
- Page styling may need refinement

See `SESSION_SUMMARY_2025-02-07.md` for complete details.
