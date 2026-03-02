# FitTrack — Fitness Analytics & Workout Insights Platform

**Team Members:**  
- Axel Tang
- Tharun Seshachalam

---

# 1. Motivation

## 1.1 Problem Statement

A lot of people log their workouts, but very few actually analyze them.

Most students either:
- Write workouts in Notes apps  
- Use Google Sheets  
- Or use basic gym tracking apps  

These tools store numbers (sets, reps, weight), but they don’t really help answer questions like:

- Am I actually getting stronger?
- Which muscle groups am I undertraining?
- Has my weekly training volume increased?
- When did my progress stall?

Many commercial apps lock detailed analytics behind paid plans. Spreadsheets can compute metrics, but they require manual formulas and constant maintenance.

We think there’s room for a focused, analytics-first fitness platform that emphasizes structured data and meaningful insights instead of social features.

---

## 1.2 Why This Project Is Worth Pursuing

Fitness is naturally data-driven. Strength training especially produces structured, repeatable data that can be analyzed.

However, most users don’t interpret their data properly. They look at single workouts instead of trends.

By building FitTrack, we aim to:

- Visualize long-term progression  
- Compute metrics (volume, estimated 1RM -- One rep Max)  
- Show muscle group distribution  
- Highlight inconsistencies over time  

This project is technically interesting because it combines:

- Relational database design  
- Aggregation queries  
- Authentication  
- File parsing and validation  
- Shared frontend state  

It allows us to demonstrate real full-stack reasoning rather than just CRUD operations.

---

## 1.3 Target Users

Primary users:
- University students who go to the gym
- People following structured programs (push/pull/legs, upper/lower splits)

Secondary users:
- Intermediate lifters transitioning from spreadsheets
- Users who care about performance tracking

The system is designed for individual users, not social networking.

---

## 1.4 Existing Solutions

Most existing fitness apps:

- Focus on logging, not analysis
- Restrict analytics features behind subscriptions
- Don’t give full data control
- Provide limited export functionality

Spreadsheets:
- Flexible but manual
- Easy to break formulas
- No structured validation

FitTrack focuses on structured relational storage and backend-driven analytics.

---

# 2. Objectives and Key Features

## 2.1 Project Objectives

FitTrack aims to:

1. Allow users to log structured workout sessions.
2. Store workout data in a normalized PostgreSQL database.
3. Support CSV upload and server-side parsing.
4. Compute meaningful analytics server-side.
5. Secure user data with authentication and authorization.

We intentionally avoid building a generic fitness app and instead focus on analytics depth.

---

## 2.2 Architecture Approach

We will use:

- **React + TypeScript (Next.js App Router)**
- **PostgreSQL as the database**
- **Prisma ORM as the database client**
- **TypeScript for backend/server logic**

---

# 2.3 Core Technical Requirements

## Frontend (React + TypeScript)

Technologies:
- React (via Next.js)
- TypeScript
- Tailwind CSS

Planned pages:
- Landing page
- Dashboard
- Log workout page
- Workout history page
- CSV upload page
- Profile page

Charts will visualize: (Planned)
- Weekly volume trends
- Estimated 1RM progression
- Exercise frequency
- Muscle group distribution

State Management: (Changable later)
- Redux Toolkit (RTK) to manage complex application states that exceed the scope of local component state

We will use Redux Toolkit for:
- Authentication state
- Dashboard filters (date range, exercise filter)
- Derived analytics state
- Synchronization across multiple dashboard components

Local component state will handle form input only.

---

## Backend (TypeScript)

Backend responsibilities:

- Workout creation and mutation
- CSV parsing and validation
- Aggregation queries
- Authentication and others

Validation:
- Schemas for all user input
- Validation for CSV rows

Example analytics (server-side):
- Total weekly volume:
  volume = Sum of (reps × weight)

- Muscle group distribution percentage:
  groupVolume / totalVolume

Analytics will be computed server-side to avoid client-side manipulation.

---

## Database Design (PostgreSQL + Prisma)

### Core Tables

**User**
- id (PK)
- email (unique)
- passwordHash
- createdAt

**Exercise**
- id (PK)
- name
- muscleGroup
- createdAt

**WorkoutSession**
- id (PK)
- userId (FK -> User)
- date
- notes

**WorkoutSet**
- id (PK)
- sessionId (FK -> WorkoutSession)
- exerciseId (FK -> Exercise)
- reps
- weight
- duration
- setNumber

**CSVUpload**
- id (PK)
- userId (FK -> User)
- fileKey
- uploadedAt

Relationships:
- One user -> many sessions
- One session -> many sets
- One exercise -> many sets

We normalize sessions and sets to avoid duplication and to support flexible queries.

---

## Cloud Storage

We will use AWS S3 or DigitalOcean Spaces or Azure ADLS to store:

- Uploaded CSV files
- Exported analytics reports

Upload pipeline:

1. User uploads file
2. File stored in cloud bucket
3. Server validates and parses
4. Structured data inserted via Prisma

Malformed rows will be rejected and reported back to the user.

---

# 2.4 Advanced Features

## Advanced Feature 1: Authentication & Authorization

We will implement:

- Registration and login
- Session-based authentication
- Protected routes
- User-level data isolation

Every query will be scoped by userId to prevent cross-access.

Satisfies the authentication and authorization requirement.

---

## Advanced Feature 2: File Handling & Processing (CSV Parsing)

- Parse CSV rows server-side
- Validate schema
- Handle invalid entries
- Insert normalized records
- Compute derived analytics

This involves:
- Business logic
- Validation
- Database batch operations

---

# 2.5 Scope and Feasibility

Core features:
- Workout logging
- Analytics dashboard
- CSV processing
- Authentication

Not included:
- Social feed
- Messaging
- Payment systems
- Real-time multi-user collaboration

We believe this scope is realistic while still technically challenging.

---

# 3. Tentative Plan

## Responsibilities (Interchangable)

Tharun — Backend & Data
- Prisma schema
- Aggregation queries
- CSV processing
- Cloud storage
- Authentication logic

Axel — Frontend & State
- React pages
- Dashboard charts
- Tailwind styling
- Redux architecture
- Responsive design

Both:
- PR reviews
- Testing
- Debugging
- Documentation

---

## Timeline

Week 1:
- Setup project
- Configure PostgreSQL + Prisma
- Implement authentication

Week 2:
- Workout logging
- Database integration
- Basic dashboard

Week 3:
- CSV upload + parsing
- Cloud storage integration

Week 4:
- Aggregation queries
- Advanced analytics
- Redux state synchronization

Final Week:
- Testing
- Edge case handling
- Documentation
- Presentation preparation

---

# 4. Initial Independent Reasoning (Before Using AI)

This project should have:

- Uses relational data meaningfully
- Requires non-trivial backend logic
- Demonstrates aggregation queries
- Includes at least one advanced feature beyond CRUD

We chose fitness analytics because:

- It naturally requires aggregation.
- It benefits from structured schemas.
- It allows meaningful dashboard visualization.

We initially decided on a Next.js Full-Stack (Option A) architecture. We chose this over a separate Express backend because the 2-month timeline. By using Next.js, we can leverage TypeScript end-to-end, sharing interfaces between our Server Actions and React components, which reduces the bugs typically found in separate frontend-backend repos.

We considered real-time collaboration but decided it would add unnecessary complexity for a 2-person team.

We chose PostgreSQL over SQLite because we expect multiple aggregation queries and want stronger relational support.

Wwo primary technical hurdles:

- Server-Side CSV Validation: Handling malformed user uploads without crashing the server or corrupting the database. We need to build a robust validation layer to catch errors before they hit Prisma.

- Hydration & State Sync: Ensuring that the Redux state on the client remains in sync with Next.js Server Components, especially when a user updates a workout and expects the dashboard charts to reflect it immediately without a full page reload.

---

# 5. AI Assistance Disclosure

Without AI:
- Project idea
- Tech stack decision
- Database schema structure
- Scope planning

With AI:
- AI Assist on Debugging if needed especially for backend deployment
