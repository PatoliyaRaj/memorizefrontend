/**
 * Markdown Utilities for formatting, cleaning, and normalizing text content.
 */

/**
 * Normalizes symbols and bullet points in a text block for proper Markdown list parsing.
 * - Converts non-standard bullets (~, •, –, —) to standard hyphens (-).
 * - Converts line-starting '->' or '→' to standard bullet lists with unicode arrows ('- →').
 * - Normalizes inline '->' to unicode arrow '→'.
 */
export function normalizeMarkdown(text?: string | null): string {
  if (!text) return '';

  return text
    // Replace ~ • – — at the start of any line with -
    .replace(/^[~•–—]\s+/gm, '- ')
    // Replace -> or → at the start of any line with - →
    .replace(/^(?:->|→)\s+/gm, '- → ')
    // Replace inline -> with unicode arrow →
    .replace(/->/g, '→')
    .trim();
}

/**
 * Strips any leading list bullet markers (-, *, •, ~, →, etc.) from a single string.
 * This is useful for displaying raw items (like takeaways) in a custom bulleted list.
 */
export function stripLeadingBullet(text?: string | null): string {
  if (!text) return '';

  return text
    // Strip bullet markers at the beginning of the string (with optional space)
    .replace(/^[-\*•–—~]\s*/, '')
    // Strip arrow markers at the beginning of the string
    .replace(/^(?:->|→)\s*/, '')
    .trim();
}
