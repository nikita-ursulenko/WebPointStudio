import { Button } from '@/components/ui/button';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onNext: () => void;
    onPrev: () => void;
}

export function PaginationControls({
    currentPage,
    totalPages,
    onNext,
    onPrev,
}: PaginationControlsProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-4 mt-8">
            <Button
                variant="outline"
                size="sm"
                onClick={onPrev}
                disabled={currentPage === 1}
            >
                Назад
            </Button>
            <span className="text-sm text-muted-foreground">
                Страница {currentPage} из {totalPages}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={onNext}
                disabled={currentPage === totalPages}
            >
                Вперед
            </Button>
        </div>
    );
}
