'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { formatSFTime, presetTime, TIME_PRESETS, type TimePreset } from '@/components/Procedural3D/sky/sunPosition';
import styles from './TimeOfDayPicker.module.css';

const PRESET_META: Record<TimePreset, { label: string; icon: string }> = {
  live: { label: 'Live', icon: 'bi-broadcast' },
  morning: { label: 'Morning', icon: 'bi-sunrise' },
  afternoon: { label: 'Afternoon', icon: 'bi-sun' },
  evening: { label: 'Evening', icon: 'bi-sunset' },
  night: { label: 'Night', icon: 'bi-moon-stars' },
};

interface Props {
  value: TimePreset;
  onChange: (preset: TimePreset) => void;
}

/** Custom listbox (the native <select> popup can't be styled). */
export default function TimeOfDayPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(TIME_PRESETS.indexOf(value));
  const [times, setTimes] = useState<Record<string, string>>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  // Refresh each option's SF time whenever the menu opens.
  useEffect(() => {
    if (!open) return;
    const now = new Date();
    setTimes(Object.fromEntries(TIME_PRESETS.map((p) => [p, formatSFTime(presetTime(p, now) ?? now)])));
    setActive(TIME_PRESETS.indexOf(value));
    listRef.current?.focus();
  }, [open, value]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const choose = (preset: TimePreset) => {
    onChange(preset);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onListKeyDown = (e: KeyboardEvent) => {
    const last = TIME_PRESETS.length - 1;
    if (e.key === 'ArrowDown') setActive((i) => (i >= last ? 0 : i + 1));
    else if (e.key === 'ArrowUp') setActive((i) => (i <= 0 ? last : i - 1));
    else if (e.key === 'Home') setActive(0);
    else if (e.key === 'End') setActive(last);
    else if (e.key === 'Enter' || e.key === ' ') choose(TIME_PRESETS[active]);
    else if (e.key === 'Escape' || e.key === 'Tab') {
      setOpen(false);
      if (e.key === 'Escape') buttonRef.current?.focus();
      return;
    } else return;
    e.preventDefault();
  };

  const current = PRESET_META[value];

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.trigger}
        data-augmented-ui="tl-clip br-clip border"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span className={styles.caption}>TIME</span>
        <i className={`bi ${current.icon} ${styles.icon}`} aria-hidden="true" />
        <span className={styles.value}>{current.label}</span>
        <i className={`bi bi-chevron-down ${styles.chevron} ${open ? styles.chevronOpen : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label="Time of day"
          aria-activedescendant={`${id}-${TIME_PRESETS[active]}`}
          className={styles.menu}
          data-augmented-ui="tl-clip br-clip border"
          onKeyDown={onListKeyDown}
        >
          {TIME_PRESETS.map((preset, i) => {
            const meta = PRESET_META[preset];
            return (
              <li
                key={preset}
                id={`${id}-${preset}`}
                role="option"
                aria-selected={preset === value}
                className={`${styles.option} ${i === active ? styles.active : ''} ${preset === value ? styles.selected : ''}`}
                onMouseMove={() => setActive(i)}
                onClick={() => choose(preset)}
              >
                <i className={`bi ${meta.icon} ${styles.icon}`} aria-hidden="true" />
                <span className={styles.optionLabel}>{meta.label}</span>
                <span className={styles.optionTime}>{times[preset]}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
