---
version: 1.4.0
---

# Forgejo GitHub Theme 1.4.0 - Merge box, context switcher and a steady file tree

A pull request's merge box now matches GitHub in every state, from failing checks and conflicts to drafts, and the
navbar gains GitHub's switcher beside the owner. The code view's file tree stays in place while you browse instead of
reloading on every folder, and the templates show Forgejo's own translations where they used English.

# Compatibility

This release targets Forgejo `17`. It was tested against Forgejo `17.0.1`, including the bundled template overrides.

Install the stylesheets and templates together, as with 1.3.0. The templates now use only Forgejo's existing translation
keys, so they need no locale files of their own.

The templates follow Forgejo 17.0.1, which quotes branch names in a pull request's command line instructions so that
pasting them into a shell cannot run a command. Update Forgejo to 17.0.1 along with them.
