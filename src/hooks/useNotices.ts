import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
  FALLBACK_NOTICES,
  normalizeCategory,
  type NoticeItem,
} from "../data/notices";

const TIMEOUT_MS = 4000;

async function fetchRemoteNotices(): Promise<NoticeItem[]> {
  const snap = await getDocs(collection(db, "notices"));
  return snap.docs
    .map((d): NoticeItem => {
      const data = d.data();
      const raw = data.date;
      const date =
        raw && typeof raw.toDate === "function"
          ? (raw.toDate() as Date).toISOString()
          : typeof raw === "string"
          ? raw
          : undefined;
      return {
        id: d.id,
        title: String(data.title ?? "").trim(),
        body: String(data.body ?? "").trim(),
        category: normalizeCategory(data.category),
        pinned: Boolean(data.pinned),
        date,
      };
    })
    .filter((n) => n.title && n.body);
}

/** Pinned first, then newest first, undated last. */
function sortNotices(items: NoticeItem[]): NoticeItem[] {
  const time = (n: NoticeItem) => (n.date ? new Date(n.date).getTime() : -Infinity);
  return [...items].sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
    return time(b) - time(a);
  });
}

export function useNotices() {
  const [state, setState] = useState<{ items: NoticeItem[]; loading: boolean }>({
    items: [],
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS)
    );

    Promise.race([fetchRemoteNotices(), timeout])
      .then((remote) => {
        if (cancelled) return;
        setState({
          items: sortNotices(remote.length ? remote : FALLBACK_NOTICES),
          loading: false,
        });
      })
      .catch((err) => {
        console.warn("[useNotices] Using built-in notices:", err);
        if (!cancelled) setState({ items: sortNotices(FALLBACK_NOTICES), loading: false });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
