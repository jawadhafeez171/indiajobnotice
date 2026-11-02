# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Government-job aspirants on phones (primary).** Students and job seekers, mostly on mobile and often on slow or limited data. They come back several times a week to find new notifications, check last dates and eligibility, and reach the official link to apply; later they return for admit cards, exam dates, answer keys and results of the recruitments they applied to.
- **Working professionals.** Already employed, watching for specific exams (bank, SSC, state public service commissions, police boards) and checking dates and eligibility before deciding to apply.

## Product Purpose

India Job Notice (indiajobnotice.com) lists central and state government job notifications in one place: new recruitments, last dates, vacancies, eligibility, fees, admit cards, exam dates, answer keys and results. Success is a visitor finding a relevant, still-open job, understanding whether they are eligible, and reaching the official notification or application page without being misled.

## Positioning

Official and verified. Every notice comes from the recruiting body's official website, found and read by the site's own agent (not copied from other job sites), checked twice a day. Facts shown (dates, posts, age, fee, pay) are taken from the official notification, with the link to the source; nothing is made up, and when the notification does not state something the site says "see notification" instead of guessing.

## Operating Context

- A separate agent repo watches ~670 official sources (central bodies, banks, railways, PSCs, staff selection boards, police boards, courts, state utilities) twice a day, reads each new notification PDF, checks the extracted facts against the PDF, and publishes to the `notices` table the site reads. Flagged notices wait for approval before they appear.
- Coverage is thorough for Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, Telangana, Puducherry, Maharashtra, Bihar, West Bengal, the north-eastern states and Sikkim, and lighter for other states; all central notifications.
- Recruitments are followed through their stages: notification, admit card, exam dates, answer key, result ("Exams in progress").
- Visitors also follow updates on the Telegram channel and WhatsApp channel.
- Applications are always made on the official website; the site never takes applications.

## Capabilities and Constraints

- Next.js on Vercel (Hobby plan): deployment storage is limited, so per-job pages are built on first visit and cached; only `main` deploys.
- Data refreshes hourly or when the agent publishes; the site is read-only for visitors (no accounts; saved jobs live in the browser).
- Light and dark mode follow the visitor's device setting.
- Many official titles are in Hindi, Kannada, Tamil, Malayalam, Telugu and other languages; the site shows an English summary next to them.
- Undecided: how the site is funded (ad slots exist in the layout, but whether AdSense runs is not settled); regional-language pages (planned, not started).

## Brand Commitments

- Name: **India Job Notice** (domain indiajobnotice.com); tagline "Verified government job alerts".
- Voice: plain English, factual and calm; no hype, no invented urgency, no claims the data does not support (no "all jobs", no "every vacancy").
- Existing logo (INDIA JOB NOTICE wordmark with a saffron–white–green strip) in `public/`.

## Evidence on Hand

- Real, live data: published notices, stage documents and exam dates from the database (counts change daily; read them, do not hard-code them).
- No testimonials, user counts, press coverage, partnerships or success stories exist. Do not invent any.

## Product Principles

1. Trust over everything: official source, facts from the notice, a link to check it.
2. The deadline comes first: what matters is whether a job is open, until when, and who can apply.
3. Fast on a cheap phone and a slow connection.
4. Say what we know, and say plainly when the notice does not state something.
5. Fewer, clearer choices beat more widgets.

## Accessibility & Inclusion

- Mobile-first: comfortable tap targets, readable text sizes, no horizontal scrolling at 360 px.
- Readable contrast in both light and dark mode.
- English summaries for non-English official titles; regional-language support is planned.
