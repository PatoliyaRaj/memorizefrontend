import re
import yaml

with open('maindesighn.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract dark mode yaml
dark_yaml = content.split('---')[1]
dark_data = yaml.safe_load(dark_yaml)
dark_colors = dark_data['colors']

# Extract light mode yaml
light_match = re.search(r'```yaml\n(name: Cognitive Warmth.*?)\n```', content, re.DOTALL)
light_data = yaml.safe_load(light_match.group(1))
light_colors = light_data['colors']

css_content = """@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@theme {
"""

for key in dark_colors.keys():
    css_content += f"  --color-{key}: var(--{key});\n"

# Extra mappings from current CSS
extra_colors = [
    'surface-void', 'surface-base', 'surface-raised', 'surface-overlay', 'surface-hover',
    'border-subtle', 'border-default', 'border-strong', 'border-brand',
    'text-primary', 'text-secondary', 'text-tertiary', 'text-disabled', 'text-brand',
    'mastery-unseen', 'mastery-weak', 'mastery-learning', 'mastery-strong', 'mastery-mastered',
    'success-text', 'error-text', 'warning-text', 'info-text',
    'success-bg', 'error-bg', 'warning-bg', 'info-bg',
    'success-border', 'error-border', 'warning-border', 'info-border'
]

for extra in extra_colors:
    css_content += f"  --color-{extra}: var(--{extra});\n"


css_content += """
  --font-display: var(--font-display);
  --font-body: var(--font-body);
  --font-mono: var(--font-mono);

  --shadow-sm: var(--shadow-sm);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-glow: var(--shadow-glow);
  
  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-xl: var(--radius-xl);
  --radius-2xl: var(--radius-2xl);
  --radius-full: 9999px;

  /* Typography Sizes */
  --text-display: 3.5rem;
  --text-headline-xl: 3rem;
  --text-headline-lg: 2rem;
  --text-headline-lg-mobile: 1.75rem;
  --text-body-base: 1rem;
  --text-body-sm: 0.875rem;
  --text-data-mono: 0.75rem;

  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;
  --spacing-margin-mobile: 1rem;
  --spacing-margin-desktop: 2.5rem;
  --spacing-gutter: 1.5rem;
}

@custom-variant dark (&:where(.dark, .dark *));

/* ════════════════════════════════════════════════════════════════════════════ */
/* Base Variables: LIGHT MODE (Light-First default variable definitions)        */
/* ════════════════════════════════════════════════════════════════════════════ */
:root {
  --font-display: 'Syne', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;

  /* Theme Colors (Light) */
"""

for key, value in light_colors.items():
    css_content += f"  --{key}: {value};\n"

css_content += """
  /* Extra Light Mode Colors (Synthesized or matching design) */
  --surface-void: #F7FFFE;
  --surface-base: #FFFFFF;
  --surface-raised: #F0FDFB;
  --surface-overlay: #FFFFFF;
  --surface-hover: #E6FAF7;

  --border-subtle: rgba(13, 148, 136, 0.06);
  --border-default: rgba(13, 148, 136, 0.12);
  --border-strong: rgba(13, 148, 136, 0.24);
  --border-brand: rgba(13, 148, 136, 0.5);

  --text-primary: #0D1F1C;
  --text-secondary: #3A6B65;
  --text-tertiary: #6B9E99;
  --text-disabled: #9BBFBB;
  --text-brand: #0D9488;

  --shadow-sm: 0 1px 2px rgba(13, 148, 136, 0.06);
  --shadow-md: 0 4px 12px rgba(13, 148, 136, 0.10), 0 1px 3px rgba(13, 148, 136, 0.06);
  --shadow-lg: 0 12px 32px rgba(13, 148, 136, 0.12), 0 4px 8px rgba(13, 148, 136, 0.06);
  --shadow-glow: 0 0 24px rgba(13, 148, 136, 0.15);

  --mastery-unseen: #E8F5F3;
  --mastery-weak: #FCA5A5;
  --mastery-learning: #FCD34D;
  --mastery-strong: #86EFAC;
  --mastery-mastered: #2DD4BF;

  --success-bg: rgba(16, 185, 129, 0.08);
  --success-text: #10B981;
  --success-border: rgba(16, 185, 129, 0.20);
  --error-bg: rgba(239, 68, 68, 0.08);
  --error-text: #EF4444;
  --error-border: rgba(239, 68, 68, 0.20);
  --warning-bg: rgba(245, 158, 11, 0.08);
  --warning-text: #F59E0B;
  --warning-border: rgba(245, 158, 11, 0.20);
  --info-bg: rgba(59, 130, 246, 0.08);
  --info-text: #3B82F6;
  --info-border: rgba(59, 130, 246, 0.20);

  --radius: 0.5rem;
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
}

/* ════════════════════════════════════════════════════════════════════════════ */
/* DARK MODE overrides                                                          */
/* ════════════════════════════════════════════════════════════════════════════ */
.dark {
  /* Theme Colors (Dark) */
"""

for key, value in dark_colors.items():
    css_content += f"  --{key}: {value};\n"

css_content += """
  /* Extra Dark Mode Colors */
  --surface-void: #060A09;
  --surface-base: #0B1210;
  --surface-raised: #121C1A;
  --surface-overlay: #19271F;
  --surface-hover: #1F312D;

  --border-subtle: rgba(20, 184, 166, 0.06);
  --border-default: rgba(20, 184, 166, 0.12);
  --border-strong: rgba(20, 184, 166, 0.24);
  --border-brand: rgba(20, 184, 166, 0.50);

  --text-primary: #E8F5F3;
  --text-secondary: #9BBFBB;
  --text-tertiary: #5C8A85;
  --text-disabled: #3A5C58;
  --text-brand: #2DD4BF;

  --shadow-sm: 0 1px 2px rgba(14, 165, 153, 0.08);
  --shadow-md: 0 4px 12px rgba(14, 165, 153, 0.12), 0 1px 3px rgba(14, 165, 153, 0.06);
  --shadow-lg: 0 12px 32px rgba(14, 165, 153, 0.16), 0 4px 8px rgba(14, 165, 153, 0.08);
  --shadow-glow: 0 0 24px rgba(20, 184, 166, 0.20);

  --mastery-unseen: #2A3530;
  --mastery-weak: #4A1A1A;
  --mastery-learning: #3A2A0A;
  --mastery-strong: #0A2A20;
  --mastery-mastered: #134E4A;
}

/* ════════════════════════════════════════════════════════════════════════════ */
/* Base Styles                                                                  */
/* ════════════════════════════════════════════════════════════════════════════ */
@layer base {
  html {
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: var(--surface-void);
    color: var(--text-primary);
    font-size: var(--text-body-base);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    font-weight: 700;
  }
}

/* Landing Page Animations & Utilities */
@layer utilities {
  .bg-grid-pattern {
    background-image: radial-gradient(rgba(107, 216, 203, 0.2) 1px, transparent 1px);
    background-size: 24px 24px;
  }
}
"""

with open('src/app/globals.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

print("Updated globals.css!")
