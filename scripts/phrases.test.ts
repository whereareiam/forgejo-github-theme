import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  buildPhraseTemplate,
  forgejoWordingTemplate,
  languageRules,
  placeholdersOf,
  pluralForms,
  readPhrases,
  selectPluralForm,
  type Phrase,
} from "./phrases.ts";

const phrases = readPhrases(join(import.meta.dirname, "..", "locales"));
const english = phrases["en-US"];
const textsOf = (phrase: Phrase): string[] => (typeof phrase === "string" ? [phrase] : Object.values(phrase));

describe("theme phrases", () => {
  it("cover every language Forgejo enables by default", () => {
    expect(Object.keys(phrases).sort()).toEqual(Object.keys(languageRules).sort());
  });

  for (const [language, entries] of Object.entries(phrases)) {
    describe(language, () => {
      it("has exactly the English keys", () => {
        expect(Object.keys(entries).sort()).toEqual(Object.keys(english).sort());
      });

      it("words a phrase as English does: one string, or a plural with the language's forms", () => {
        for (const [key, phrase] of Object.entries(entries)) {
          expect(typeof phrase, key).toBe(typeof english[key]);
          if (typeof phrase !== "string")
            expect(Object.keys(phrase).sort(), key).toEqual([...pluralForms(language)].sort());
        }
      });

      it("uses the placeholders English uses", () => {
        for (const [key, phrase] of Object.entries(entries)) {
          const expected = placeholdersOf(textsOf(english[key])[0]);
          for (const text of textsOf(phrase)) expect(placeholdersOf(text), `${key}: ${text}`).toEqual(expected);
        }
      });

      it("has no empty phrase", () => {
        for (const [key, phrase] of Object.entries(entries))
          for (const text of textsOf(phrase)) expect(text.trim(), key).not.toBe("");
      });
    });
  }

  it("picks Forgejo's plural forms", () => {
    expect([0, 1, 2].map(n => selectPluralForm("en-US", n))).toEqual(["other", "one", "other"]);
    expect([0, 1, 2].map(n => selectPluralForm("fr-FR", n))).toEqual(["one", "one", "other"]);
    expect([1, 2, 5, 11, 21, 22, 25].map(n => selectPluralForm("ru-RU", n))).toEqual([
      "one",
      "few",
      "many",
      "many",
      "one",
      "few",
      "many",
    ]);
    expect([1, 2, 5, 22].map(n => selectPluralForm("pl-PL", n))).toEqual(["one", "few", "many", "few"]);
    expect([1, 3, 5].map(n => selectPluralForm("cs-CZ", n))).toEqual(["one", "few", "other"]);
    expect([1, 2, 3, 5, 101].map(n => selectPluralForm("sl", n))).toEqual(["one", "two", "few", "other", "one"]);
    expect([0, 1, 2, 11, 21].map(n => selectPluralForm("lv-LV", n))).toEqual(["zero", "one", "other", "zero", "one"]);
    expect([1, 7].map(n => selectPluralForm("ja-JP", n))).toEqual(["other", "other"]);
  });

  it("leave the templates pack with Forgejo's wording", () => {
    expect(forgejoWordingTemplate.replace(/\{\{\/\*.*?\*\/\}\}/s, "").trim()).toBe("{{.Fallback -}}");
  });

  it("compile into one template with every language and the fallback", () => {
    const template = buildPhraseTemplate(phrases);
    for (const language of Object.keys(phrases)) expect(template).toContain(`eq $lang "${language}"`);
    expect(template).toContain("{{.Fallback}}");
    // Text is quoted, so the template escapes it.
    expect(template).not.toMatch(/\}\}[^{\n]*<[a-z]/i);
  });
});
