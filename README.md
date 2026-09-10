# Tandem — Collaborative Trip Planner (UI/UX Prototype)

A front-end prototype for **Tandem**, a trip-planning app for small groups —
built for the "3-day Kashmir" case study brief (Landing, Create Trip,
Trip Dashboard, Explore, Itinerary Builder).

## Project structure

```
tandem-project/
├── index.html        All 12 screens (markup only)
├── styles.css     Design tokens + every component/screen style
├── script.js       Navigation, forms, save/vote state, chat, drag-and-drop,
│                        bookings, collections — every interactive element
└── README.md
```

## How to view it

No build step or server required — just open `index.html` in a browser.

## Every element 

| Screen | Reached from |
|---|---|
| **Landing** | Start screen |
| **Log in / Sign up** | "Log in" or "Start planning" on Landing |
| **Onboarding** | After signing up |
| **Create Trip wizard** | After onboarding |
| **Trip Dashboard** | After creating a trip, or after logging in |
| **Explore** | Dashboard → Explore tab |
| **Place Details** | Clicking any place card, map pin, or "View details" |
| **Itinerary Builder** | Dashboard → Itinerary tab, or "Add to Day" from Place Details |
| **Crew (chat + voting)** | Dashboard → Crew tab |
| **Bookings & Documents** | Dashboard → Bookings tab |
| **Collections** | Dashboard → Collections tab, or the Collections widget |
| **About / Privacy / Terms / Contact** | Footer links on Landing |

## Design system

| Token | Value |
|---|---|
| Primary | `#5B7CFF` Sky Indigo |
| Secondary | `#2FD6C9` Glacier Teal |
| Accent 1 | `#FF6B6B` Berry Coral |
| Accent 2 | `#FFC857` Sun Yellow |
| Ink / Slate / Cloud | `#0F172A` / `#475569` / `#F1F5F9` |
| Headings | Poppins 600–700 |
| Body / UI | Inter 400–600 |
| Radius | 14–18px cards, 999px chips |
