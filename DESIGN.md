---
name: "22:18"
description: An independent design studio’s work-led editorial catalogue.
colors:
  surface: "#f2f3ee"
  ink: "#20231f"
  secondary: "#62665d"
  line: "#c9ccc3"
  accent: "#bc321c"
  project-placeholder: "#d7d9d0"
typography:
  display:
    fontFamily: "Red Hat Display, sans-serif"
    fontSize: "clamp(120px,32.2vw,525px)"
    fontWeight: 400
    lineHeight: 0.91
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Cantarell, sans-serif"
    fontSize: "clamp(36px,4.7vw,72px)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  statement:
    fontFamily: "Cantarell, sans-serif"
    fontSize: "clamp(32px,4vw,62px)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Cantarell, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Cantarell, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Cantarell, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  square: "0"
  circular: "50%"
spacing:
  gutter: "clamp(20px,4vw,72px)"
  grid-column: "32px"
  grid-row: "68px"
  form-gap: "30px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "16px 22px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "12px 0"
    width: "100%"
  filter:
    backgroundColor: "transparent"
    textColor: "{colors.secondary}"
    typography: "{typography.label}"
    padding: "9px 0"
  filter-selected:
    textColor: "{colors.ink}"
  project-open:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.circular}"
    width: "44px"
    height: "44px"
  project-open-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
---

# Design System: 22:18

## Overview

**Creative North Star: "The Editorial Catalogue"**

An editorial catalogue for an independent design studio. Cool limestone, near-black typography and a rare vermilion signal frame the work. Oversized numerical typography supplies the identity; the rest of the interface is clear, quiet and precise.

Project imagery carries its own color and material character. Unboxed compositions, thin rules and changing column widths create rhythm without decorative interface chrome. This system governs the studio homepage; the preserved story has its own authority in story/DESIGN.md.

**Key Characteristics:**
- Expressive numerical wordmark; restrained supporting typography.
- Unboxed project imagery and asymmetric desktop spreads.
- Flat surfaces, thin rules and clear interactive states.
- Responsive reflow and reduced-motion support.

## Colors

The neutral palette feels like cool limestone and printed ink; vermilion punctuates the identity and interaction.

### Primary
- **Vermilion** (`accent`): the wordmark colon, contact punctuation, interactive hover color and keyboard focus.

### Neutral
- **Cool Limestone** (`surface`): the page, dialog and circular project action.
- **Near-black Ink** (`ink`): primary text, strong section rules and the primary action.
- **Quiet Olive-grey** (`secondary`): descriptions, metadata, placeholders and field rules.
- **Pale Stone Rule** (`line`): secondary dividers, accordion boundaries and footer separation.
- **Unloaded Artwork** (`project-placeholder`): the image frame background before artwork appears.

**The Work First Rule.** Keep interface surfaces quiet enough for project imagery to carry the visual variety.

## Typography

**Display Font:** Red Hat Display, falling back to sans-serif. A locally hosted regular face supplies the numerical identity.

**Body Font:** Cantarell, falling back to sans-serif. The locally hosted variable family supplies headings, body copy, metadata and controls.

The pairing combines expressive, tightly spaced numerals with an approachable reading face. Headings use regular weight; scale and spacing establish hierarchy.

### Hierarchy
- **Display:** the large studio wordmark; its colon receives the accent. The frontmatter captures the desktop clamp; above the widest breakpoint the size is capped, while mobile uses viewport sizing.
- **Headline:** studio introduction headings. The contact heading is a larger, tightly spaced contextual variation.
- **Statement:** the split opening statement, with its second line in the secondary text color.
- **Title:** project names below images.
- **Body:** readable descriptive copy, with studio copy limited to approximately 50 characters per line in CSS.
- **Label:** controls, metadata and navigation. Supporting index text and dates also use a smaller size (13px).

**The Identity Scale Rule.** Reserve the largest Red Hat Display numerals for the studio identity; use Cantarell for readable content and controls.

## Layout

The centered page wrapper has a maximum width (1680px) including its fluid side gutters. The desktop masthead uses three columns. The opening statement is a three-part split; long-form studio and contact sections use paired columns with generous internal gaps.

The work catalogue uses twelve columns: alternating seven/five and five/seven spans, then a full-width project. The narrower second project and the following wide project are vertically offset (110px and 100px). Artwork and its metadata share an edge; the metadata uses a flexible name column and a compact year column. Image proportions vary with the spread, while filtered results use equal six-column spans and landscape crops.

At the tablet breakpoint (1050px), the hero index disappears, gutters within the project grid narrow and project offsets reduce. At the mobile breakpoint (700px), the catalogue becomes one column, offsets disappear, studio/contact sections stack, and forms become one column. The masthead keeps the logo and direct navigation while hiding its descriptive subtitle. Most project images become landscape; the illustration keeps a taller crop. At the compact breakpoint (380px), the opening statement stacks and navigation tightens. The wide breakpoint (1680px) caps the numerical wordmark.

This documentation is extracted from source, not measured in a rendered browser. Exact breakpoints and motion values are also recorded in the sidecar.

## Elevation & Depth

**The Flat Surface Rule.** Use spacing, contrast and thin rules for separation. The implemented studio interface has no box shadows.

Artwork supplies material depth. The project dialog overlays the page with a dark translucent backdrop; it has no ornamental frame or shadow. The circular project action is a tonal overlay on imagery.

## Shapes

Rectangular image frames, square fields and square buttons form the base language. The only recurring fully rounded control is the circular project action. Fine horizontal rules organize sections, filters, accordions and inputs. Icons use simple unfilled strokes (1.5px) within a compact square (22px).

## Components

### Buttons and text actions

The primary button is an ink rectangle with limestone text and an arrow. Hover changes its background to vermilion over a short transition (0.2s). The button fills its available width on mobile. Text actions use open inline layouts, deliberate icon gaps and accent hover; the contact action adds an underline. Disabled buttons reduce opacity and use the default cursor.

All links, buttons, summaries and fields share a vermilion keyboard outline (2px) offset from the element (6px). The skip link becomes a solid ink panel when focused.

### Navigation

A small numerical logo anchors a direct three-link navigation. Labels stay sentence case and compact. Hover uses the accent; mobile keeps all three destinations and removes the contact arrow at the mobile breakpoint. There is no invented active-page treatment.

### Category filters

Unboxed text buttons use muted text by default, ink on hover, and an ink bottom rule when selected. Selection is represented by `aria-pressed`. JavaScript reveals the filter controls, updates visible projects and announces the result count; without JavaScript the full catalogue remains visible.

### Project entries and dialog

Images have no card shell, padding or radius. Name, category and year sit below the image. An overlaid circular arrow reverses its tones and rotates on image-link hover or keyboard focus. On hover-capable devices the image scales gently (1.035) within its clipped frame.

Four project links enhance to a native modal dialog containing artwork, concept context and description. The fallback destination is the project image. The illustrated project links directly to the separate story route. The dialog has a compact top bar and a close control (44px); Escape and backdrop clicks close it, and closing restores focus to the opener. Its content becomes one column on mobile.

### Expandable rows

Native details/summary rows use thin top rules, large regular text and a two-stroke plus. Opening folds the vertical stroke flat. The same pattern appears in the brief section at a smaller text size.

### Fields and local brief

Fields are transparent, square and defined by a single bottom rule. Labels remain above the fields; placeholders use the secondary color. The desktop form pairs name and contact fields, then places the task field below. Required fields and the status message provide validation feedback. The action prepares a downloadable text brief locally; the interface must not suggest that it sends a message.

### Motion

A shared easing curve gives the wordmark, opening copy, project image and arrow a settled motion. Intro movement is a small vertical displacement (12px); no scroll-triggered reveal hides content. Reduced-motion preference removes animations and transitions and disables smooth scrolling.

## Do's and Don'ts

### Do:
- **Do** use the existing color variables and locally hosted font families.
- **Do** give project imagery generous space and place metadata below it.
- **Do** preserve visible keyboard focus and the selected filter underline.
- **Do** collapse the project grid to a single column on small screens.
- **Do** describe portfolio concepts honestly and keep the story’s visual system separate.

### Don't:
- **Don't** add rounded card shells or ambient shadows to the studio grid.
- **Don't** turn the vermilion accent into a large decorative background.
- **Don't** substitute the story’s handwritten fonts or dark palette into studio pages.
- **Don't** introduce motion that ignores the reduced-motion preference.
