"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, X } from "lucide-react";
import { BaseInput, ErrorWidget, PermissionGate } from "@/features/shared";
import ModalLayout from "@/features/shared/modal-layout";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useDebounce } from "@/hooks/use-debounce";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import type { RelatedPlaceEntry } from "../model/types";
import {
  addRelatedPlace,
  fetchPlacesList,
  fetchSinglePlace,
  removeRelatedPlace,
} from "../api/places";
import { getPlaceErrorMessage, PlaceApiError } from "../api/errors";

// Related-places manager. Verified semantics encoded here:
// - POST creates a BIDIRECTIONAL pair (mirror row on the target).
// - Duplicate POST → 409 (treated as already-related info, not an error).
// - DELETE takes the related PLACE id and 204s even on no-ops, so every
//   mutation re-fetches detail and verifies the resulting state.
const RelatedSection = ({
  placeId,
  initial,
}: {
  placeId: string;
  initial: RelatedPlaceEntry[];
}) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [relations, setRelations] = useState<RelatedPlaceEntry[]>(initial);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; name: string; type: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<{ id: string; name: string } | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<RelatedPlaceEntry | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const debouncedQuery = useDebounce(query.trim(), 400);
  const searchRef = useRef(0);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }
    const runId = ++searchRef.current;
    setSearching(true);
    fetchPlacesList({ search: debouncedQuery, limit: 6 }, tokenStorage.getAccessToken())
      .then((page) => {
        if (searchRef.current !== runId) return;
        setResults(
          (page.items ?? [])
            .filter((item) => item.id !== placeId)
            .map((item) => ({ id: item.id, name: item.name, type: item.type })),
        );
      })
      .catch(() => {
        if (searchRef.current !== runId) return;
        setResults([]);
      })
      .finally(() => {
        if (searchRef.current !== runId) return;
        setSearching(false);
      });
  }, [debouncedQuery, placeId]);

  const refreshFromServer = async () => {
    const fresh = await fetchSinglePlace(tokenStorage.getAccessToken(), placeId);
    setRelations(fresh.relatedPlaces ?? []);
    router.refresh();
    return fresh.relatedPlaces ?? [];
  };

  const handleAdd = async () => {
    if (!selected || busy) return;
    setError("");
    setBusy(true);
    try {
      await addRelatedPlace(placeId, selected.id, note.trim() || undefined, tokenStorage.getAccessToken());
      const verified = await refreshFromServer();
      if (verified.some((r) => r.relatedPlaceId === selected.id)) {
        toast.success(t("places.actions.relatedAdded", "Related place added"));
      } else {
        // Server accepted but state unverified — surface, don't fake success.
        setError(t("places.actions.relatedAddFailed", "Failed to add related place"));
        return;
      }
      setSelected(null);
      setQuery("");
      setResults([]);
      setNote("");
    } catch (err) {
      if (err instanceof PlaceApiError && err.isConflict) {
        toast.message(t("places.actions.alreadyRelated", "These places are already related"));
        try {
          await refreshFromServer();
        } catch {
          // keep current list on refresh failure
        }
        return;
      }
      const msg = getPlaceErrorMessage(err, t("places.actions.relatedAddFailed", "Failed to add related place"));
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    if (!confirmRemove || busy) return;
    setError("");
    setBusy(true);
    try {
      await removeRelatedPlace(placeId, confirmRemove.relatedPlaceId, tokenStorage.getAccessToken());
      const verified = await refreshFromServer();
      if (verified.some((r) => r.relatedPlaceId === confirmRemove.relatedPlaceId)) {
        setError(t("places.actions.relatedRemoveFailed", "Failed to remove related place"));
        return;
      }
      toast.success(t("places.actions.relatedRemoved", "Related place removed"));
      setConfirmRemove(null);
    } catch (err) {
      const msg = getPlaceErrorMessage(err, t("places.actions.relatedRemoveFailed", "Failed to remove related place"));
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PermissionGate permission="edit_place">
        <div className="flex flex-col md:px-8 px-4 py-6 gap-4 bg-gray-txt-100 rounded-md w-full">
          <div className="flex items-center gap-3 text-base font-medium">
            <div className="h-3 w-3 rounded-full bg-yellow-600" />
            <h2>{t("places.actions.addRelated", "Add related place")}</h2>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="related-search">
              {t("places.actions.addRelatedTitle", "Add Related Place")}
            </label>
            <div className="relative">
              <input
                id="related-search"
                type="search"
                placeholder={t("places.actions.addRelatedPh", "Search places by name")}
                value={selected ? selected.name : query}
                onChange={(e) => {
                  setSelected(null);
                  setQuery(e.target.value);
                }}
                className="input pr-10"
              />
              {(query || selected) && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSelected(null);
                    setResults([]);
                  }}
                  aria-label={t("common.clearSearch", "Clear search")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {searching && <p className="text-xs text-gray-400">{t("common.searching", "Searching")}</p>}
            {!selected && results.length > 0 && (
              <ul className="flex flex-col rounded-lg overflow-hidden border border-white/10 bg-secondary-bg max-h-56 overflow-y-auto custom-scrollbar">
                {results.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelected({ id: item.id, name: item.name });
                        setResults([]);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-txt-100 capitalize"
                    >
                      {item.name}
                      <span className="text-xs text-gray-400 ml-2">({item.type})</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selected && (
            <div className="flex flex-col gap-2 w-full">
              <BaseInput
                label={t("places.actions.noteLabel", "Note (optional)")}
                placeholder={t("places.actions.notePh", "Why are these places related?")}
                value={note}
                setValue={(v) => setNote(v as string)}
              />
              <button
                type="button"
                onClick={handleAdd}
                disabled={busy}
                className="secondary-btn w-fit self-end flex items-center gap-2 disabled:opacity-50"
              >
                <Plus size={16} />
                {t("places.actions.addRelated", "Add related place")}
              </button>
            </div>
          )}
        </div>
      </PermissionGate>

      <ErrorWidget message={error} action={() => setError("")} />

      <div className="flex flex-col md:px-8 px-4 py-6 gap-4 bg-gray-txt-100 rounded-md w-full">
        <div className="flex items-center gap-3 text-base font-medium">
          <div className="h-3 w-3 rounded-full bg-yellow-600" />
          <h2>
            {t("places.detail.relatedTitle", "Related Places")}
          </h2>
        </div>

        {relations.length === 0 ? (
          <p className="text-sm text-gray-400">
            {t("places.detail.noRelated", "No related places yet")}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {relations.map((rel) => (
              <li
                key={rel.id}
                className="flex items-center justify-between gap-3 border border-white/10 rounded-lg px-4 py-3"
              >
                <Link
                  href={`/guonopedia/places/${rel.relatedPlaceId}`}
                  className="font-medium capitalize hover:underline truncate"
                >
                  {rel.relatedPlace?.name ?? rel.relatedPlaceId}
                </Link>
                <div className="flex items-center gap-3 shrink-0">
                  {rel.relationNote && (
                    <span className="text-xs text-gray-400 truncate max-w-40 hidden sm:inline">
                      {rel.relationNote}
                    </span>
                  )}
                  <PermissionGate permission="edit_place">
                    <button
                      type="button"
                      onClick={() => setConfirmRemove(rel)}
                      aria-label={t("places.actions.removeRelatedTitle", "Remove Related Place")}
                      className="text-base-red cursor-pointer"
                    >
                      <Trash2 size={20} strokeWidth={1.5} />
                    </button>
                  </PermissionGate>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {confirmRemove && (
        <ModalLayout size="xl">
          <div className="flex flex-col items-center w-full gap-6">
            <h1 className="font-medium md:text-2xl text-xl">
              {t("places.actions.removeRelatedTitle", "Remove Related Place")}
            </h1>
            <p className="font-medium text-center max-md:text-sm">
              {t(
                "places.actions.removeRelatedBody",
                "Remove this relationship? It will be removed from both places.",
              )}
            </p>
            <div className="flex items-center gap-4 w-full font-medium max-sm:flex-col">
              <button onClick={() => setConfirmRemove(null)} className="secondary-btn w-full">
                {t("common.cancel", "Cancel")}
              </button>
              <button
                onClick={handleRemove}
                disabled={busy}
                className="primary-btn bg-base-red hover:bg-red-700 text-white w-full flex justify-center disabled:opacity-50"
              >
                {t("common.delete", "Delete")}
              </button>
            </div>
          </div>
        </ModalLayout>
      )}
    </div>
  );
};

export default RelatedSection;
