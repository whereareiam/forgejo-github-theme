import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * The theme's own phrases: GitHub's wording where Forgejo has no translation of its own, as an optional add-on.
 *
 * Forgejo reads a custom locale file instead of its own one, never on top of it, so the theme cannot add keys to
 * Forgejo's translations without replacing them and an admin's custom ones. The phrases live in `locales/` instead,
 * one JSON file per language, and the build compiles them into the template `theme/phrase` of the add-on archive. A
 * template asks it for a phrase with a fallback, which is Forgejo's own text: the templates pack prints only the
 * fallback, and with the add-on a reader whose language has no theme phrase still gets it.
 */

/** A phrase: a plain string, or one string per plural form of the language. */
export type Phrase = string | Partial<Record<PluralForm, string>>;
export type Phrases = Record<string, Phrase>;
export type PluralForm = "zero" | "one" | "two" | "few" | "many" | "other";

/** Forgejo's plural rules (modules/translation/plural_rules.go), with the forms each rule asks for. */
type PluralRule = { forms: PluralForm[]; select: (n: number) => PluralForm; template: string };

// Each rule's template sets $form. Templates have no modulo, so the rules read n % 10 and n % 100 off the decimal
// digits as $m10 and $m100.
const pluralRules = {
  default: {
    forms: ["one", "other"],
    select: n => (n === 1 ? "one" : "other"),
    template: `{{if Eval $n "==" 1}}{{$form = "one"}}{{else}}{{$form = "other"}}{{end}}`,
  },
  bengali: {
    forms: ["one", "other"],
    select: n => (n > 1 ? "other" : "one"),
    template: `{{if Eval $n ">" 1}}{{$form = "other"}}{{else}}{{$form = "one"}}{{end}}`,
  },
  filipino: {
    forms: ["one", "other"],
    select: n => (n !== 1 && n !== 2 && n !== 3 && [4, 6, 9].includes(n % 10) ? "other" : "one"),
    template: `{{if Eval $n "!=" 1 "and" $n "!=" 2 "and" $n "!=" 3 "and" "(" $m10 "==" 4 "or" $m10 "==" 6 "or" $m10 "==" 9 ")"}}{{$form = "other"}}{{else}}{{$form = "one"}}{{end}}`,
  },
  oneForm: {
    forms: ["other"],
    select: () => "other",
    template: `{{$form = "other"}}`,
  },
  czech: {
    forms: ["one", "few", "other"],
    select: n => (n === 1 ? "one" : n >= 2 && n <= 4 ? "few" : "other"),
    template: `{{if Eval $n "==" 1}}{{$form = "one"}}{{else if Eval $n ">=" 2 "and" $n "<=" 4}}{{$form = "few"}}{{else}}{{$form = "other"}}{{end}}`,
  },
  russian: {
    forms: ["one", "few", "many"],
    select: n =>
      n % 10 === 1 && n % 100 !== 11
        ? "one"
        : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
          ? "few"
          : "many",
    template: `{{if Eval $m10 "==" 1 "and" $m100 "!=" 11}}{{$form = "one"}}{{else if Eval $m10 ">=" 2 "and" $m10 "<=" 4 "and" "(" $m100 "<" 10 "or" $m100 ">=" 20 ")"}}{{$form = "few"}}{{else}}{{$form = "many"}}{{end}}`,
  },
  polish: {
    forms: ["one", "few", "many"],
    select: n => (n === 1 ? "one" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "few" : "many"),
    template: `{{if Eval $n "==" 1}}{{$form = "one"}}{{else if Eval $m10 ">=" 2 "and" $m10 "<=" 4 "and" "(" $m100 "<" 10 "or" $m100 ">=" 20 ")"}}{{$form = "few"}}{{else}}{{$form = "many"}}{{end}}`,
  },
  latvian: {
    forms: ["zero", "one", "other"],
    select: n =>
      n % 10 === 0 || (n % 100 >= 11 && n % 100 <= 19) ? "zero" : n % 10 === 1 && n % 100 !== 11 ? "one" : "other",
    template: `{{if Eval $m10 "==" 0 "or" "(" $m100 ">=" 11 "and" $m100 "<=" 19 ")"}}{{$form = "zero"}}{{else if Eval $m10 "==" 1 "and" $m100 "!=" 11}}{{$form = "one"}}{{else}}{{$form = "other"}}{{end}}`,
  },
  // Forgejo's French and Catalan rules also have a "many" form for multiples of a million, left out here.
  french: {
    forms: ["one", "other"],
    select: n => (n === 0 || n === 1 ? "one" : "other"),
    template: `{{if Eval $n "<=" 1}}{{$form = "one"}}{{else}}{{$form = "other"}}{{end}}`,
  },
  catalan: {
    forms: ["one", "other"],
    select: n => (n === 1 ? "one" : "other"),
    template: `{{if Eval $n "==" 1}}{{$form = "one"}}{{else}}{{$form = "other"}}{{end}}`,
  },
  slovenian: {
    forms: ["one", "two", "few", "other"],
    select: n => (n % 100 === 1 ? "one" : n % 100 === 2 ? "two" : n % 100 === 3 || n % 100 === 4 ? "few" : "other"),
    template: `{{if Eval $m100 "==" 1}}{{$form = "one"}}{{else if Eval $m100 "==" 2}}{{$form = "two"}}{{else if Eval $m100 "==" 3 "or" $m100 "==" 4}}{{$form = "few"}}{{else}}{{$form = "other"}}{{end}}`,
  },
} satisfies Record<string, PluralRule>;

/** The plural rule Forgejo uses for each of the languages it enables by default (modules/setting/i18n.go). */
export const languageRules: Record<string, keyof typeof pluralRules> = {
  "en-US": "default",
  "zh-CN": "oneForm",
  "zh-HK": "oneForm",
  "zh-TW": "oneForm",
  da: "default",
  "de-DE": "default",
  nds: "default",
  "fr-FR": "french",
  "nl-NL": "default",
  "lv-LV": "latvian",
  "ru-RU": "russian",
  "uk-UA": "russian",
  "ja-JP": "oneForm",
  "es-ES": "catalan",
  "pt-BR": "french",
  "pt-PT": "catalan",
  "pl-PL": "polish",
  bg: "default",
  "it-IT": "catalan",
  "fi-FI": "default",
  fil: "filipino",
  eo: "default",
  "tr-TR": "default",
  "cs-CZ": "czech",
  sl: "slovenian",
  "sv-SE": "default",
  "ko-KR": "oneForm",
  "el-GR": "default",
  "fa-IR": "bengali",
  "hu-HU": "default",
  "id-ID": "oneForm",
};

export const pluralForms = (language: string): PluralForm[] => pluralRules[languageRules[language]].forms;
export const selectPluralForm = (language: string, n: number): PluralForm =>
  pluralRules[languageRules[language]].select(n);

/** What the template puts in place of a phrase's placeholders: the dict's Count and Branch. */
const placeholders: Record<string, string> = {
  count: "{{.Count}}",
  branch: "{{.Branch}}",
};

/**
 * {list}: the non-zero counts of a pull request's checks, each worded by its phrase with its own number, joined by the
 * language's separator. A template cannot pass another template's output on, so the list is built in place.
 */
export const listItems = [
  ["pulls.checks.count_failing", "{{.Failing}}", ".Failing"],
  ["pulls.checks.count_pending", "{{.Pending}}", ".Pending"],
  ["pulls.checks.count_skipped", "{{.Skipped}}", ".Skipped"],
  ["pulls.checks.count_successful", "{{.Successful}}", ".Successful"],
] as const;
export const listSeparator = "pulls.checks.list_separator";

const renderList = (language: string, entries: Phrases): string => {
  const separator = entries[listSeparator];
  if (typeof separator !== "string") throw new Error(`${language} misses the string ${listSeparator}`);
  const items = listItems.map(([key, value, field]) => {
    const phrase = entries[key];
    if (typeof phrase !== "string") throw new Error(`${language} misses the string ${key}`);
    return `{{if ${field}}}{{if $listed}}${renderText(separator)}{{end}}{{$listed = true}}${renderText(phrase, { count: value })}{{end}}`;
  });
  return `{{$listed := false}}${items.join("")}`;
};

export const readPhrases = (directory: string): Record<string, Phrases> =>
  Object.fromEntries(
    readdirSync(directory)
      .filter(file => file.endsWith(".json"))
      .sort()
      .map(file => [
        file.slice(0, -".json".length),
        JSON.parse(readFileSync(join(directory, file), "utf-8")) as Phrases,
      ])
  );

export const placeholdersOf = (text: string): string[] =>
  [...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();

// Text goes in as quoted strings, which the template escapes and its whitespace trimming leaves alone; a placeholder
// becomes its own action, so a branch passed as HTML stays HTML.
const renderText = (text: string, values: Record<string, string> = placeholders): string =>
  text
    .split(/(\{\w+\})/)
    .filter(part => part !== "")
    .map(part => {
      const name = /^\{(\w+)\}$/.exec(part)?.[1];
      if (name === undefined) return `{{${JSON.stringify(part)}}}`;
      const value = values[name];
      if (!value) throw new Error(`Unknown placeholder {${name}} in "${text}"`);
      return value;
    })
    .join("");

const renderPhrase = (language: string, entries: Phrases, phrase: Phrase): string => {
  const values = { ...placeholders, list: renderList(language, entries) };
  if (typeof phrase === "string") return renderText(phrase, values);
  const rule = pluralRules[languageRules[language]];
  const branches = rule.forms.map((form, index) => {
    const text = phrase[form];
    if (text === undefined) throw new Error(`${language} misses the "${form}" form`);
    return `${index === 0 ? "{{if" : "{{else if"} eq $form "${form}"}}${renderText(text, values)}`;
  });
  return `{{$form := ""}}${rule.template}${branches.join("")}{{end}}`;
};

/**
 * The template `theme/phrase` in the templates pack: Forgejo's wording only. The optional GitHub wording add-on
 * replaces it with the template that buildPhraseTemplate compiles.
 */
export const forgejoWordingTemplate =
  "{{/* Forgejo's wording. Extract theme-github-wording.tar.gz over the templates for GitHub's. */}}{{.Fallback -}}\n";

/**
 * Builds the template `theme/phrase`. It takes a dict with Key, Fallback and, as the phrase needs them, Count (which
 * also picks the plural form), Branch, and for {list} Failing, Pending, Skipped and Successful. It prints the reader's
 * phrase or, for a language without theme phrases, the fallback.
 */
export const buildPhraseTemplate = (phrases: Record<string, Phrases>): string => {
  const lines = [
    "{{/* Generated by scripts/phrases.ts from locales/*.json. Do not edit. */}}",
    "{{- $lang := ctx.Locale.Language -}}",
    "{{- $found := false -}}",
    // n % 10 and n % 100 for the plural rules, read off the count's digits.
    "{{- $n := 0 -}}{{- if .Count -}}{{- $n = .Count -}}{{- end -}}",
    "{{- $digits := print $n -}}{{- $length := len $digits -}}",
    '{{- $m10 := slice $digits (Eval $length "-" 1) -}}',
    '{{- $m100 := $digits -}}{{- if Eval $length ">=" 2 -}}{{- $m100 = slice $digits (Eval $length "-" 2) -}}{{- end -}}',
  ];
  for (const [language, entries] of Object.entries(phrases)) {
    if (!languageRules[language]) throw new Error(`No plural rule for ${language}`);
    lines.push(`{{- if eq $lang "${language}" -}}`);
    Object.entries(entries).forEach(([key, phrase], index) => {
      lines.push(
        `{{- ${index === 0 ? "if" : "else if"} eq .Key "${key}" -}}{{- $found = true -}}${renderPhrase(language, entries, phrase)}`
      );
    });
    lines.push("{{- end -}}", "{{- end -}}");
  }
  lines.push("{{- if not $found -}}{{.Fallback}}{{- end -}}");
  return lines.join("\n") + "\n";
};
