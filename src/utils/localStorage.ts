/**
 * Utility functions for managing localStorage
 */

/**
 * Clears all pagination-related state from localStorage
 * This should be called when a user logs out to ensure clean state for the next user
 */
export function clearPaginationState() {
  if (typeof window === 'undefined') return;

  // Dictionary pagination keys
  localStorage.removeItem('dictionary_all_words_page');
  localStorage.removeItem('dictionary_all_words_search');

  // Users pagination keys
  localStorage.removeItem('users_page');
  localStorage.removeItem('users_search');
  localStorage.removeItem('users_role_filter');
  localStorage.removeItem('users_status_filter');

  // Provinces pagination keys
  localStorage.removeItem('provinces_page');
}
