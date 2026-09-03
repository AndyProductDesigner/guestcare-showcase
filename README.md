# GuestCare — Code Review

GuestCare is a hostel owner/manager operations web app. This public repository is a sanitized, curated review copy of the private development project.

It is intended for portfolio and technical review, not as the deployment source of truth. The files here are real implementation files selected to show product logic, persistence, shared UI patterns, and the design-token system without exposing the private development repository or environment configuration.

## Good places to start

- `src/pages/ConfirmCheckOut/` — a complete checkout interaction, settlement calculation, persistence call, loading state and error handling
- `src/components/Button/` — reusable button pattern
- `src/components/IconButton/` — reusable accessible icon control
- `src/components/InputField/` — shared form-field pattern
- `src/components/PageLoader/` — consistent masked loading behaviour used during operations
- `src/components/AppHeader/` — shared header, account state and logout behaviour
- `src/lib/supabase.ts` — environment-based Supabase client
- `src/styles/tokens.css` — shared design values
- `src/styles/globals.css` — application-wide presentation rules

## Stack

React • TypeScript • Vite • Supabase • React Router • CSS design tokens

## Scope of this repository

This is a deliberate review snapshot rather than a runnable copy of the full application. Every selected workflow includes the local code dependencies needed to follow the implementation, while screens and assets that do not add review value are left out.

Intentionally excluded:

- environment files and deployment secrets
- credentials or passwords
- private development history
- test proof images and personal/sample documents
- the complete set of application screens and routes

The live product is the best place to experience GuestCare end to end. This repository exists so a reviewer can inspect how representative parts of the product were structured and implemented without making the working source repository public.
