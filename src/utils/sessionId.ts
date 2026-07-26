/**
 * Returns a stable anonymous user ID stored in localStorage.
 * Used as a fallback when the user is not logged in, so lab history persists
 * across browser sessions and tab closes.
 */
export function getAnonymousId(): string {
  const key = 'virtuallab_anon_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = 'anon_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16);
    localStorage.setItem(key, id);
  }
  return id;
}

