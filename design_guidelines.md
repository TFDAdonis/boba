# Khisba GIS - Design Guidelines

## Design Approach
**Selected Approach:** Reference-Based (GIS/Mapping Applications)
Drawing inspiration from industry leaders like Google Earth, ArcGIS Online, and Mapbox Studio, with a focus on professional GIS workflows and drone media management.

**Key Design Principles:**
- Data-first visualization with clean, uncluttered interface
- Professional tool aesthetic that builds trust with GIS users
- Mobile-responsive design for field work compatibility
- Clear visual hierarchy for map data and media content

## Core Design Elements

### Color Palette
**Primary Colors:**
- Primary: 210 85% 25% (Deep professional blue)
- Secondary: 210 15% 95% (Light neutral gray)

**Dark Mode:**
- Background: 220 15% 8% (Dark charcoal)
- Surface: 220 10% 12% (Elevated dark surface)
- Text: 0 0% 95% (Near white)

**Accent Colors:**
- Success/Active: 142 76% 36% (Forest green for active markers)
- Warning: 38 92% 50% (Amber for alerts)
- Error: 0 72% 51% (Red for errors)

### Typography
**Font Stack:** Inter (Google Fonts)
- Headers: 600-700 weight, larger scales for hierarchy
- Body: 400-500 weight, optimized for readability
- Labels/Captions: 400 weight, smaller sizes for metadata

### Layout System
**Spacing:** Tailwind units of 1, 2, 4, 6, 8, 12, 16
- Tight spacing (1-2) for form elements and buttons
- Medium spacing (4-6) for component padding
- Large spacing (8-16) for section separation

### Component Library

**Navigation:**
- Top navigation bar with logo, project selector, and user controls
- Minimal design to maximize map viewport
- Collapsible sidebar for tools and layers panel

**Map Interface:**
- Full-viewport map using Leaflet with custom marker styling
- Floating action buttons for zoom controls and layers
- Coordinate display in bottom corner
- Custom drone media markers with thumbnail previews

**Forms & Inputs:**
- Clean, minimal form styling with proper focus states
- File upload dropzone with drag-and-drop functionality
- Coordinate input fields with validation
- Project selection dropdown with search

**Data Display:**
- Media popup cards with image/video preview
- Metadata display panels with clean typography
- Project organization with card-based layouts
- Responsive grid systems for media galleries

**Overlays:**
- Modal dialogs for media upload and editing
- Toast notifications for system feedback
- Loading states with subtle animations
- Context menus for marker interactions

## Images
No large hero images needed - this is a utility-focused GIS application where the interactive map serves as the primary visual element. The interface should be clean and minimal to keep focus on geographic data and drone media content.

**Media Integration:**
- Drone image thumbnails as map markers
- Video preview capabilities within popup overlays
- Image gallery views within project organization panels

## Accessibility & Usability
- High contrast mode support for outdoor field use
- Keyboard navigation for all interactive elements
- Screen reader compatibility for form inputs and navigation
- Touch-friendly controls for mobile/tablet usage
- Consistent dark mode implementation across all components

This design framework emphasizes professional utility while maintaining visual appeal appropriate for GIS professionals and drone operators working with geographic data.