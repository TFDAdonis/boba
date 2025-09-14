# Khisba GIS - Drone Mapping Platform

## Overview

Khisba GIS is a professional drone mapping platform designed for GIS professionals to manage and visualize drone media with coordinate-based pinning and project organization. The application provides a Snapchat-like map interface for permanently storing and viewing drone images/videos pinned to specific coordinates, with features for project management, media upload, and professional GIS workflows.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with custom Tailwind CSS styling following shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens supporting light/dark themes
- **Map Integration**: Leaflet for interactive mapping with custom marker styling and coordinate-based media display

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Session Management**: Express sessions with PostgreSQL session store

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon (serverless PostgreSQL)
- **File Storage**: Firebase Storage for media files (images/videos)
- **Session Storage**: PostgreSQL-based session store using connect-pg-simple
- **Database Schema**: Users and media tables with geospatial coordinates (lat/lng) for mapping

### Authentication and Authorization
- **Session-based Authentication**: Express sessions with PostgreSQL persistence
- **User Management**: Username/password authentication with hashed passwords
- **Media Access Control**: User-scoped media access with userId references

### External Dependencies
- **Database Hosting**: Neon serverless PostgreSQL for scalable database hosting
- **File Storage**: Firebase Storage for reliable media file hosting and CDN delivery
- **Geolocation**: HTML5 Geolocation API for coordinate capture
- **Maps**: Leaflet with OpenStreetMap tiles for mapping functionality
- **Fonts**: Google Fonts (Inter) for consistent typography

The architecture follows a traditional full-stack pattern with clear separation between frontend React application and backend Express API, connected through RESTful endpoints and real-time state synchronization via React Query.

## External Dependencies

- **@neondatabase/serverless** - Serverless PostgreSQL connection for Neon database
- **Firebase** - Authentication, storage, and hosting services for media files
- **Leaflet** - Open-source mapping library for interactive maps
- **Drizzle ORM** - Type-safe PostgreSQL ORM with schema management
- **TanStack Query** - Server state management and caching
- **Radix UI** - Accessible UI component primitives
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Wouter** - Lightweight routing library for React
- **Google Fonts** - Web font service for Inter font family