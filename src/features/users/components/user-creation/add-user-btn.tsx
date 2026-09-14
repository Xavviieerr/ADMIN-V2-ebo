"use client";

import { Plus } from "lucide-react";
import React from "react";
import { useState } from "react";
import { LocaleWrapper } from "@/features/shared";
import InviteAdmin from "./invite-admin";
import CreateAdmin from "./create-admin";

const AddUserBtn = () => {
  const [inviteUser, setInviteUser] = useState(false);
  const [createAdmin, setCreateAdmin] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <InviteAdmin show={inviteUser} setShow={setInviteUser} />

      <CreateAdmin show={createAdmin} setShow={setCreateAdmin} />

      <button
        onClick={() => setCreateAdmin(!createAdmin)}
        className="primary-btn flex items-center gap-2 font-medium"
      >
        <Plus />
        <span>
          <LocaleWrapper item="common.addAdmin" />
        </span>
      </button>

      <button
        onClick={() => setInviteUser(!inviteUser)}
        className="secondary-btn font-medium"
      >
        <span>
          <LocaleWrapper item="common.inviteUser" />
        </span>
      </button>
    </div>
  );
};

export default AddUserBtn;
