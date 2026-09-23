-- Kindling persistent storage for Supabase + Vercel
-- Run this entire file in Supabase SQL Editor.

create table if not exists public.kindling_articles (
  id text primary key,
  article jsonb not null,
  created_at bigint not null
);

create index if not exists kindling_articles_created_at_idx
  on public.kindling_articles (created_at desc);

alter table public.kindling_articles enable row level security;

-- The Vercel API uses the Supabase secret key on the server, so browser
-- clients never receive database credentials. No public table policy is needed.

insert into public.kindling_articles (id, article, created_at)
values (
  'seed-1',
  $$
  {
    "id": "seed-1",
    "title": "Why the desk finally has five names on it",
    "tag": "season opener",
    "excerpt": "We used to run this whole place off one shared login. That was the *first* mistake.",
    "body": "## The old way didn't hold\n\nWe used to run this whole place off one shared login. That was the *first* mistake — nobody owned a piece once it was published, and nobody could pull one back once it went out wrong.\n\nSo the desk grew. Five names now, not one: **Alvin** and **Yasha** hold the keys that can strike a piece out of the feed for good, and **Brittney**, **Marcus**, and **Priya** write without needing to ask anyone's permission first. That's the whole system. No approval queue, no editor reading over your shoulder — just a small, accountable room.\n\n# A note on the formatting\n\nIf you're reading this from the compose box, you've probably noticed you can lean on a word two ways: wrap it in single stars for *italic*, double stars for **bold**, and underscores for a proper _highlight_ — the kind that looks like it was dragged across the page with a mustard-yellow marker.\n\nA line starting with two hashes, like the one above this paragraph, becomes a heading big enough to break the page into chapters. One hash gets you something smaller, for a note along the way.\n\n# It also remembers\n\nEverything you publish here stays put. Close the tab, come back tomorrow, and the feed hasn't forgotten a thing — not what got added, and not what got deleted either.",
    "color": "linear-gradient(155deg,#b0492f,#1c1916)",
    "icon": "spark",
    "punchline": "five names, one feed",
    "author": "Alvin",
    "authorRole": "admin",
    "date": "today",
    "createdAt": 1700000000000,
    "image": null,
    "images": [],
    "draft": false
  }
  $$::jsonb,
  1700000000000
)
on conflict (id) do nothing;
