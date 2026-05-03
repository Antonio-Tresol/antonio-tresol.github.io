import {
  Section,
  H1,
  H2,
  P,
  Card,
  Label,
  Mono,
  InlineLink,
} from "../components/Primitives.jsx";
import { palette, fonts } from "../tokens.js";

const projects = [
  {
    label: "Interpretability",
    year: "2026",
    title: "The Refusal Axis: domain decomposition in Gemma 3 12B",
    blurb:
      "Refusal in instruction-tuned LLMs is often described by a single direction in activation space (Arditi 2024). This work tests whether that direction decomposes into geometrically distinguishable per-domain directions in Gemma 3 12B. Findings: refusal occupies a structured 11-dimensional subspace in the residual stream (p < 0.001 vs random vectors); capping along the safety direction at layer 36 reduces safety refusal by 31.6 points on a 0–100 trait scale while capability, privacy, and benign responses move within ±1.3; and three pre-registered SAE hierarchy tests across Gemma Scope 2 Matryoshka widths all fail to find parent-child structure between coarse and fine widths.",
    primary: { href: "https://antonio-tresol.github.io/gemma3-refusal-axis/", label: "Read the writeup" },
    secondary: { href: "https://github.com/Antonio-Tresol/gemma3-refusal-axis", label: "github" },
  },
  {
    label: "Medical imaging · video models",
    year: "2024",
    title: "From Pixels to Diagnosis: ML and Image Sequences",
    blurb:
      "We compared a video model (ViViT) against an image model (ConvNeXT) for detecting intracranial hemorrhage from CT scan sequences. ViViT won (72% accuracy, 62% recall vs 60% accuracy, 13% recall): consuming the whole sequence at once dodges the imbalance that decomposing CT scans into individual slices creates, and lets the model use temporal and spatial structure across slices.",
    primary: { href: "https://antonio-tresol.github.io/from_pixels_to_diagnosis_ml_and_image_sequences/", label: "Read the explainer" },
    secondary: { href: "https://github.com/Antonio-Tresol/from_pixels_to_diagnosis_ml_and_image_sequences", label: "github" },
  },
  {
    label: "Curriculum · agentic software engineering",
    year: "2026",
    title: "Agentic SE Course",
    blurb:
      "A proposal of curriculum for software engineering in a world where coding agents are the primary producers of code. Five weekly sessions (plus an optional capstone) on hands-on agent use, context engineering, the research-plan-implement workflow, and harness engineering for multi-agent setups.",
    primary: { href: "https://antonio-tresol.github.io/agentic-se-course-early-2026/", label: "Read the curriculum" },
    secondary: { href: "https://github.com/Antonio-Tresol/agentic-se-course-early-2026", label: "github" },
  },
];

export function HomePage() {
  return (
    <>
      <Section style={{ paddingTop: "72px" }}>
        <Label>Antonio Badilla-Olivas · independent · 2026</Label>
        <H1>Antonio Badilla-Olivas</H1>
        <P lead style={{ color: palette.text, marginBottom: "20px" }}>
          Independent researcher, AI/ML engineer, M.Sc. student in Computer Science
          at Universidad de Costa Rica. I work on interpretability, AI
          alignment, and AI safety, mostly in Python and PyTorch. I like
          building intelligent systems and figuring out how to make sure they are
          safe and ethical.
        </P>
        <P style={{ marginBottom: "8px" }}>
          If you are working on safe and ethical AI, let's connect.
        </P>
        <Mono style={{ display: "block", marginTop: "24px" }}>
          <InlineLink href="https://scholar.google.com/citations?user=FNKdUJkAAAAJ&hl=en">
            Google Scholar
          </InlineLink>
          {"   ·   "}
          <InlineLink href="https://www.linkedin.com/in/antonio-badilla-olivas/">
            LinkedIn
          </InlineLink>
          {"   ·   "}
          <InlineLink href="https://github.com/Antonio-Tresol">GitHub</InlineLink>
          {"   ·   "}
          <InlineLink href="mailto:antonio1dbo@gmail.com">
            antonio1dbo@gmail.com
          </InlineLink>
        </Mono>
      </Section>

      <Section style={{ marginTop: "16px" }}>
        <Label>Selected work</Label>
        <H2 style={{ marginTop: "8px", marginBottom: "32px" }}>
          Research, writing, and teaching
        </H2>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {projects.map((p) => (
            <Card key={p.title} as="article" style={{ padding: "24px 28px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <Label style={{ marginBottom: 0 }}>{p.label}</Label>
                <Mono style={{ fontSize: "11px" }}>{p.year}</Mono>
              </div>
              <h3
                style={{
                  fontFamily: fonts.display,
                  fontSize: "22px",
                  fontWeight: 600,
                  color: palette.text,
                  letterSpacing: "-0.01em",
                  marginBottom: "10px",
                }}
              >
                {p.title}
              </h3>
              <P style={{ marginBottom: "16px" }}>{p.blurb}</P>
              <Mono>
                <InlineLink href={p.primary.href} arrow="right">
                  {p.primary.label}
                </InlineLink>
                {"   ·   "}
                <InlineLink href={p.secondary.href}>
                  {p.secondary.label}
                </InlineLink>
              </Mono>
            </Card>
          ))}
        </div>
      </Section>

      <Section style={{ marginTop: "72px", marginBottom: "72px" }}>
        <Label>Toolkit</Label>
        <H2 style={{ marginTop: "8px" }}>Tech I reach for</H2>
        <P>
          Mostly Python; PyTorch is my autodiff engine of choice. I like C,
          tolerate C++, and think Rust is cool but it keeps humbling me.
          Cloud-wise I have mostly worked in AWS and Azure. I have a love-hate
          relationship with agentic software engineering, which is part of why
          I am thinking carefully about what an agent-first SE curriculum
          should look like.
        </P>
      </Section>

    </>
  );
}
