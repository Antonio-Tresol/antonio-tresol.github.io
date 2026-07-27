import { useState, useEffect } from "react";
import {
  Section,
  H1,
  P,
  Card,
  Label,
  Mono,
  InlineLink,
} from "../components/Primitives.jsx";
import { palette, fonts } from "../tokens.js";

// One list, one card. Each item declares which tab it belongs to via `category`.
// Adding new work later = append one object with a category; the tabs are just
// filters over this array, so it lands in the right place automatically.
//
// Card contract — keep new entries inside it so the cards stay comparable:
//
//   label    "Domain · Subject". The separator is the pattern, not decoration.
//   title    The work's name, or name + what it is. No trailing punctuation.
//   blurb    One paragraph, 40-70 words. What it is, then the concrete finding.
//            Keep the numbers; they are the most useful part of a card.
//            No sentence over 30 words — split it instead (Oxford MPLS,
//            "Scientific writing"; Robert Day: the one essential goal is clarity).
//   primary  `Read the <artifact>` for prose, `Open the <artifact>` for something
//            interactive, bare `github` only when no reading artifact exists.
//            The noun should name the real destination: a curriculum is not a
//            writeup and notes are not docs.
//   secondary  `github`, when primary is already spent on something to read.
//   doi      Concept DOI (not the version DOI) when the work is archived on
//            Zenodo. Renders next to the date, so having a writeup never costs
//            a card its identifier.
//   role     Only when it is not mine to claim outright, e.g. "contributor".
const items = [
  {
    category: "research",
    label: "AI safety · interpretability",
    updated: "Jun 2026",
    title: "The Refusal Axis: domain decomposition in Gemma 3 12B",
    blurb:
      "Refusal in instruction-tuned LLMs is often described by a single direction in activation space (Arditi 2024). This work tests whether that direction decomposes into geometrically distinguishable per-domain directions in Gemma 3 12B. Findings: refusal occupies a structured 11-dimensional subspace in the residual stream (p < 0.001 vs random vectors); capping along the safety direction at layer 36 reduces safety refusal by 31.6 points on a 0-100 trait scale while capability, privacy, and benign responses move within ±1.3; and three pre-registered SAE hierarchy tests across Gemma Scope 2 Matryoshka widths all fail to find parent-child structure between coarse and fine widths.",
    doi: "10.5281/zenodo.21617968",
    primary: { href: "https://antonio-tresol.github.io/gemma3-refusal-axis/", label: "Read the writeup" },
    secondary: { href: "https://github.com/Antonio-Tresol/gemma3-refusal-axis", label: "github" },
  },
  {
    category: "learning",
    label: "Curriculum · agentic software engineering",
    updated: "Jun 2026",
    title: "Agentic SE Course",
    blurb:
      "A proposal of curriculum for software engineering in a world where coding agents are the primary producers of code. Five weekly sessions (plus an optional capstone) on hands-on agent use, context engineering, the research-plan-implement workflow, and harness engineering for multi-agent setups.",
    primary: { href: "https://antonio-tresol.github.io/agentic-se-course-early-2026/", label: "Read the curriculum" },
    secondary: { href: "https://github.com/Antonio-Tresol/agentic-se-course-early-2026", label: "github" },
  },
  {
    category: "learning",
    label: "Learning · linear algebra",
    updated: "Jun 2026",
    title: "Linear Algebra: visual, durable notes",
    blurb:
      "Visual notes I build to help me internalise linear algebra, inspired heavily by 3Blue1Brown's material. Every matrix is a linear transformation, never forget. Available in English and Spanish.",
    primary: { href: "https://antonio-tresol.github.io/linear-algebra-notes/", label: "Open the notes" },
    secondary: { href: "https://github.com/Antonio-Tresol/linear-algebra-notes", label: "github" },
  },
  {
    category: "building",
    label: "Open source · AI enablement",
    role: "contributor",
    updated: "Jun 2026",
    title: "lanorme: executable codebase standards for Python",
    blurb:
      "Executable codebase standards for Python: quality, style, architecture, and structure, checked mechanically on every commit. Part of my effort to automate as much of code review as possible and elicit excellent, tightly-guided work from coding agents. The same gate runs in CI and inside an AI agent's loop, so the standard that reviews humans also steers the agents.",
    primary: { href: "https://lanorme.github.io/lanorme/", label: "Read the docs" },
    secondary: { href: "https://github.com/lanorme/lanorme", label: "github" },
  },
  {
    category: "building",
    label: "Open source · research integrity",
    updated: "Jul 2026",
    title: "research-engineering-harness: process gates for AI-assisted research",
    blurb:
      "A portable harness for doing technical research alongside AI agents without quietly lowering the evidentiary bar. Nine agent skills, but the load-bearing parts are mechanical. A claim cannot reach “survived” unless a falsification scorecard exists on disk, and graders are never edited in the commit they certify. Held to its own standard: the behaviour eval suite records a case where a skill made an agent measurably worse.",
    doi: "10.5281/zenodo.21617974",
    primary: { href: "https://github.com/Antonio-Tresol/research-engineering-harness", label: "github" },
  },
  {
    category: "research",
    label: "AI safety · multi-agent deception",
    updated: "Mar 2026",
    title: "Secret Hitler Sandbox",
    blurb:
      "A research sandbox for studying deceptive capabilities in LLM-based multi-agent systems. Agent players play full games of Secret Hitler against each other through MCP tool use, while a deterministic engine enforces rules and records everything for later analysis. The setup isolates a few capabilities that matter for safety evaluations: sustaining a false identity over many rounds of social interaction, coordinating covertly with allies without explicit signalling, and detecting deception from behavioural cues alone.",
    doi: "10.5281/zenodo.21618868",
    primary: { href: "https://github.com/Antonio-Tresol/secret-hitler-sandbox", label: "github" },
  },
  {
    category: "research",
    label: "Medical imaging · video models",
    updated: "Apr 2026",
    title: "From Pixels to Diagnosis: ML and Image Sequences",
    blurb:
      "We compared a video model (ViViT) against an image model (ConvNeXT) for detecting intracranial hemorrhage from CT scan sequences. ViViT won (72% accuracy, 62% recall vs 60% accuracy, 13% recall): consuming the whole sequence at once dodges the imbalance that decomposing CT scans into individual slices creates, and lets the model use temporal and spatial structure across slices.",
    primary: { href: "https://antonio-tresol.github.io/from_pixels_to_diagnosis_ml_and_image_sequences/", label: "Read the explainer" },
    secondary: { href: "https://github.com/Antonio-Tresol/from_pixels_to_diagnosis_ml_and_image_sequences", label: "github" },
  },
  {
    category: "research",
    label: "Computer vision · botany",
    updated: "Oct 2024",
    title: "Transformers Unidos: ensemble ViTs for Costa Rican flora",
    blurb:
      "We compared an ensemble of Vision Transformers against an ensemble of convolutional networks for the automatic recognition of Costa Rican leaf species. Published as “Transformers Unidos: Eficacia De los Modelos Ensemble-ViT en Clasificación Automática de Flora Costarricense” (6JIFI 2024, in Spanish).",
    primary: { href: "https://github.com/Antonio-Tresol/vits_ensemble_cr_leaves/blob/main/articulo_6jifi_2024_abadilla_evilchez_rgonzalez.pdf", label: "Read the paper (PDF)" },
    secondary: { href: "https://github.com/Antonio-Tresol/vits_ensemble_cr_leaves", label: "github" },
  },
];

// Tabs are config, not markup. Reorder / rename / add a fourth by editing here.
const TABS = [
  {
    id: "research",
    label: "Research",
    intro:
      "Papers, experiments, and writing on interpretability, AI safety, and machine learning.",
  },
  {
    id: "building",
    label: "Building",
    intro: "Open-source tools I'm working on.",
  },
  {
    id: "learning",
    label: "Teaching & Learning",
    intro:
      "Projects where I'm learning or teaching something, most often AI/ML, software engineering, or math.",
  },
  {
    id: "about",
    label: "About",
  },
];

const TAB_IDS = TABS.map((t) => t.id);

function readTabFromHash() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  return TAB_IDS.includes(raw) ? raw : TABS[0].id;
}

function ItemCard({ item }) {
  return (
    <Card as="article" style={{ padding: "24px 28px" }}>
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
        <Label style={{ marginBottom: 0 }}>{item.label}</Label>
        <Mono style={{ fontSize: "11px" }}>
          {item.role ? `${item.role} · ` : ""}updated {item.updated}
          {/* A DOI is an identifier, not an action, so it sits with the date
              rather than competing for one of the two link slots below. Those
              slots are spent on "read this" and "the code"; a card that happens
              to have a writeup should not thereby lose its DOI. */}
          {item.doi && (
            <>
              {" · "}
              <InlineLink href={`https://doi.org/${item.doi}`}>
                {item.doi}
              </InlineLink>
            </>
          )}
        </Mono>
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
        {item.title}
      </h3>
      <P style={{ marginBottom: "16px" }}>{item.blurb}</P>
      <Mono>
        <InlineLink href={item.primary.href} arrow="right">
          {item.primary.label}
        </InlineLink>
        {item.secondary && (
          <>
            {"   ·   "}
            <InlineLink href={item.secondary.href}>
              {item.secondary.label}
            </InlineLink>
          </>
        )}
      </Mono>
    </Card>
  );
}

function AboutPanel() {
  return (
    <div style={{ marginTop: "4px" }}>
      <P lead style={{ color: palette.text, marginBottom: "18px" }}>
        Independent researcher and AI/ML engineer. I work on interpretability,
        AI alignment, and AI safety, mostly in Python and PyTorch. I like
        building intelligent systems and figuring out how to make sure they are
        safe and ethical.
      </P>
      <P style={{ marginBottom: "32px" }}>
        If you are working on safe and ethical AI, let's connect.
      </P>

      <Label>Tech I reach for</Label>
      <P style={{ marginBottom: 0 }}>
        Mostly Python; PyTorch is my autodiff engine of choice. I like C,
        tolerate C++, and think Rust is cool but it keeps humbling me.
        Cloud-wise I have mostly worked in AWS and Azure. I have a love-hate
        relationship with agentic software engineering, which is part of why I
        am thinking carefully about what an agent-first SE curriculum should
        look like.
      </P>
    </div>
  );
}

function TabBar({ active, onSelect }) {
  return (
    <div
      role="tablist"
      aria-label="Sections of work"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "28px",
        borderBottom: `1px solid ${palette.border}`,
        marginBottom: "28px",
      }}
    >
      {TABS.map((t) => {
        const selected = t.id === active;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(t.id)}
            style={{
              fontFamily: fonts.mono,
              fontSize: "13px",
              letterSpacing: "0.02em",
              padding: "12px 2px",
              marginBottom: "-1px",
              background: "none",
              border: "none",
              borderBottom: `2px solid ${selected ? palette.orange : "transparent"}`,
              color: selected ? palette.text : palette.muted,
              fontWeight: selected ? 600 : 500,
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export function HomePage() {
  const [active, setActive] = useState(readTabFromHash);

  // Keep the tab in sync with the URL hash so tabs are bookmarkable and
  // survive a refresh (Pages-safe: hash routing never 404s).
  useEffect(() => {
    const onHashChange = () => setActive(readTabFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const selectTab = (id) => {
    window.location.hash = `#/${id}`;
    setActive(id);
  };

  const activeTab = TABS.find((t) => t.id === active) || TABS[0];
  const visible = items.filter((it) => it.category === active);

  return (
    <>
      <Section style={{ paddingTop: "36px" }}>
        <img
          src="/sunflowers.jpg"
          alt="Post-impressionist sunflowers painted in the style of Van Gogh"
          style={{
            display: "block",
            width: "100%",
            height: "150px",
            objectFit: "cover",
            objectPosition: "center",
            borderRadius: "12px",
            border: `1px solid ${palette.border}`,
            marginBottom: "36px",
          }}
        />
        <H1>Antonio Badilla-Olivas</H1>
        <P lead style={{ color: palette.text, marginTop: "6px", marginBottom: 0 }}>
          Independent researcher and AI/ML engineer. Main interests are in
          technical AI safety and interpretability.
        </P>
        <Mono style={{ display: "block", marginTop: "18px" }}>
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

      <Section style={{ marginTop: "24px", marginBottom: "80px" }}>
        <TabBar active={active} onSelect={selectTab} />
        {active === "about" ? (
          <AboutPanel />
        ) : (
          <>
            <P style={{ marginTop: "4px", marginBottom: "28px" }}>
              {activeTab.intro}
            </P>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {visible.map((it) => (
                <ItemCard key={it.title} item={it} />
              ))}
            </div>
          </>
        )}
      </Section>
    </>
  );
}
