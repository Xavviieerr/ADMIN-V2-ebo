export interface PermissionGroup {
  resource: string;
  actions: string[];
}

function capitalize(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Groups backend permission keys of the form `{action}_{resource}`
 * (e.g. `view_user`, `edit_province`) by resource. Only granted
 * permissions are included. Keys that do not match the pattern
 * fall into an "Other" group so nothing is ever silently dropped.
 */
export function groupPermissionsByResource(
  permissions: Record<string, boolean> | undefined | null,
): PermissionGroup[] {
  if (!permissions) return [];

  const groups = new Map<string, string[]>();

  for (const [key, granted] of Object.entries(permissions)) {
    if (!granted) continue;
    const separatorIndex = key.indexOf("_");
    const resource =
      separatorIndex > 0
        ? capitalize(key.slice(separatorIndex + 1))
        : "Other";
    const action =
      separatorIndex > 0 ? capitalize(key.slice(0, separatorIndex)) : key;
    const actions = groups.get(resource) ?? [];
    actions.push(action);
    groups.set(resource, actions);
  }

  return [...groups.entries()].map(([resource, actions]) => ({
    resource,
    actions: [...actions].sort((a, b) => a.localeCompare(b)),
  }));
}
