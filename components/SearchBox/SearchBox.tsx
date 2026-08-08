"use client";

import css from "./Search.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search notes..."
    />
  );
}

export default SearchBox;
