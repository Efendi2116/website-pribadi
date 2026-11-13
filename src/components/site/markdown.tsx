import type { ReactNode } from "react";

const INLINE =
  /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\))/g;

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  INLINE.lastIndex = 0;

  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[2] !== undefined) {
      nodes.push(<strong key={key++}>{match[2]}</strong>);
    } else if (match[3] !== undefined) {
      nodes.push(<em key={key++}>{match[3]}</em>);
    } else if (match[4] !== undefined) {
      nodes.push(<code key={key++}>{match[4]}</code>);
    } else if (match[5] !== undefined) {
      const href = match[6];
      const safe = /^https?:\/\//i.test(href) || href.startsWith("/");
      nodes.push(
        safe ? (
          <a
            key={key++}
            href={href}
            target={href.startsWith("/") ? undefined : "_blank"}
            rel="noreferrer noopener"
          >
            {match[5]}
          </a>
        ) : (
          <span key={key++}>{match[5]}</span>
        ),
      );
    }
    last = INLINE.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const blocks = content.trim().split(/\n{2,}/);

  return (
    <div className="prose-body">
      {blocks.map((block, i) => {
        const trimmed = block.trim();

        if (trimmed.startsWith("### ")) {
          return <h3 key={i}>{renderInline(trimmed.slice(4))}</h3>;
        }
        if (trimmed.startsWith("## ")) {
          return <h2 key={i}>{renderInline(trimmed.slice(3))}</h2>;
        }
        if (trimmed.startsWith("# ")) {
          return <h2 key={i}>{renderInline(trimmed.slice(2))}</h2>;
        }
        if (trimmed.startsWith("> ")) {
          return (
            <blockquote key={i}>
              {renderInline(trimmed.replace(/^>\s?/gm, ""))}
            </blockquote>
          );
        }

        const lines = trimmed.split("\n");
        if (lines.every((line) => line.trim().startsWith("- "))) {
          return (
            <ul key={i}>
              {lines.map((line, j) => (
                <li key={j}>{renderInline(line.trim().slice(2))}</li>
              ))}
            </ul>
          );
        }

        return <p key={i}>{renderInline(lines.join(" "))}</p>;
      })}
    </div>
  );
}