/**
 * Returns a stable anonymous user ID stored in sessionStorage for the current tab.
 * Used as a fallback when the user is not logged in, so lab history can still be saved.
 */
export function getAnonymousId(): string {
  const key = 'virtuallab_anon_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = 'anon_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    sessionStorage.setItem(key, id);
  }
  return id;
}
