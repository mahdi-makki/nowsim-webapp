"use client";

import { useId, useRef } from "react";
import { MdClose, MdSearch } from "react-icons/md";

import { Pressable } from "@/components/ui/Pressable";
import { cn } from "@/lib/cn";

export function SearchField({
  value,
  onChange,
  label,
  placeholder,
  name = "q",
  clearable = false,
  className,
  inputClassName,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  name?: string;
  clearable?: boolean;
  className?: string;
  inputClassName?: string;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const clearing = clearable && value.length > 0;

  return (
    <div className={cn("group relative min-w-0", className)}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>

      <MdSearch
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-5 top-1/2 z-10 h-5 w-5 -translate-y-1/2",
          "text-ink/40 transition-colors duration-300 ease-hover",
          "group-focus-within:text-brand",
          "motion-reduce:transition-none",
        )}
      />

      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -inset-1 rounded-full bg-brand/15 blur-md",
          "scale-95 opacity-0 transition-[opacity,transform] duration-500 ease-hover",
          "group-focus-within:scale-100 group-focus-within:opacity-100",
          "motion-reduce:transition-none motion-reduce:scale-100",
        )}
      />

      <input
        id={inputId}
        ref={inputRef}
        name={name}
        type="search"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "relative w-full rounded-full border border-hairline bg-surface py-4 pl-13",
          clearing ? "pr-14" : "pr-5",
          "text-base font-medium text-ink placeholder:text-ink/40",
          "transition-[border-color,box-shadow] duration-300 ease-hover",
          "hover:border-ink/25",
          "focus-visible:border-brand/55 focus-visible:outline-none",
          "focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-brand)_14%,transparent)]",
          "[&::-webkit-search-cancel-button]:appearance-none",
          "motion-reduce:transition-none",
          inputClassName,
        )}
      />

      {clearing ? (
        <Pressable
          type="button"
          press={false}
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          className={cn(
            "absolute right-2 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full text-muted",
            "transition-colors duration-300 ease-hover motion-reduce:transition-none",
            "hover:bg-brand/8 hover:text-brand active:bg-brand/8",
          )}
        >
          <MdClose aria-hidden className="h-5 w-5" />
          <span className="sr-only">Clear search</span>
        </Pressable>
      ) : null}
    </div>
  );
}
