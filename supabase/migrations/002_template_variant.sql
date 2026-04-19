-- 002_template_variant.sql
--
-- Adds the `template_variant` column to `portfolios`. Each genre can ship
-- multiple template designs (variants); this column stores which variant
-- slug the user picked. NULL means "use the genre default" — the app's
-- pickTemplate() helper falls back to the genre's default variant.
--
-- Slug format is free-form text so we're not forced into a migration every
-- time a new variant lands. Validation lives in application code (the
-- registry lookup) — an unknown slug falls back to the default, not an error.

alter table portfolios
  add column if not exists template_variant text;

comment on column portfolios.template_variant is
  'Slug of the chosen template variant within the portfolio''s genre. NULL uses the genre default. See src/components/templates/registry.ts.';
