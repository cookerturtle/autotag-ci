# AutoTag-CI

> AutoTag-CI is a tiny CLI that *automatically* injects tags of your choice into every HTML file produced by a build (React-static today, many other frameworks tomorrow).
>
> One line in your CI – no SDK, no Docker image, no code review pings.
> 

The project is intentionally small at the moment, and aims to be an open-source project maintained by a community of framework-specific developers. To learn more about how you can contribute, please read our [contribution guide](CONTRIBUTING.md).

To summarize, here are the main open tasks:
- Create or improve a `plugin-<framework>` package: implement `detect()` and `inject()`, add an example app in `examples/<framework>/`, and update the matching guide in `docs/guides/`.
- Add vitest unit tests, expand fixture HTML/CSS/JS, and improve the CI matrix to catch cross-platform edge cases (Windows paths, symlinks, etc.).
- Polish existing guides, write new ones, add screenshots or architecture diagrams, and keep `docs/roadmap.md` & `docs/adding-a-plugin.md` current.
- Optimize GitHub Actions workflow, add security/static-analysis steps, or design the future GitHub Action / GitLab template wrapper mentioned in the roadmap.
- Profile `packages/core`, propose micro-optimizations, improve error messages, or suggest CLI UX enhancements (flags, dry-run output, etc.).

Here are some planned/potential features. Aside from community feedback, these are entirely dependent on my own desire for these features in my development:

- **Removal** of tags added by AutoTag-CI.

I would consider this about as close to mission critical as a feature can get, so I hope to add this either myself or through community help ASAP.

