"use client";

interface PermissionItemProps {
  title: string;
  description: string;
  enabled?: boolean;
  onToggle?: () => void;
}

export default function PermissionItem({
  title,
  description,
  enabled = false,
  onToggle,
}: PermissionItemProps) {
  return (
    <div className="flex items-start justify-between p-4 bg-[#2a2a2a] rounded-lg border border-gray-600">
      <div className="flex-1">
        <h4 className="text-white font-medium text-sm mb-1">{title}</h4>
        <p className="text-gray-400 text-xs">{description}</p>
      </div>
      <button
        onClick={onToggle}
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={title}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-[#33B9C8]" : "bg-gray-600"
          }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"
            }`}
        />
      </button>
    </div>
  );
}
