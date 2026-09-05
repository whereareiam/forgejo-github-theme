import { css } from "@lutinglt/gitea-github-theme/core";

export default css`
  .ui.label.repository-label {
    --repository-label-dark-text: hsl(from var(--repository-label-color) h s calc(l + var(--repository-label-lighten)));
    --repository-label-background: light-dark(
      var(--repository-label-color),
      rgb(from var(--repository-label-color) r g b / 0.18)
    );
    --repository-label-text: light-dark(var(--repository-label-foreground), var(--repository-label-dark-text));
    border: 1px solid
      light-dark(
        hsl(from var(--repository-label-color) h s calc(l - 25) / var(--repository-label-light-border)),
        hsl(from var(--repository-label-dark-text) h s l / 0.3)
      );
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    padding: 0 6px;
    border-radius: 20px;
    vertical-align: middle;
  }
`;
