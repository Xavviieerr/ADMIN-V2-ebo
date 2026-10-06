// Central capability gate for Names actions.
// Current product decision: expose create/edit/moderate to the admin experience;
// the BACKEND remains the ultimate authority (today it 403s normal admins on
// every write — surfaced via preserved error messages, never hardcoded here).
// When backend ships granular permissions (create_name, edit_name, delete_name,
// moderate_name), wire them in `hasCapability` only — no flow restructure needed.

export type NameCapability = "create" | "edit" | "moderate" | "remove";

export function hasNameCapability(_capability: NameCapability): boolean {
  return true;
}

export const canCreateName = (): boolean => hasNameCapability("create");
export const canEditName = (): boolean => hasNameCapability("edit");
export const canModerateName = (): boolean => hasNameCapability("moderate");
export const canDeleteName = (): boolean => hasNameCapability("remove");
