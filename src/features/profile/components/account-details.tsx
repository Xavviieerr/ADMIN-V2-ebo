"use client";

import moment from "moment";
import { BadgeCheck, Cake, IdCard, Mail, MapPin, User } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { DetailUser } from "../types";
import DetailRow from "./detail-row";

interface AccountDetailsProps {
  user: DetailUser;
  onChangeEmail?: () => void;
}

export default function AccountDetails({ user, onChangeEmail }: AccountDetailsProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return (
		<div className="bg-[#2a2a2a] rounded-xl p-6 border border-white/5 mb-6">
			<div className="flex items-center justify-between pb-2">
				<div className="flex items-center gap-2.5">
					<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5DEB3]/10 text-[#F5DEB3]">
						<IdCard size={15} />
					</span>
					<h3 className="text-white font-semibold">
						{t("profile.accountDetails", "Account Details")}
					</h3>
				</div>
        {onChangeEmail && (
          <button
            type="button"
            onClick={onChangeEmail}
            className="text-sm text-[#F5DEB3] hover:text-[#ffe6b0] transition-colors"
          >
            {t("profile.changeEmail", "Change Email")}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 divide-y md:divide-y-0 divide-white/5">
        <div className="divide-y divide-white/5">
          {user.email && (
            <DetailRow
              icon={Mail}
              label={t("profile.email", "Email")}
              value={<span className="break-all">{user.email}</span>}
            />
          )}
          {user.gender && (
            <DetailRow
              icon={User}
              label={t("profile.gender", "Gender")}
              value={user.gender.replace(/\b\w/g, (c) => c.toUpperCase())}
            />
          )}
          {user.DOB && (
            <DetailRow
              icon={Cake}
              label={t("profile.dob", "Date of Birth")}
              value={moment(user.DOB).format("DD/MM/YYYY")}
            />
          )}
        </div>
        <div className="divide-y divide-white/5">
          {user.province && (
            <DetailRow
              icon={MapPin}
              label={t("profile.province", "Province")}
              value={user.province}
            />
          )}
          {user.town && (
            <DetailRow
              icon={MapPin}
              label={t("profile.town", "Town")}
              value={user.town}
            />
          )}
          <DetailRow
            icon={BadgeCheck}
            label={t("profile.emailVerified", "Email Verified")}
            value={
              user.isEmailVerified || user.isVerified
                ? t("profile.yes", "Yes")
                : t("profile.no", "No")
            }
            valueClassName={
              user.isEmailVerified || user.isVerified
                ? "text-green-400"
                : "text-red-400"
            }
          />
        </div>
      </div>
    </div>
  );
}
