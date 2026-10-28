import { Fragment } from "react";

/**
 * Splits text into `[data-w]` word spans for scroll effects (ScrubWords) on
 * the server. *word groups* become accent-coloured; \n is a line break.
 */
export function Words({ text }: { text: string }) {
  return text.split("\n").map((line, li) => (
    <Fragment key={li}>
      {li > 0 && <br />}
      {(line.match(/\*[^*]+\*|\S+/g) ?? []).map((w, i) => {
        const emph = w.startsWith("*") && w.endsWith("*") && w.length > 2;
        const words = emph ? w.slice(1, -1).split(" ") : [w];
        return words.map((word, j) => (
          <Fragment key={`${i}-${j}`}>
            <span data-w="" className={emph ? "emph" : undefined}>
              {word}
            </span>{" "}
          </Fragment>
        ));
      })}
    </Fragment>
  ));
}
