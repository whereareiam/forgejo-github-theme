---
version: 1.2.0
---

# Forgejo GitHub Theme 1.2.0 - Profile, settings and faster pages

A person's profile and personal settings were compared with GitHub page by page: the profile's tabs, search and package
list, and the settings' centred column, header, keys and GitHub's Edit menu on the profile picture, which also fixes
uploads Forgejo ignored. A large pull request now loads its next files while you scroll, and pages open as fast as
Forgejo's own again: the page transitions of 1.1.0 held every navigation for about a third of a second and are gone.

# Compatibility

This release targets Forgejo `17`. It was tested against Forgejo `17.0.0`, including the bundled template overrides.

Install the stylesheets and templates together, as with 1.1.0. Pages no longer fade between each other; content that
loads after the page still fades in.
