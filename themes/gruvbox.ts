import type { Chroma, CodeMirror, GiteaColor, Syntax } from "@lutinglt/gitea-github-theme/core";
import { deepOverride, defineTheme, primer2Chroma, primer2CodeMirror } from "@lutinglt/gitea-github-theme/core";
import { default as primer } from "@lutinglt/gitea-github-theme/primer";
import { giteaDarkColor, giteaDarkSyntax } from "./giteaDark";
import { giteaLightColor, giteaLightSyntax } from "./giteaLight";

type GruvboxPalette = {
  bg0: string;
  bg1: string;
  bg2: string;
  bg3: string;
  bg4: string;
  fg0: string;
  fg1: string;
  fg2: string;
  fg3: string;
  red: string;
  redBright: string;
  green: string;
  greenBright: string;
  yellow: string;
  yellowBright: string;
  blue: string;
  blueBright: string;
  purple: string;
  purpleBright: string;
  aqua: string;
  aquaBright: string;
  orange: string;
  orangeBright: string;
};

function alphaScale(color: string) {
  return {
    num10: `${color}19`,
    num20: `${color}33`,
    num30: `${color}4b`,
    num40: `${color}66`,
    num50: `${color}80`,
    num60: `${color}99`,
    num70: `${color}b3`,
    num80: `${color}cc`,
    num90: `${color}e1`,
  };
}

function createGruvboxColor(base: GiteaColor, palette: GruvboxPalette): GiteaColor {
  const {
    bg0,
    bg1,
    bg2,
    bg3,
    bg4,
    fg0,
    fg1,
    fg2,
    fg3,
    red,
    redBright,
    green,
    greenBright,
    yellow,
    yellowBright,
    blue,
    blueBright,
    purple,
    purpleBright,
    aqua,
    aquaBright,
    orange,
    orangeBright,
  } = palette;

  return deepOverride(base, {
    primary: {
      self: blue,
      contrast: fg0,
      dark: { num1: blue, num2: blueBright, num3: aqua, num4: aquaBright, num5: fg3, num6: fg2, num7: fg1 },
      light: { num1: blueBright, num2: blue, num3: aquaBright, num4: aqua, num5: fg3, num6: fg2, num7: fg1 },
      alpha: alphaScale(blue),
      hover: blueBright,
      active: aqua,
    },
    secondary: {
      self: bg2,
      dark: {
        num1: bg3,
        num2: bg4,
        num3: fg3,
        num4: fg2,
        num5: fg1,
        num6: fg0,
        num7: bg0,
        num8: bg0,
        num9: bg1,
        num10: bg2,
        num11: bg3,
        num12: bg4,
        num13: fg3,
      },
      light: { num1: bg1, num2: bg0, num3: fg0, num4: fg1 },
      alpha: alphaScale(bg2),
      button: bg1,
      hover: bg2,
      active: bg3,
    },
    named: {
      red: { self: red, light: redBright, dark: { num1: red, num2: redBright } },
      orange: { self: orange, light: orangeBright, dark: { num1: orange, num2: orangeBright } },
      yellow: { self: yellow, light: yellowBright, dark: { num1: yellow, num2: yellowBright } },
      olive: { self: yellow, light: yellowBright, dark: { num1: yellow, num2: yellowBright } },
      green: { self: green, light: greenBright, dark: { num1: green, num2: greenBright } },
      teal: { self: aqua, light: aquaBright, dark: { num1: aqua, num2: aquaBright } },
      blue: { self: blue, light: blueBright, dark: { num1: blue, num2: blueBright } },
      violet: { self: purple, light: purpleBright, dark: { num1: purple, num2: purpleBright } },
      purple: { self: purple, light: purpleBright, dark: { num1: purple, num2: purpleBright } },
      pink: { self: purple, light: purpleBright, dark: { num1: purple, num2: purpleBright } },
      brown: { self: orange, light: orangeBright, dark: { num1: orange, num2: orangeBright } },
      black: { self: bg0, light: bg2, dark: { num1: bg1, num2: bg2 } },
      grey: { self: fg2, light: fg3 },
      gold: yellow,
      white: fg0,
    },
    message: {
      error: { bg: { self: `${red}20`, active: `${red}40`, hover: `${red}30` }, border: red, text: redBright },
      success: { bg: `${green}20`, border: green, text: greenBright },
      warning: { bg: `${yellow}20`, border: yellow, text: yellowBright },
      info: { bg: `${blue}20`, border: blue, text: blueBright },
      priority: { bg: `${purple}20`, border: purple, text: purpleBright },
    },
    ansi: {
      black: bg0,
      red,
      green,
      yellow,
      blue,
      magenta: purple,
      cyan: aqua,
      white: fg2,
      bright: {
        black: bg4,
        red: redBright,
        green: greenBright,
        yellow: yellowBright,
        blue: blueBright,
        magenta: purpleBright,
        cyan: aquaBright,
        white: fg0,
      },
    },
    console: {
      fg: { self: fg1, subtle: fg3 },
      bg: bg0,
      border: bg2,
      activeBg: bg2,
      hoverBg: bg1,
      menu: { bg: bg1, border: bg2 },
      link: blue,
    },
    diff: {
      added: {
        fg: greenBright,
        linenum: { bg: `${green}30` },
        row: { bg: `${green}20`, border: `${green}40` },
        word: { bg: `${green}50` },
      },
      moved: { row: { bg: `${blue}20`, border: `${blue}50` } },
      removed: {
        fg: redBright,
        linenum: { bg: `${red}30` },
        row: { bg: `${red}20`, border: `${red}40` },
        word: { bg: `${red}50` },
      },
      inactive: bg1,
    },
    other: {
      logo: green,
      body: bg0,
      footer: bg1,
      timeline: bg2,
      box: { header: bg1, body: { self: bg0, highlight: bg1 } },
      text: { self: fg1, light: { self: fg2, num1: fg2, num2: fg3, num3: fg3 }, dark: fg0 },
      input: { text: fg1, background: bg0, toggleBackground: bg3, border: bg3 },
      light: { self: bg0, border: `${fg0}28` },
      hover: { self: `${fg0}19`, opaque: bg1 },
      active: `${fg0}24`,
      menu: bg0,
      card: bg1,
      markup: { tableRow: `${fg0}0f`, code: { block: base.isDarkTheme ? "#00000020" : bg1, inline: bg1 } },
      button: bg1,
      codeBg: bg0,
      shadow: { self: base.isDarkTheme ? "#1d202158" : "#25292e0a", opaque: "#1d2021" },
      secondaryBg: bg1,
      expandButton: bg2,
      placeholderText: fg3,
      editor: { lineHighlight: `${bg2}66`, selection: `${blue}50` },
      projectColumnBg: bg1,
      caret: fg1,
      reaction: { bg: `${fg0}12`, hoverBg: `${blue}28`, activeBg: `${blue}40` },
      tooltip: { text: fg0, bg: bg2 },
      nav: { bg: bg0, hoverBg: bg1, text: fg1 },
      secondaryNavBg: bg1,
      label: { text: fg1, bg: `${fg3}4b`, hoverBg: `${fg3}a0`, activeBg: `${fg3}ff` },
      accent: blue,
      smallAccent: aqua,
      highlight: { fg: yellowBright, bg: `${yellow}30` },
      overlayBackdrop: "#1d2021c0",
      danger: red,
      transparency: { grid: { light: bg1, dark: bg0 } },
      workflowEdgeHover: blue,
    },
    series16: {
      num0: red,
      num1: green,
      num2: yellow,
      num3: blue,
      num4: purple,
      num5: aqua,
      num6: orange,
      num7: fg2,
      num8: redBright,
      num9: greenBright,
      num10: yellowBright,
      num11: blueBright,
      num12: purpleBright,
      num13: aquaBright,
      num14: orangeBright,
      num15: fg0,
    },
  });
}

function createGruvboxSyntax(base: Syntax, palette: GruvboxPalette): Syntax {
  return deepOverride(base, {
    keyword: palette.redBright,
    bool: palette.purpleBright,
    control: palette.red,
    name: palette.blueBright,
    type: palette.yellowBright,
    number: palette.purpleBright,
    operator: palette.orangeBright,
    regexp: palette.redBright,
    string: palette.greenBright,
    comment: palette.fg3,
    invalid: palette.redBright,
    link: palette.blueBright,
    tag: palette.redBright,
    attribute: palette.yellowBright,
    property: palette.aquaBright,
    variable: palette.blueBright,
    stringSpecial: palette.aquaBright,
    escape: palette.purpleBright,
    entity: palette.orangeBright,
    preproc: palette.aquaBright,
    preprocFile: palette.greenBright,
    decorator: palette.purpleBright,
    namespace: palette.fg1,
    namePseudo: palette.yellowBright,
    commentSpecial: palette.orangeBright,
    text: palette.fg1,
    textAlt: palette.fg2,
    punctuation: palette.fg2,
    whitespace: palette.fg3,
    diffFg: palette.fg0,
    deletedBg: `${palette.red}50`,
    insertedBg: `${palette.green}50`,
    emph: palette.orangeBright,
    strong: palette.yellowBright,
    heading: palette.redBright,
    subheading: palette.greenBright,
    output: palette.fg3,
    prompt: palette.blueBright,
    traceback: palette.redBright,
    matchingBracketBg: `${palette.aqua}48`,
    nonmatchingBracketBg: `${palette.red}48`,
  });
}

function createGruvboxChroma(base: Chroma, palette: GruvboxPalette): Chroma {
  return deepOverride(base, {
    textWhiteSpace: palette.fg2,
    err: palette.redBright,
    keyword: {
      self: palette.redBright,
      constant: palette.purpleBright,
      declaration: palette.redBright,
      namespace: palette.aquaBright,
      pseudo: palette.purpleBright,
      reserved: palette.redBright,
      type: palette.yellowBright,
    },
    name: {
      self: palette.fg1,
      attribute: palette.blueBright,
      builtin: palette.purpleBright,
      builtinPseudo: palette.fg1,
      class: palette.yellowBright,
      constant: palette.purpleBright,
      decorator: palette.aquaBright,
      entity: palette.orangeBright,
      exception: palette.redBright,
      function: palette.greenBright,
      functionMagic: palette.aquaBright,
      label: palette.yellowBright,
      namespace: palette.aquaBright,
      other: palette.fg1,
      property: palette.aquaBright,
      tag: palette.redBright,
      variable: palette.blueBright,
      variableClass: palette.blueBright,
      variableGlobal: palette.blueBright,
      variableInstance: palette.blueBright,
      variableMagic: palette.purpleBright,
    },
    literal: { self: palette.purpleBright, date: palette.purpleBright },
    string: {
      self: palette.greenBright,
      affix: palette.redBright,
      backtick: palette.aquaBright,
      char: palette.greenBright,
      delimiter: palette.greenBright,
      doc: palette.fg3,
      double: palette.greenBright,
      escape: palette.aquaBright,
      heredoc: palette.greenBright,
      interpol: palette.aquaBright,
      other: palette.greenBright,
      regex: palette.redBright,
      single: palette.greenBright,
      symbol: palette.purpleBright,
    },
    number: {
      self: palette.purpleBright,
      bin: palette.purpleBright,
      float: palette.purpleBright,
      hex: palette.purpleBright,
      integer: palette.purpleBright,
      integerLong: palette.purpleBright,
      oct: palette.purpleBright,
    },
    operator: { self: palette.orangeBright, word: palette.redBright, reserved: palette.redBright },
    punctuation: palette.fg2,
    comment: {
      self: palette.fg3,
      hashbang: palette.fg3,
      multiline: palette.fg3,
      preproc: palette.aquaBright,
      preprocFile: palette.greenBright,
      single: palette.fg3,
      special: palette.orangeBright,
    },
    generic: {
      self: palette.fg1,
      deleted: palette.redBright,
      emph: palette.orangeBright,
      error: palette.redBright,
      heading: palette.yellowBright,
      inserted: palette.greenBright,
      output: palette.fg2,
      prompt: palette.blueBright,
      strong: palette.fg1,
      subheading: palette.greenBright,
      traceback: palette.redBright,
      underline: palette.fg1,
    },
  });
}

function createGruvboxCodeMirror(base: CodeMirror, palette: GruvboxPalette): CodeMirror {
  return deepOverride(base, {
    token: {
      keyword: palette.redBright,
      atom: palette.purpleBright,
      bool: palette.purpleBright,
      variableName: palette.blueBright,
      variableName2: palette.fg1,
      propertyName: palette.aquaBright,
      typeName: palette.yellowBright,
      className: palette.yellowBright,
      namespace: palette.aquaBright,
      macroName: palette.aquaBright,
      labelName: palette.yellowBright,
      number: palette.purpleBright,
      string: palette.greenBright,
      string2: palette.aquaBright,
      operator: palette.orangeBright,
      punctuation: palette.fg2,
      comment: palette.fg3,
      meta: palette.aquaBright,
      invalid: palette.redBright,
      link: palette.blueBright,
      heading: palette.yellowBright,
      emphasis: palette.orangeBright,
      strong: palette.fg1,
      inserted: palette.greenBright,
      deleted: palette.redBright,
    },
    language: {
      json: palette.aquaBright,
      json5: palette.aquaBright,
      yaml: palette.aquaBright,
      css: palette.aquaBright,
      html: palette.blueBright,
      xml: palette.blueBright,
    },
  });
}

const darkPalette: GruvboxPalette = {
  bg0: "#282828",
  bg1: "#3c3836",
  bg2: "#504945",
  bg3: "#665c54",
  bg4: "#7c6f64",
  fg0: "#fbf1c7",
  fg1: "#ebdbb2",
  fg2: "#d5c4a1",
  fg3: "#bdae93",
  red: "#cc241d",
  redBright: "#fb4934",
  green: "#98971a",
  greenBright: "#b8bb26",
  yellow: "#d79921",
  yellowBright: "#fabd2f",
  blue: "#458588",
  blueBright: "#83a598",
  purple: "#b16286",
  purpleBright: "#d3869b",
  aqua: "#689d6a",
  aquaBright: "#8ec07c",
  orange: "#d65d0e",
  orangeBright: "#fe8019",
};

const lightPalette: GruvboxPalette = {
  bg0: "#fbf1c7",
  bg1: "#ebdbb2",
  bg2: "#d5c4a1",
  bg3: "#bdae93",
  bg4: "#a89984",
  fg0: "#282828",
  fg1: "#3c3836",
  fg2: "#504945",
  fg3: "#665c54",
  red: "#cc241d",
  redBright: "#9d0006",
  green: "#98971a",
  greenBright: "#79740e",
  yellow: "#d79921",
  yellowBright: "#b57614",
  blue: "#458588",
  blueBright: "#076678",
  purple: "#b16286",
  purpleBright: "#8f3f71",
  aqua: "#689d6a",
  aquaBright: "#427b58",
  orange: "#d65d0e",
  orangeBright: "#af3a03",
};

export const gruvboxDarkColor = createGruvboxColor(giteaDarkColor, darkPalette);
export const gruvboxLightColor = createGruvboxColor(giteaLightColor, lightPalette);
export const gruvboxDarkSyntax = createGruvboxSyntax(giteaDarkSyntax, darkPalette);
export const gruvboxLightSyntax = createGruvboxSyntax(giteaLightSyntax, lightPalette);
export const gruvboxDarkChroma = createGruvboxChroma(primer2Chroma(primer.dark), darkPalette);
export const gruvboxLightChroma = createGruvboxChroma(primer2Chroma(primer.light), lightPalette);
export const gruvboxDarkCodeMirror = createGruvboxCodeMirror(primer2CodeMirror(primer.dark), darkPalette);
export const gruvboxLightCodeMirror = createGruvboxCodeMirror(primer2CodeMirror(primer.light), lightPalette);

export const gruvboxDarkTheme = defineTheme({
  colorType: "gitea",
  themeColor: gruvboxDarkColor,
  syntaxColor: gruvboxDarkSyntax,
  chromaColor: gruvboxDarkChroma,
  codeMirrorColor: gruvboxDarkCodeMirror,
});

export const gruvboxLightTheme = defineTheme({
  colorType: "gitea",
  themeColor: gruvboxLightColor,
  syntaxColor: gruvboxLightSyntax,
  chromaColor: gruvboxLightChroma,
  codeMirrorColor: gruvboxLightCodeMirror,
});
