---
name: Между строк
description: A quiet hand-drawn mystery journal with slow firelight and drifting embers.
colors:
  page: "#1b1411"
  paper: "#fff0e4"
  muted: "#d6b9aa"
  dim: "#b99d90"
  pink: "#f0a06c"
  line: "#51372f"
  sand: "#f1ae72"
  note: "#2b2226"
  note-text: "#e9dadd"
typography:
  display:
    fontFamily: '"Caveat", "Comfortaa", cursive'
    fontSize: "clamp(37px, 4vw, 53px)"
    fontWeight: 500
    lineHeight: 1.16
    letterSpacing: "-.018em"
  headline:
    fontFamily: '"Caveat", "Comfortaa", cursive'
    fontSize: "37px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-.015em"
  title:
    fontFamily: '"Caveat", "Comfortaa", cursive'
    fontSize: "30px"
    fontWeight: 500
    lineHeight: 1.25
  body:
    fontFamily: '"Comfortaa", "Trebuchet MS", sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: '"Comfortaa", "Trebuchet MS", sans-serif'
    fontSize: "12px"
rounded:
  disclosure: "5px"
  note: "2px 8px 4px 7px"
components:
  entry-disclosure:
    textColor: "{colors.paper}"
    rounded: "{rounded.disclosure}"
    padding: "21px 12px 21px 10px"
  revealed-note:
    backgroundColor: "{colors.note}"
    textColor: "{colors.note-text}"
    rounded: "{rounded.note}"
    padding: "23px 29px 20px"
---

# Design System: Между строк

## Overview

**Creative North Star: "A quiet hand-drawn mystery journal in firelight"**

Warm charcoal paper, ember-orange marks, imperfect pencil outlines and a flickering, layered flame make a personal archive feel intimate and curious. The avatar reference supplies the handmade character; the page palette now carries the firelight of the October 22 chapter. Romance stays restrained, with room for lightly humorous observations.

This is a record of the first implemented prototype, not a user-approved final identity. The title, copy, chapter treatments and descriptive language remain provisional. Values were extracted from source; rendered desktop/mobile screenshots and computed styles could not be verified because the local server/browser failed with EPERM.

**Key Characteristics:**
- Dark paper with a subtle grain.
- Handwritten headings beside quiet rounded body text.
- Open rows threaded together by an imperfect dashed line.
- Small discoveries revealed in place.

## Colors

### Primary

Ember orange (`pink`) marks the star, opening emphasis, active chapter titles and handwritten afterthoughts. Golden amber (`sand`) gives the warmth chapter its stronger accent.

### Neutral

Warm charcoal (`page`) is the canvas; cream (`paper`) carries prominent text. Softer ink (`muted`) carries supporting text, faded ink (`dim`) the footer, and burnt umber (`line`) the separators. The note surface (`note`) sits slightly above the canvas with softer cream (`note-text`) for prose. Warm and dusk note variants use burnt sienna and muted copper within the wider ember palette.

## Typography

Caveat supplies the handwritten display, headings, titles and marginalia. It loads through Google Fonts; locally bundled Comfortaa is its fallback and the body face. A network-free rendering therefore has a different heading character. Preserve readable body text rather than turning all copy into handwriting.

The frontmatter describes the base hierarchy. Supporting copy uses 14–15px, dates use 13px, and note prose uses 16px with a 1.85 line height and a 65ch maximum measure. These reading roles stay readable at mobile sizes instead of shrinking into 9–11px text. Chapter titles use 30px on desktop and 28px on smaller screens; mobile rows have more vertical space for wrapping. The hero remains fluid. Typography still needs visual review on real devices.

## Layout

A centered canvas has a base maximum width (1060px), with generous side space (48px). At wide screens (1400px and up), it grows to 1120px. The hero pairs an opening thought with a decorative illustration; the archive narrows to 940px.

At 900px, side space becomes 32px and row columns tighten. At 640px, side space becomes 22px, the hero stacks, marginal prompts disappear, and dates move beneath titles. Rows retain their icon and disclosure control. The repeating rhythm comes from open whitespace, dividers and a dashed thread, rather than boxed cards.

## Elevation & Depth

There are no box shadows. Slightly lighter note surfaces, paper grain (4% opacity), restrained dashed marks and small rotations supply depth. An imperfect outlined flame with layered, independently flickering tongues, soft ambient glow and sparse drifting embers supply the warm focal light; the grain and motion layers are decorative and never intercept input.

## Shapes

Outline icons have rounded caps and joins with slightly irregular paths. Small stars and flame marks repeat the illustrated world. Disclosure corners are gently softened; note corners are asymmetric. Dividers and marginalia rotate by small amounts rather than forming a perfectly mechanical grid.

## Components

- **Wordmark and exploration link:** quiet text links with a hand-drawn star or bent arrow. The exploration arrow shifts slightly on hover; focus uses a dusty-rose dashed outline (2px, offset 7px).
- **Chapter disclosure:** native `details` and `summary`; the entire row is the target. Hover adds a faint rose wash and rose title. Open state turns the chevron and highlights the title. JavaScript keeps one entry open at a time; disclosures still work without it.
- **Revealed note:** inset tonal paper with an imperfect dashed top edge, small label, relaxed prose and handwritten afterthought. Warm and moon variants gently change local ink and surface colors.
- **Masked date:** tabular body numerals with handwritten rose `x` characters. Accessible labels describe unknown dates; masked dates must remain intentionally incomplete.
- **Locked entry:** a passive row with faded ink and a lock. It has no interactive target and does not pretend to unlock.
- **Motion:** link and title transitions use 200ms; chevrons use 240ms. On `/story`, layered flame tongues flicker at different rhythms while the glow breathes and a few embers drift slowly over the page. Supporting browsers animate native disclosure height over 300ms. Reduced-motion preferences remove transitions, ambient animation and smooth scrolling.

## Do's and Don'ts

### Do:
- Do preserve the dark, minimal, hand-drawn character established by the avatar.
- Do keep text, focus and disclosure affordances legible against the textured canvas.
- Do treat chapter-specific colors and content as provisional, with room for later identities.

### Don't:
- Don't replace the quiet outline world with realistic, glossy or three-dimensional imagery.
- Don't turn the passive locked rows into misleading controls.
- Don't use sentimental clichés or visual motifs that reveal the story's planned surprises.
