import { Fragment, type ReactNode } from "react";
import { site } from "@/config/site";
import { isPlaceholder, type Copy } from "@/lib/copy";

const showTags: boolean = site.flags.showPlaceholderTags;

function PlaceholderTag() {
  return (
    <span className="ph-tag" aria-hidden="true">
      Placeholder
    </span>
  );
}

/** Renders *word* as the accent-coloured word and \n as line breaks. */
export function renderInline(text: string): ReactNode {
  const lines = text.split("\n");
  return lines.map((line, li) => (
    <Fragment key={li}>
      {li > 0 && <br />}
      {line.split(/(\*[^*]+\*)/g).map((part, pi) =>
        part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
          <em key={pi} className="emph">
            {part.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={pi}>{part}</Fragment>
        ),
      )}
    </Fragment>
  ));
}

/**
 * <T c={copy} />: renders a Copy value. ph("…") values get a visible
 * [PLACEHOLDER] tag while site.flags.showPlaceholderTags is true.
 */
export function T({ c, rich = true, tag = true }: { c: Copy; rich?: boolean; tag?: boolean }) {
  const text = typeof c === "string" ? c : c.text;
  return (
    <>
      {rich ? renderInline(text) : text}
      {tag && showTags && isPlaceholder(c) && <PlaceholderTag />}
    </>
  );
}

/** Tag only: for places where text is split up (e.g. animated headlines). */
export function PhTag({ c }: { c: Copy }) {
  return showTags && isPlaceholder(c) ? <PlaceholderTag /> : null;
}
