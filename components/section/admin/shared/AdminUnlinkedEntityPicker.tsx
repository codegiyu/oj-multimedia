'use client';

import { useState, useEffect, useRef } from 'react';
import { RegularInput } from '@/components/atoms/RegularInput';
import { cn } from '@/lib/utils';
import type { SelectOption } from '@/lib/types/general';

const SEARCH_DEBOUNCE_MS = 300;
const MIN_QUERY_LEN = 2;

export type UnlinkedEntityKind = 'artist' | 'vendor' | 'pastor';

async function searchUnlinkedEntities(
  kind: UnlinkedEntityKind,
  search: string
): Promise<SelectOption[]> {
  const {
    loadAdminArtistSelectOptions,
    loadAdminVendorSelectOptions,
    loadAdminPastorSelectOptions,
  } = await import('@/lib/utils/adminEntitySelect');

  if (kind === 'artist') {
    return loadAdminArtistSelectOptions(search, { unlinkedOnly: true });
  }

  if (kind === 'vendor') {
    return loadAdminVendorSelectOptions(search, { unlinkedOnly: true });
  }

  return loadAdminPastorSelectOptions(search);
}

interface AdminUnlinkedEntityPickerProps {
  entityKind: UnlinkedEntityKind;
  label: string;
  value: string;
  onChange: (entityId: string, label: string) => void;
  disabled?: boolean;
  description?: string;
  placeholder?: string;
}

export function AdminUnlinkedEntityPicker({
  entityKind,
  label,
  value,
  onChange,
  disabled,
  description,
  placeholder = 'Type at least 2 characters…',
}: AdminUnlinkedEntityPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!value) {
      setSelectedLabel(null);
    }
  }, [value]);

  useEffect(() => {
    if (!active || query.trim().length < MIN_QUERY_LEN) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      setLoading(true);
      void searchUnlinkedEntities(entityKind, query.trim())
        .then(options => setResults(options))
        .finally(() => setLoading(false));
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, active, entityKind]);

  const pick = (option: SelectOption) => {
    setSelectedLabel(option.text);
    onChange(option.value, option.text);
    setQuery('');
    setResults([]);
    setActive(false);
  };

  const clear = () => {
    setSelectedLabel(null);
    onChange('', '');
    setQuery('');
    setResults([]);
    setActive(false);
  };

  if (value && selectedLabel && !active) {
    return (
      <div className="grid gap-2">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground rounded-md border border-border px-3 py-2 bg-muted/30">
          {selectedLabel}
        </p>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
        <div className="flex gap-2">
          <button
            type="button"
            className="text-sm font-medium text-primary hover:underline"
            onClick={() => setActive(true)}
            disabled={disabled}>
            Change
          </button>
          <button
            type="button"
            className="text-sm text-muted-foreground hover:underline"
            onClick={clear}
            disabled={disabled}>
            Clear
          </button>
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
          if (!active) setActive(true);
          setQuery(e.target.value);
        }}
        onFocus={() => setActive(true)}
        placeholder={placeholder}
        disabled={disabled}
      />
      {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      {active && !disabled && query.trim().length >= MIN_QUERY_LEN ? (
        <div
          className={cn(
            'max-h-48 overflow-y-auto rounded-md border border-border bg-popover text-sm shadow-md'
          )}>
          {loading ? (
            <p className="p-3 text-muted-foreground">Searching…</p>
          ) : results.length === 0 ? (
            <p className="p-3 text-muted-foreground">No unlinked profiles found</p>
          ) : (
            <ul className="py-1">
              {results.map(option => (
                <li key={option.value}>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-muted/80"
                    onClick={() => pick(option)}>
                    <span className="font-medium">{option.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
