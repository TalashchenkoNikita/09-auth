"use client";

import ReactPaginate from "react-paginate";

import css from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <ReactPaginate
      className={css.pagination}
      pageCount={totalPages}
      forcePage={currentPage - 1}
      onPageChange={(selectedItem) => onPageChange(selectedItem.selected + 1)}
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
      activeClassName={css.active}
      activeLinkClassName={css.active}
    />
  );
}

export default Pagination;
