"use client";

import { useState } from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import { fetchNotes } from "@/lib/api/clientApi";

import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";

import css from "./NotesPage.module.css";

interface NotesProps {
  tag?: string;
}

function Notes({ tag }: NotesProps) {
  const [page, setPage] = useState(1);
  const [searchRequest, setSearchRequest] = useState("");
  const [inputValue, setInputValue] = useState("");

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["notes", page, searchRequest, tag],

    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search: searchRequest,
        tag,
      }),

    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearchRequest(value);
  }, 500);

  const searchBoxOnChange = (value: string) => {
    setInputValue(value);

    // При новом поиске начинаем с первой страницы.
    setPage(1);

    debouncedSetSearch(value);
  };

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onChange={searchBoxOnChange} />

        {isFetching && <p>Updating...</p>}

        {data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}

export default Notes;
