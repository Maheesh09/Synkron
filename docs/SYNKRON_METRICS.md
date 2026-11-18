# Synkron - Measured Performance Report

**System:** Synkron, an AI agent that detects documentation drift from a GitHub push and opens a corrective pull request.
**Benchmark date:** 13 September 2026
**Benchmark repository:** `Maheesh09/synkron-demo` (repo_id `1368481307`)
**Backend:** `Maheesh09/synkron-backend` · **Frontend:** `Maheesh09/Synkron`

---

## 1. How this was measured

Every number below comes from the system's own instrumentation, written to MongoDB during real pipeline runs. Nothing is estimated.

A purpose-built benchmark repository was seeded with a small documented Python service (`README.md`, `docs/api.md`, `docs/auth.md` and five source modules), then driven through a scripted sequence of 30 commits.

**The key methodological point:** for each commit, the expected outcome was recorded in a log file *before the commit was pushed* and before Synkron saw it. The comparison afterwards is therefore a prediction tested against reality, not a narrative assembled from results.

The commit mix was deliberate:

| Category | Count | Expected behaviour |
| --- | --- | --- |
| New endpoints and features | 10 | Should open a documentation PR |
| Changes to documented behaviour | 6 | Should open a documentation PR |
| Bug fixes with no API change | 4 | Should be filtered out |
| Config, lockfile and formatting | 4 | Should be filtered out |
| Test-only commits | 3 | Should be filtered out |
| Documentation-only commits | 3 | Should be filtered out |

Instrumentation added for this benchmark: per-agent stage timing, Gemini token and cost accounting per run, a recorded reason for every skip, and merge/edit flags written by the feedback loop when a human merges a generated PR.

---

## 2. Headline results

| Metric | Value | Sample |
| --- | --- | --- |
| Precision (no false-positive PRs) | **100%** | 14 non-doc-worthy commits |
| Recall | **75%** | 16 doc-worthy commits |
| Overall classification accuracy | **83.9%** | 30 commits |
| Pipeline failure rate | **0%** | 31 runs |
| Median push-to-PR latency | **31.5s** | 12 completed runs |
| Cost per completed run | **$0.0017** | 12 completed runs |
| Line similarity, generated vs merged | **87.1% median** | 10 edited documents |
| Pushes filtered before any model call | **58% of skips, under 2s** | 19 skipped runs |

---

## 3. Classification performance

The confusion matrix, built by comparing the pre-recorded expectation for each commit against the status Synkron actually wrote.

| | Opened a PR | Filtered out |
| --- | --- | --- |
| **Doc change needed** | 12 (true positive) | 4 (false negative) |
| **No doc change needed** | 0 (false positive) | 14 (true negative) |

- **Precision: 100%** - across 14 commits that should not have touched documentation, Synkron opened zero unnecessary pull requests.
- **Recall: 75%** - 12 of 16 doc-worthy commits produced a PR.
- **Accuracy: 83.9%**

Precision is the more consequential of the two. A documentation bot that opens noise PRs gets uninstalled within a week regardless of how well it writes; one that occasionally misses a change is merely incomplete.

### The four misses, examined

All four false negatives reached the final agent and were rejected with `no_doc_updates`, meaning the pipeline correctly located the relevant document and then judged the existing text still accurate. Two of those judgments were defensible and two were wrong.

| Commit | Reason recorded | Assessment |
| --- | --- | --- |
| Raised pagination cap 100 → 250 | `no_doc_updates` | **Correct.** The cap value was never stated in `docs/api.md`, so there was nothing to contradict. |
| Changed default database to postgres | `no_doc_updates` | **Defensible.** The README lists the variable but not a default that the change contradicts. |
| Malformed tokens 401 → 400 | `no_doc_updates` | **Genuine miss.** `docs/auth.md` explicitly states 401. |
| Added idempotency key parameter | `no_doc_updates` | **Genuine miss.** The request body table should have gained a row. |

Discounting the two correct rejections, effective recall on genuinely-missed documentation is **14 of 16, or 87.5%**, with both remaining failures isolated to the Doc Writer stage rather than the filtering stages.

---

## 4. Latency

Wall-clock time from webhook receipt to pull request opened, across 12 completed runs.

| Statistic | Value |
| --- | --- |
| Median (p50) | 31.5s |
| Mean | 32.8s |
| p90 | 48.9s |
| p95 | 49.6s |
| Minimum | 16.6s |
| Maximum | 50.1s |

With n = 12, the p95 is effectively the second-slowest observed run. The median and the range are the defensible figures; the p95 should be quoted only alongside its sample size.

### Per-agent breakdown

| Agent | p50 | p95 | Share of pipeline time |
| --- | --- | --- | --- |
| Code Analyzer | 1.8s | 10.4s | 10.7% |
| Impact Mapper | 2.2s | 3.2s | 7.2% |
| Doc Writer | 18.7s | 33.2s | **55.6%** |
| PR Creator | 8.5s | 10.3s | 26.5% |

The Doc Writer dominates, which is expected since it is the only agent generating long-form text. It is also where both genuine accuracy failures occurred, making it the clear target for any future work on either speed or quality.

---

## 5. Filtering behaviour and cost control

Of 31 runs, 19 were filtered without producing a pull request. The recorded reason shows *where* in the pipeline each was rejected, which directly determines what it cost.

| Skip reason | Count | Share | Stage reached |
| --- | --- | --- | --- |
| `no_doc_hints` | 11 | 58% | Analyzer only - no model call |
| `no_doc_updates` | 6 | 32% | Full pipeline through Doc Writer |
| `no_affected_docs` | 2 | 11% | Analyzer and Impact Mapper |

Eleven runs were rejected on the diff alone, most in **0.5 to 0.6 seconds**, before a single token was spent. This is the mechanism that bounds operating cost on a repository where most commits need no documentation at all.

The six `no_doc_updates` skips took 11 to 22 seconds each and did consume model calls. That is measurable leakage: the cheap filter caught most noise, and the remainder reached the expensive stage before being rejected. Tightening the Impact Mapper is the obvious place to reclaim it.

---

## 6. Output quality

Quality is measured directly rather than by self-assessment. When a human merges a generated PR, the feedback loop diffs what the agent wrote against what was actually merged and stores both.

| Metric | Value |
| --- | --- |
| Documents generated | 21 |
| Documents merged by a human | 12 |
| Accepted verbatim, no edits | 2 |
| Merged after human edits | 10 |
| Verbatim acceptance rate | 16.7% |

Across the 10 edited documents:

| Metric | Value |
| --- | --- |
| Median line similarity, generated vs merged | 87.1% |
| Mean line similarity | 85.4% |
| Median lines changed by the human | +9 / −1 |

### Reading these numbers honestly

A 16.7% verbatim acceptance rate looks weak in isolation and is more informative than it first appears. The edit pattern is what matters: a median of **nine lines added and one line removed**, with 87% of the generated text surviving untouched.

The failure mode is therefore **incompleteness, not incorrectness**. Humans were adding sections the agent missed, not deleting things it got wrong. That distinction is significant in practice, because missing content is cheap to spot and add during review, whereas confidently wrong content must first be detected, which is the expensive failure mode for generated documentation.

Edits by document type: README 6, API reference 3, authentication 1.

---

## 7. Cost

| Metric | Value |
| --- | --- |
| Total spend across the benchmark | $0.0202 |
| Cost per completed run | $0.00168 |
| Median tokens per run | 5,850 |
| Gemini calls per run | 4.8 |

Cost is derived from token counts captured from the model's usage metadata on every call, multiplied by the published per-million-token rate. The price table lives in `gemini.py` and should be re-checked against current pricing before these figures are quoted externally.

---

## 8. Reliability

| Metric | Value |
| --- | --- |
| Total pipeline runs | 31 |
| Completed | 12 |
| Skipped | 19 |
| Failed | **0** |
| Success rate, excluding skips | 100% (12/12) |

No run raised an unhandled exception across the benchmark. Every run reached a terminal state with a recorded reason.

---

## 9. Known limitations of this benchmark

Stated plainly, because a results document that omits them is not worth trusting.

- **Single repository, single day.** All 31 runs came from one seeded repository in one session. Nothing here demonstrates behaviour across varied codebases, languages or documentation styles.
- **Small sample for tail statistics.** With 12 completed runs, the p95 latency is effectively the second-slowest run. The median and range are sound; the p95 is not.
- **Synthetic commits.** The commit sequence was written to exercise specific paths. It is representative in shape but is not drawn from real development history.
- **Self-graded merges.** The same person wrote the benchmark and decided which generated documents to edit before merging. The edit decisions were made against the actual diffs, but they were not blind.
- **Six of twelve merges registered feedback.** Only 6 runs recorded a `merged_at` timestamp against 12 merged documents, so the acceptance figures derive from the PRs that did fire the merge webhook. This is a known instrumentation gap, not a corrected result.
- **Manual baseline not yet measured.** No timed comparison against writing the same documentation by hand exists, so no claim is made about time saved.

---

## 10. Instrumentation reference

| Field | Collection | Purpose |
| --- | --- | --- |
| `duration_seconds` | `pipeline_runs` | End-to-end wall-clock time |
| `stage_ms` | `pipeline_runs` | Per-agent timing in milliseconds |
| `skip_reason` | `pipeline_runs` | Which filter stage rejected the run |
| `error_type` | `pipeline_runs` | Exception class for failure grouping |
| `tokens_total`, `cost_usd`, `gemini_calls` | `pipeline_runs` | Token accounting per run |
| `merged_at` | `pipeline_runs` | Set when a generated PR is merged |
| `ai_written` | `pipeline_run_details` | Exact text the agent produced |
| `merged`, `edited` | `pipeline_run_details` | Whether a human merged it, and whether they changed it |
| `human_corrected`, `correction_delta` | `correction_patterns` | Merged text and unified diff against the generated version |

Reproduction scripts: `seed_demo.py` builds the benchmark repository and pushes the commit sequence, `compare_expectations.py` produces the confusion matrix, and `metrics_report.py` produces every other figure in this document.
