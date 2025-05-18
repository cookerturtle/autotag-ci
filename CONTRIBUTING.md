# Contributing to **AutoTag-CI**

Thank you for considering a contribution!

As mentioned in the README, AutoTag-CI is a tiny CLI that *automatically* injects tags of your choice into every HTML file produced by a build (React-static today, many other frameworks tomorrow). One line in your CI job — no SDKs, no Docker images, no pull-request noise.

The project is intentionally small at the moment, and aims to be an open-source project maintained by a community of framework-specific developers.

## What we're building

| Area | Status | Notes | Help Wanted |
|------|--| ------ | -------------|
| Core injection engine (`packages/core`) | ✅ | MVP shipped | Performance tweaks, better error UX |
| Built-in React-static plugin (`packages/plugin-react`) | ✅ | MVP shipped | Edge-cases, Windows path quirks |
| Additional plugins (Vite, Django, Next.js, Gatsby, Rails, Angular, WordPress) | ❌ | Not started | **Highest priority** |
| GitHub Action wrapper | ❌|  Not started | Design & implementation |
| Docs & Examples | ⏳ | Skeletons exist | Flesh out guides, add sample apps |
| CI / Test Matrix | ⏳ | Basic | More fixture coverage, security scans |

## Who we're looking for

| Who | Why | How to Help |
| --- | --- | ----------- |
| Framework-specific developers who build with e.g. Vite, Next.js, Django, Rails. | Build reliable injection heuristics for output from each framework. | Create or improve a `plugin-<framework>` package: implement `detect()` and `inject()`, add an example app in `examples/<framework>/`, and update the matching guide in `docs/guides/`. |
| Testers | Every plugin must ship with 100 % unit coverage and an end-to-end fixture so we can keep shipping confidently. | Add vitest unit tests, expand fixture HTML/CSS/JS, and improve the CI matrix to catch cross-platform edge cases (Windows paths, symlinks, etc.). |
| Documentation Wizards | Clear, approachable docs help newcomers ramp up quickly and reduce maintainer load. | Polish existing guides, write new ones, add screenshots or architecture diagrams, and keep `docs/roadmap.md` & `docs/adding-a-plugin.md` current. |
| Dev-Ops / CI buffs | Faster, more reliable pipelines mean happier contributors and users. | Optimize GitHub Actions workflow, add security/static-analysis steps, or design the future GitHub Action / GitLab template wrapper mentioned in the roadmap. |
| Performance & DX tweakers | The core injection engine must stay blazing fast and easy to use — even in large monorepos. | Profile `packages/core`, propose micro-optimizations, improve error messages, or suggest CLI UX enhancements (flags, dry-run output, etc.). |


## Local setup

```bash
# 1. Fork and clone
git clone https://github.com/<your-handle>/autotag-ci.git
cd autotag-ci

# 2. Install dependencies
npm install

# 3. Run the whole suite (build + tests + lints)
npm run build && npm test && npm run lint
```

## Need help?

My name is Jayram Palamadai. You can reach me anytime at **jayrampalamadai (at) gmail (dot) com**. Please shoot me a one-liner – I'd love to know if you're planning on contributing! I've been known to sleep on occasion, so I might take a couple hours to respond. Happy to help!