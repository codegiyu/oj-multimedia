'use client';

import { useState, useEffect, useRef, startTransition } from 'react';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { callApi } from '@/lib/services/callApi';
import type { IAdminUserSearchItem } from '@/lib/constants/endpoints';
import { cn } from '@/lib/utils';

const SEARCH_DEBOUNCE_MS = 300;
const MIN_QUERY_LEN = 2;

interface AdminUserAccountPickerProps {
  label?: string;
  value: string;
  onChange: (userId: string, user: IAdminUserSearchItem | null) => void;
  disabled?: boolean;
  description?: string;
  /** When editing, show a label for an already-linked user id (API may not return full user). */
  initialLabel?: string | null;
}

export function AdminUserAccountPicker({
  label = 'Link user account',
  value,
  onChange,
  disabled,
  description = 'Search by email or name. The server links or creates an artist profile when you save.',
  initialLabel,
}: AdminUserAccountPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IAdminUserSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [picking, setPicking] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);

  useEffect(() => {
    startTransition(() => {
      if (!value) setSelectedSummary(null);
      else if (initialLabel) setSelectedSummary(initialLabel);
    });
  }, [value, initialLabel]);

  useEffect(() => {
    if (!picking || query.trim().length < MIN_QUERY_LEN) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      const q = new URLSearchParams();
      q.set('search', query.trim());
      q.set('limit', '20');
      void callApi('ADMIN_USERS_SEARCH', { query: `?${q.toString()}` as `?${string}` })
        .then(res => {
          if (res.type !== 'success') {
            setResults([]);
            return;
          }
          setResults(res.data.users ?? []);
        })
        .finally(() => setLoading(false));
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, picking]);

  const pickUser = (u: IAdminUserSearchItem) => {
    setSelectedSummary(`${u.firstName} ${u.lastName} (${u.email})`);
    onChange(u._id, u);
    setQuery('');
    setResults([]);
    setPicking(false);
  };

  const clear = () => {
    setSelectedSummary(null);
    onChange('', null);
    setQuery('');
    setResults([]);
    setPicking(false);
  };

  const linkedDisplay =
    selectedSummary ?? initialLabel ?? (value ? `Linked user (id: ${value})` : null);

  if (value && linkedDisplay && !picking) {
    return (
      <div className="grid gap-2">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground rounded-md border border-border px-3 py-2 bg-muted/30">
          {linkedDisplay}
        </p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        <div className="flex gap-2">
          <RegularBtn
            type="button"
            variant="outline"
            text="Change user"
            onClick={() => setPicking(true)}
            disabled={disabled}
          />
          <RegularBtn
            type="button"
            variant="ghost"
            text="Clear"
            onClick={clear}
            disabled={disabled}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <RegularInput
        label={label}
        value={query}
        onChange={e => {
          if (!picking) setPicking(true);
          setQuery(e.target.value);
        }}
        onFocus={() => setPicking(true)}
        placeholder="Type at least 2 characters…"
        disabled={disabled}
      />
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {value && picking && (
        <RegularBtn
          type="button"
          variant="ghost"
          text="Cancel search"
          onClick={() => setPicking(false)}
        />
      )}
      {picking && !disabled && query.trim().length >= MIN_QUERY_LEN && (
        <div
          className={cn(
            'max-h-48 overflow-y-auto rounded-md border border-border bg-popover text-sm shadow-md z-10'
          )}>
          {loading ? (
            <p className="p-3 text-muted-foreground">Searching…</p>
          ) : results.length === 0 ? (
            <p className="p-3 text-muted-foreground">No users found</p>
          ) : (
            <ul className="py-1">
              {results.map(u => (
                <li key={u._id}>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-muted/80"
                    onClick={() => pickUser(u)}>
                    <span className="font-medium">
                      {u.firstName} {u.lastName}
                    </span>
                    <span className="block text-xs text-muted-foreground">{u.email}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
