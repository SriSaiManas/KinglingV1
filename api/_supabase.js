const { createClient } = require('@supabase/supabase-js');

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL and SUPABASE_SECRET_KEY environment variables.');
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
}

const ACCOUNTS = [
  { username:'alvin', password:'Alvin123', role:'admin' },
  { username:'yasha', password:'Yasha123', role:'admin' },
  { username:'brittney', password:'Brittney123', role:'contributor' },
  { username:'marcus', password:'Marcus123', role:'contributor' },
  { username:'priya', password:'Priya123', role:'contributor' }
];

function getRequestUser(req) {
  const username = String(req.headers['x-kindling-username'] || '').trim().toLowerCase();
  const password = String(req.headers['x-kindling-password'] || '');
  return ACCOUNTS.find(a => a.username === username && a.password === password) || null;
}

function sendJson(res, status, payload) {
  res.status(status).json(payload);
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  return {};
}

function sortArticles(rows) {
  return rows
    .map(row => row.article)
    .sort((a,b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
}

async function getArticles(supabase) {
  const { data, error } = await supabase
    .from('kindling_articles')
    .select('id, article, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return sortArticles(data || []);
}

async function seedIfEmpty(supabase) {
  const { count, error } = await supabase
    .from('kindling_articles')
    .select('id', { count: 'exact', head: true });

  if (error) throw error;
  if (count === 0) {
    const seed = {
      id: 'seed-1',
      title: "Why the desk finally has five names on it",
      tag: "season opener",
      excerpt: "We used to run this whole place off one shared login. That was the *first* mistake.",
      body: "## The old way didn't hold\n\nWe used to run this whole place off one shared login. That was the *first* mistake — nobody owned a piece once it was published, and nobody could pull one back once it went out wrong.\n\nSo the desk grew. Five names now, not one: **Alvin** and **Yasha** hold the keys that can strike a piece out of the feed for good, and **Brittney**, **Marcus**, and **Priya** write without needing to ask anyone's permission first. That's the whole system. No approval queue, no editor reading over your shoulder — just a small, accountable room.\n\n# A note on the formatting\n\nIf you're reading this from the compose box, you've probably noticed you can lean on a word two ways: wrap it in single stars for *italic*, double stars for **bold**, and underscores for a proper _highlight_ — the kind that looks like it was dragged across the page with a mustard-yellow marker.\n\nA line starting with two hashes, like the one above this paragraph, becomes a heading big enough to break the page into chapters. One hash gets you something smaller, for a note along the way.\n\n# It also remembers\n\nEverything you publish here stays put. Close the tab, come back tomorrow, and the feed hasn't forgotten a thing — not what got added, and not what got deleted either.",
      color: "linear-gradient(155deg,#b0492f,#1c1916)",
      icon: "spark",
      punchline: "five names, one feed",
      author: "Alvin",
      authorRole: "admin",
      date: "today",
      createdAt: 1700000000000,
      image: null,
      images: [],
      draft: false
    };

    const { error: insertError } = await supabase
      .from('kindling_articles')
      .insert({ id: seed.id, article: seed, created_at: seed.createdAt });

    if (insertError && insertError.code !== '23505') throw insertError;
  }
}

module.exports = {
  getSupabaseAdmin,
  getRequestUser,
  sendJson,
  readJson,
  getArticles,
  seedIfEmpty
};
