import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
    data: T[];
    itemsPerPage?: number;
}

interface UsePaginationReturn<T> {
    currentData: T[];
    currentPage: number;
    totalPages: number;
    nextPage: () => void;
    prevPage: () => void;
    goToPage: (page: number) => void;
    setCurrentPage: (page: number) => void;
}

export function usePagination<T>({ data, itemsPerPage = 10 }: UsePaginationProps<T>): UsePaginationReturn<T> {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return data.slice(start, end);
    }, [data, currentPage, itemsPerPage]);

    const nextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToPage = (page: number) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    };

    return {
        currentData,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        goToPage,
        setCurrentPage,
    };
}
