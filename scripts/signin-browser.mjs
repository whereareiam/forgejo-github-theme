import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const browser = process.env.CHROMIUM || "chromium";
const baseCss = process.env.FORGEJO_CSS;
if (!baseCss) throw new Error("Set FORGEJO_CSS to the index.css from Forgejo 17.0.1");

const theme = readFileSync(resolve("dist/theme-github-dark.css"), "utf8");
const forgejo = readFileSync(resolve(baseCss), "utf8");
const font = spawnSync("fc-match", ["-f", "%{family}", "DejaVu Sans"], { encoding: "utf8" });
if (font.status !== 0 || !font.stdout.includes("DejaVu Sans")) throw new Error("DejaVu Sans is required for this test");
const formCss = readFileSync(resolve("components/common/form/form.css"), "utf8");
const template = readFileSync(resolve("templates/user/auth/signin_inner.tmpl"), "utf8");
const markup = template.match(/<div class="inline field signin-remember">[\s\S]*?<\/div>/)?.[0];
if (!markup) throw new Error("Remember-device markup was not found in the sign-in template");

const cases = [
  { name: "Russian desktop", text: "Запомнить это устройство", width: 1440, form: 352, lines: 1 },
  { name: "Russian phone", text: "Запомнить это устройство", width: 320, form: 288, lines: 1 },
  {
    name: "Long translation desktop",
    text: "Remember this device for future sign-ins on this computer",
    width: 1440,
    form: 352,
    lines: 2,
    multiline: true,
  },
  {
    name: "Long translation phone",
    text: "Remember this device for future sign-ins on this computer",
    width: 320,
    form: 200,
    lines: 2,
    multiline: true,
  },
];

const directory = mkdtempSync(join(tmpdir(), "signin-browser-"));
let failures = 0;
try {
  for (const test of cases) {
    const remember = markup.replace('{{ctx.Locale.Tr "auth.remember_me"}}', test.text);
    const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>${forgejo}</style><style>${theme}</style><style>${formCss}</style>
      <style>html,body{margin:0} .user.signin form.test-form{width:${test.form}px!important;max-width:100%} .signin-remember label{font-family:"DejaVu Sans",sans-serif!important}</style></head>
      <body><div class="page-content user signin"><div class="ui attached segment"><form class="ui form test-form">${remember}<div class="inline field"><label id="other">Other label</label></div></form></div></div></body></html>`;
    const wrapper = `<!doctype html><meta charset="utf-8"><iframe id="frame" style="width:${test.width}px;height:600px;border:0"></iframe>
      <script>
        const frame = document.querySelector('#frame');
        frame.onload = () => {
          const doc = frame.contentDocument;
          const label = doc.querySelector('.signin-remember label');
          const input = label.querySelector('input');
          const text = label.lastChild;
          const range = doc.createRange();
          range.selectNodeContents(text);
          const rects = [...range.getClientRects()];
          const box = label.getBoundingClientRect();
          const field = label.parentElement.getBoundingClientRect();
          const other = doc.querySelector('#other').getBoundingClientRect();
          label.click();
          const result = { viewport: frame.contentWindow.innerWidth, lines: rects.length, checked: input.checked, labelWidth: box.width, fieldWidth: field.width, otherWidth: other.width,
            right: Math.max(...rects.map(rect => rect.right), box.right), fieldRight: field.right, text: text.textContent.trim() };
          document.body.dataset.result = JSON.stringify(result);
        };
        frame.srcdoc = ${JSON.stringify(html)};
      </script>`;
    const file = join(directory, "fixture.html");
    writeFileSync(file, wrapper);
    const result = spawnSync(
      browser,
      [
        "--headless",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        `--user-data-dir=${directory}/profile`,
        `--window-size=${Math.max(500, test.width)},800`,
        "--virtual-time-budget=5000",
        "--dump-dom",
        `file://${file}`,
      ],
      { encoding: "utf8", maxBuffer: 5_000_000 }
    );
    if (result.status !== 0) throw new Error(`Chromium failed: ${result.stderr}`);
    const encoded = result.stdout.match(/data-result="([^"]+)"/)?.[1];
    if (!encoded) throw new Error("Chromium did not report layout results");
    const actual = JSON.parse(encoded.replaceAll("&quot;", '"').replaceAll("&amp;", "&"));
    const pass =
      actual.viewport === test.width &&
      (test.multiline ? actual.lines >= test.lines : actual.lines === test.lines) &&
      actual.checked &&
      actual.text === test.text &&
      actual.right <= actual.fieldRight + 1 &&
      actual.otherWidth === (test.width < 768 ? test.form : 200);
    console.log(`${pass ? "PASS" : "FAIL"} ${test.name}: ${JSON.stringify(actual)}`);
    if (!pass) failures++;
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
if (failures) process.exitCode = 1;
