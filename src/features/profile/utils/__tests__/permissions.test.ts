import { describe, expect, it } from "vitest";
import { groupPermissionsByResource } from "../permissions";

describe("groupPermissionsByResource", () => {
  it("groups granted permissions by resource", () => {
    const result = groupPermissionsByResource({
      view_user: true,
      create_user: true,
      delete_user: true,
      edit_province: true,
      view_province: true,
      create_province: true,
      delete_province: true,
    });

    expect(result).toEqual([
      { resource: "User", actions: ["Create", "Delete", "View"] },
      {
        resource: "Province",
        actions: ["Create", "Delete", "Edit", "View"],
      },
    ]);
  });

  it("excludes denied permissions", () => {
    const result = groupPermissionsByResource({
      view_user: true,
      delete_user: false,
    });

    expect(result).toEqual([{ resource: "User", actions: ["View"] }]);
  });

  it("falls back to Other for keys without the action_resource pattern", () => {
    const result = groupPermissionsByResource({
      view_user: true,
      superadmin: true,
    });

    expect(result).toEqual([
      { resource: "User", actions: ["View"] },
      { resource: "Other", actions: ["superadmin"] },
    ]);
  });

  it("returns an empty array for missing or empty input", () => {
    expect(groupPermissionsByResource(undefined)).toEqual([]);
    expect(groupPermissionsByResource(null)).toEqual([]);
    expect(groupPermissionsByResource({})).toEqual([]);
  });
});
