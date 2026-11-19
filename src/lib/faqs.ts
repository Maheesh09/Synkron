/** Also rendered as FAQPage structured data in __root.tsx, so keep answers factual. */
export const FAQS = [
  {
    q: "Will Synkron change my main branch?",
    a: "No. Synkron commits to its own branch, named synkron/docs-<commit>, and opens a pull request into your default branch. Nothing merges until someone on your team approves it.",
  },
  {
    q: "What happens if I don't want a pull request?",
    a: "Close it. Synkron's pull requests are suggestions, not required changes. If you edit one before merging instead, Synkron records the difference and applies the correction to later updates.",
  },
  {
    q: "Is my code private and secure?",
    a: "Yes. Sign-in uses GitHub through Firebase, and the GitHub App asks only for metadata read, contents write and pull requests write. Source code is read during a run and never stored; Synkron keeps only the documentation it wrote and your edits to it.",
  },
  {
    q: "Which documentation formats are supported?",
    a: "Markdown, MDX and reStructuredText files in your repository, plus OpenAPI specs in YAML or JSON.",
  },
  {
    q: "Will this slow down my builds?",
    a: "No. Synkron runs asynchronously from a webhook, completely outside your CI. In our benchmark a pull request appeared a median of 31.5 seconds after the push, and commits that need no documentation were dismissed in under two seconds.",
  },
];
