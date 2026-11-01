# Sign-in layout browser regression

Build the theme, then run the regression with Chromium, DejaVu Sans, and the unmodified `index.css` from a Forgejo
17.0.1 installation:

```sh
bun bundle
FORGEJO_CSS=/path/to/forgejo/assets/css/index.css node scripts/signin-browser.mjs
```

Set `CHROMIUM` to the browser executable if it is not named `chromium`. The test renders the sign-in template's
remember-device control with Forgejo's stylesheet and the built theme. It checks line wrapping and checkbox interaction
at desktop and phone widths, including a longer translation and an unrelated inline label. It does not contact a running
Forgejo or submit a form.
