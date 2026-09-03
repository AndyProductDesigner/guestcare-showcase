# GuestCare — Code Review

GuestCare is a hostel owner/manager operations web app. This public repository is a sanitized, curated review copy of the private development project.

It is intended for portfolio and technical review rather than deployment. The files here are real implementation files selected to show product structure, authentication, shared UI patterns, design tokens, routing, and an operational workflow without exposing the private development repository or environment configuration.

## Good places to start

- `src/App.tsx` — application routing and authenticated navigation
- `src/components/AppHeader/` — shared header and account/logout behaviour
- `src/components/Button/` — reusable control pattern
- `src/pages/ConfirmCheckOut/` — checkout settlement and persistence flow
- `src/lib/supabase.ts` — environment-based Supabase client
- `src/styles/tokens.css` — shared design values
- `src/styles/globals.css` — global presentation rules

## Stack

React • TypeScript • Vite • Supabase • React Router • CSS design tokens

## What is intentionally not included

- environment files and deployment secrets
- credentials or passwords
- private development history
- test proof images and personal/sample documents
- every screen and implementation file from the private repository

The live product and portfolio case study are the best places to experience the complete application. This repository exists to make the implementation approach reviewable without making the working source repository public.
