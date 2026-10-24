---
name: "День за днём"
description: A calm personal daily action journal with recorded times at its center.
colors:
  surface: "#f2f3ee"
  ink: "#20231f"
  muted: "#62665d"
  line: "#c9ccc3"
  green: "#304f40"
  green-soft: "#e4ebe2"
  green-hover: "#243e31"
  saved-hover: "#d6e2d4"
  control-hover: "#e5e7df"
  accent: "#bc321c"
  field: "#fafbf7"
  field-border: "#83887b"
  danger: "#9c321e"
  danger-hover: "#7e2718"
typography:
  headline:
    fontFamily: "Cantarell, sans-serif"
    fontSize: "clamp(32px, 5.1vw, 48px)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  day-heading:
    fontFamily: "Cantarell, sans-serif"
    fontSize: "27px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Cantarell, sans-serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  timestamp:
    fontFamily: "Cantarell, sans-serif"
    fontSize: "30px"
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Cantarell, sans-serif"
    fontSize: "17px"
    lineHeight: 1.5
  label:
    fontFamily: "Cantarell, sans-serif"
    fontSize: "14px"
  button:
    fontFamily: "Cantarell, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  time: "5px"
  checkbox: "6px"
  control: "8px"
  toast: "10px"
  day: "12px"
  dialog: "14px"
  circular: "50%"
spacing:
  action-block: "30px"
  action-indent: "65px"
  action-gap: "20px"
  form-gap: "24px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.surface}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "12px 22px"
  button-primary-hover:
    backgroundColor: "{colors.green-hover}"
  button-saved:
    backgroundColor: "{colors.green-soft}"
    textColor: "{colors.green}"
    rounded: "{rounded.control}"
    padding: "12px 22px"
  button-saved-hover:
    backgroundColor: "{colors.saved-hover}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "12px 22px"
  field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
    width: "100%"
  day-selected:
    backgroundColor: "{colors.green}"
    textColor: "{colors.surface}"
    rounded: "{rounded.day}"
    padding: "7px 2px 12px"
  time-chip:
    backgroundColor: "{colors.green-soft}"
    textColor: "{colors.green}"
    rounded: "{rounded.time}"
    padding: "4px 9px"
---

# Design System: День за днём

## Overview

**Creative North Star: "The Daily Action Journal"**

A calm, readable place to record an action and return to its time. The limestone surface, ink and locally hosted Cantarell inherit the studio’s visual foundation. Deep green gives actions and saved facts their own quiet identity. This document governs only the `todo/` route; the studio and story retain their own design authority.

Dates, status and existing facts lead the hierarchy. A single unboxed list keeps the experience practical and personal, with no decorative imagery or competing dashboard summaries.

**Key Characteristics:**
- Recorded times remain prominent and easy to scan.
- Flat, unboxed rows use fine rules and generous spacing.
- Green identifies actions, selected dates and saved states.
- Forms expand inline; destructive confirmation uses a native dialog.

## Colors

Cool limestone and muted olive-grey support a restrained green action palette. The frontmatter records the source values.

### Primary
- **Deep Journal Green** (`green`): primary actions, selected days, saved statuses, checkboxes and the brand mark.
- **Soft Saved Green** (`green-soft`): saved-action buttons, saved icons and timestamp chips.
- **Deep Action Hover** (`green-hover`) and **Saved Action Hover** (`saved-hover`): distinguish hover within their respective button states.

### Neutral
- **Cool Limestone** (`surface`): the page and confirmation dialog, and text on green controls.
- **Near-black Ink** (`ink`): headings, primary text and input content.
- **Quiet Olive-grey** (`muted`): supporting copy, unsaved status, navigation and metadata.
- **Pale Stone Rule** (`line`): horizontal boundaries and the native date field’s underline.
- **Control Stone** (`control-hover`): neutral action icons and hover backgrounds.
- **Light Field** (`field`) and **Field Stroke** (`field-border`): editable fields and unchecked controls.

The inherited vermilion (`accent`) marks keyboard focus. Brick red (`danger`) and its deeper hover state (`danger-hover`) are reserved for the destructive dialog action. Storage errors use a pale warm surface and dark brick text; they remain visibly distinct from successful saves.

**The Saved Fact Rule.** Use green state and a visible timestamp together to communicate a recorded action; color alone is insufficient.

## Typography

**Display and Body Font:** locally hosted variable Cantarell, falling back to sans-serif. No secondary display family is introduced on this route.

### Hierarchy
- **Headline:** a compact, medium-weight introduction with tight tracking. On mobile it uses `clamp(30px, 8.4vw, 40px)` and a maximum width of (350px).
- **Day heading:** the selected day, reduced to (25px) on mobile; its supporting calendar date is muted.
- **Title:** action names, reduced to (21px) on mobile. Long user titles wrap within the row.
- **Timestamp:** the latest recorded time, reduced to (29px) on mobile. Use tabular numerals for stable scanning.
- **Body:** default reading text; introductory supporting copy uses (18px), reduced to (16px) on mobile.
- **Label:** compact navigation and date metadata. Secondary schedules and repeated-entry history use (13px); selected weekday labels remain smaller.

**The Time First Rule.** Keep the recorded time larger than supporting status and schedule text. Do not replace exact times with achievement language.

## Layout

A centered shell has a maximum width of (880px), with side space of (32px) per edge on desktop. The header is separated by a fine rule. The introduction gives way to a selected-day toolbar, a Monday–Sunday strip, action rows and the local-save footer.

Desktop action rows place an icon and title above paired status and action controls. Status, controls and history align to a shared inset of (65px). Rows use a bottom rule and vertical padding of (30px). Expanded forms remain in normal document flow; the add form has a maximum width of (620px), and the timezone selector a maximum width of (500px).

At (620px) and below, shell gutters become (20px), the header and introduction tighten, the date toolbar can wrap, and the week strip compresses. Action status and controls stack; recording buttons fill the available width. Row padding becomes (24px) and the shared inset becomes (55px). At (360px) and below, gutters become (16px), row/history insets disappear, the settings label hides while its named icon button remains, and action-kind options stack.

Source extraction establishes these values; this file does not claim independent browser measurements.

## Elevation & Depth

The journal is flat at rest. Rules, tonal states and spacing separate content; action rows have no card shells or shadows. A saved toast is the single raised element, using `0 8px 24px rgb(32 35 31 / .16)`. The native dialog uses a translucent backdrop (`rgb(23 29 22 / .48)`) without an ornamental shadow.

Only the save toast animates: a short reveal (180ms) using `cubic-bezier(.16, 1, .3, 1)`. It runs only when reduced motion is not requested.

## Shapes

Soft control corners make touch actions approachable while the list stays open and rectangular. Primary buttons, icon buttons and fields share the control radius; day selectors are slightly rounder, and the native dialog is rounder again. Circles identify the brand and action symbols. Timestamp chips and checkboxes use smaller corners.

Icons use unfilled, round-ended strokes (1.6px) within a default square (22px). They support text and accessible names rather than carrying action meaning alone.

## Components

### Action rows and recorded evidence

Each unboxed row has a symbol, action name and schedule label. Unsaved status is muted. A recorded action changes its symbol and status to green, shows the latest time prominently and gives repeated actions a softer recording button with a plus. The action remains available for intentional later repetitions.

Native disclosure reveals all repeated timestamps as small green chips; the latest entry can be undone from the disclosure. Earlier days show their facts without recording controls. Archived actions retain their historical evidence and can display a quiet archive label.

### Buttons and checkboxes

Primary actions use solid green, limestone text and a minimum height of (48px). Saved repeat actions use soft green with dark green text. The destructive button uses brick red only inside confirmation. Text actions are unboxed, with underline and green text on hover. Most icon and text controls use a minimum height of (44px); the week arrows and footer timezone shortcut are more compact.

Checkboxes retain native input semantics while drawing a gently rounded square (26px) and a limestone check on a green checked surface. The associated text also turns green. Disabled controls reduce opacity and use the default cursor.

Keyboard focus uses a vermilion outline (2px), offset by (4px). Segmented choices instead outline their visible label at an offset of (2px).

### Calendar navigation

The seven-column week strip sits between two fine horizontal rules, with previous/next arrows outside it. The selected day has a solid green surface and `aria-current="date"`. Today receives an underline when another day is selected; a dot marks a day containing recorded facts. Future days are disabled. A native date input supports direct historical navigation, with a separate return-to-today text action when needed.

### Inline forms and settings

The add control expands its form below the list and moves focus into the action title. A segmented schedule choice separates one-off and daily actions. Daily actions reveal native radio choices for a checkbox or multiple timestamps. Labels remain visible above fields; supporting explanations stay muted below their related choice.

Timezone settings expand below the header, using a labeled native select. Both inline surfaces support Escape and return focus to their opener. Form validation uses the browser’s native validation UI.

### Confirmation and feedback

Deletion opens a native modal dialog, names the action and explains that earlier facts remain. The initial focus is on the keep action. Escape, cancel and backdrop clicks close the dialog; confirmation archives the action.

A green toast announces successful changes and includes a time when recording. Its maximum width leaves side clearance on small screens, and its bottom position respects the safe area. Storage failures appear in a persistent warm alert and change the save label; they must not look like successful completion. The footer states the actual browser-local storage scope and shows the active timezone.

## Do's and Don'ts

### Do:
- **Do** retain the local Cantarell family, limestone surface and ink foundation.
- **Do** put real dates, recorded status and exact times before secondary controls.
- **Do** preserve visible keyboard focus, native control semantics and announced feedback.
- **Do** stack status and full-width recording controls on small screens.
- **Do** keep additions and settings inline and use a native dialog for deletion.

### Don't:
- **Don't** add card shells or ambient shadows to action rows.
- **Don't** invent recorded actions, completion scores, streaks or pressure to perform.
- **Don't** hide the recorded time when showing a completed state.
- **Don't** show historical days as editable or future dates as available.
- **Don't** imply remote synchronization or successful saving after storage failure.
