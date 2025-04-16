'use client';

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

type PaginationProps = {
    pageNumber: number,
    isNext: boolean,
    path: string
};

function Pagination({
    pageNumber,
    isNext,
    path
}: PaginationProps) {
    const router = useRouter();

    const handleNavigation = (type: string) => {
        let nextPageNumber = pageNumber;

        if (type === "prev") {
            nextPageNumber = Math.max(1, pageNumber - 1);
        } else if (type === "next") {
            nextPageNumber = pageNumber + 1;
        }
        
        if (nextPageNumber > 1) {
            router.push(`/${path}?page=${nextPageNumber}`);
        } else {
            router.push(`/${path}`);
        }
    };

    if (!isNext && pageNumber === 1) return null;

    return (
        <div className="pagination">
            <Button
                onClick={() => handleNavigation('prev')}
                disabled={pageNumber === 1}
                className="text-light-2"
            >
                Prev
            </Button>
            <p className="font-semibold text-light-1">{pageNumber}</p>
            <Button
                onClick={() => handleNavigation('next')}
                disabled={!isNext}
                className="text-light-2"
            >
                Next
            </Button>
        </div>
    );
}

export default Pagination;
