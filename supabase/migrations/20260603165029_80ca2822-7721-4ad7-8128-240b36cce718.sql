
DELETE FROM public.listing_claims WHERE listing_id IN (SELECT id FROM public.roasters WHERE name IN ('QA Test Roaster','QA Reject Roaster','QA Approve Flow','QA Reject Flow','QA Unique-Index Test'));
DELETE FROM public.roasters WHERE name IN ('QA Test Roaster','QA Reject Roaster','QA Approve Flow','QA Reject Flow','QA Unique-Index Test');
