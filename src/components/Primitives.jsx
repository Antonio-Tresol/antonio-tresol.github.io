import { palette, fonts, layout } from "../tokens.js";

export function Section({ style, children }) {
  return (
    <section
      style={{
        maxWidth: layout.readingMaxWidth,
        margin: "0 auto",
        padding: layout.pagePadding,
        ...style,
      }}
    >
      {children}
    </section>
  );
}

export function H1({ children, style }) {
  return (
    <h1
      style={{
        fontFamily: fonts.display,
        fontSize: "clamp(40px, 5.5vw, 56px)",
        fontWeight: 700,
        lineHeight: 1.05,
        color: palette.text,
        marginBottom: "16px",
        letterSpacing: "-0.02em",
        ...style,
      }}
    >
      {children}
    </h1>
  );
}

export function H2({ children, style, id }) {
  return (
    <h2
      id={id}
      style={{
        fontFamily: fonts.display,
        fontSize: "26px",
        fontWeight: 600,
        color: palette.text,
        letterSpacing: "-0.015em",
        marginTop: "56px",
        marginBottom: "16px",
        scrollMarginTop: "100px",
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

export function P({ children, style, lead = false }) {
  return (
    <p
      style={{
        fontFamily: fonts.body,
        fontSize: lead ? "20px" : "17px",
        lineHeight: lead ? 1.55 : 1.72,
        color: lead ? palette.text : palette.body,
        marginBottom: "16px",
        ...style,
      }}
    >
      {children}
    </p>
  );
}

export function Label({ children, style }) {
  return (
    <div
      style={{
        fontFamily: fonts.mono,
        fontSize: "10px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: palette.muted,
        marginBottom: "12px",
        fontWeight: 500,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Mono({ children, style }) {
  return (
    <span
      style={{
        fontFamily: fonts.mono,
        fontSize: "12.5px",
        color: palette.muted,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Card({ as: Tag = "div", style, children, hover = true, ...rest }) {
  return (
    <Tag
      className={hover ? "hover-card" : undefined}
      style={{
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: "10px",
        padding: "22px 24px",
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Arrow({ size = 12, color = "currentColor", direction = "out" }) {
  const paths = {
    out: "M1 11L11 1M11 1H4M11 1V8",
    right: "M1 6H11M11 6L7 2M11 6L7 10",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      style={{ flexShrink: 0 }}
      aria-hidden
    >
      <path
        d={paths[direction] || paths.out}
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InlineLink({ href, children, style, arrow }) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  const showArrow = arrow || (isExternal && !href.startsWith("mailto:") ? "out" : null);
  return (
    <a
      className="link-plain"
      href={href}
      target={isExternal && !href.startsWith("mailto:") ? "_blank" : undefined}
      rel={isExternal && !href.startsWith("mailto:") ? "noopener noreferrer" : undefined}
      style={{
        color: palette.text,
        display: "inline",
        ...style,
      }}
    >
      {children}
      {showArrow === "out" && (
        <>
          {" "}
          <Arrow size={10} color={palette.orange} direction="out" />
        </>
      )}
      {showArrow === "right" && (
        <>
          {" "}
          <Arrow size={10} color={palette.orange} direction="right" />
        </>
      )}
    </a>
  );
}
