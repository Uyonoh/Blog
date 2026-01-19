"use client";

import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
    currentPage: number;
    totalPages: number;
};

function getPageWindow(
    current: number,
    total: number,
    radius: number=2
) {
    const start = Math.max(1, current - radius);
    const end = Math.min(total, current + radius);

    return Array.from(
        { length: end - start + 1},
        (_, i) => start + i
    );
}

export default function PostPagination({currentPage, totalPages}: Props) {

    if (totalPages < 2) {
        return <></>
    }

    const router = useRouter();
    const pages = getPageWindow(currentPage, totalPages);

    const goToPage = (page: number) => {
        if (page === currentPage) return;
        router.push(`?page=${page}`);
    };

    return (
    <div className="flex items-center justify-center gap-3 mt-10">
      {pages.map((page) => {
        const isCurrent = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => goToPage(page)}
            disabled={isCurrent}
            className={clsx(
              "rounded-full flex items-center justify-center transition-all duration-200",
              isCurrent
                ? "w-12 h-12 text-lg bg-blue-600 text-white"
                : "w-9 h-9 text-sm bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 opacity-60 hover:opacity-100 hover:scale-105"
            )}
          >
            {page}
          </button>
        );
      })}
    </div>
  ); 
}