# GA4 event validation checklist

1. Verify `G-08MTZ3F4Q1` is the intended property and that consent/privacy notices match your implementation and audience.
2. Use GA4 DebugView or browser Tag Assistant to confirm page_view events on the homepage, calculator pages, guides and reference pages.
3. Test calculator inputs and submissions; inspect existing event names before adding anything to avoid duplicate completion events.
4. If a completion event is absent, add it at the successful calculation result handler (not on every input keystroke). Use a consistent event such as `calculator_complete`, with non-sensitive parameters such as `calculator_name`, `page_type` and `unit_system`. Do not send user-entered dimensions if they could be sensitive or unnecessary.
5. Mark only meaningful business outcomes as key events; calculator completion is an engagement event and is not necessarily a revenue conversion.
6. In GA4, inspect Traffic acquisition, Landing page and Events after collecting enough traffic. Record observation dates and avoid drawing conclusions from tiny samples.
