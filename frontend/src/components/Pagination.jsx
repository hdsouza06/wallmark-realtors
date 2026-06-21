import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1
  );

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-navy-900 transition hover:border-gold disabled:opacity-40"
      >
        <FiChevronLeft />
      </button>
      {nums.map((n, i) => {
        const prev = nums[i - 1];
        return (
          <span key={n} className="flex items-center">
            {prev && n - prev > 1 && <span className="px-2 text-gray-400">…</span>}
            <button
              onClick={() => onPage(n)}
              className={`h-10 w-10 rounded-full text-sm font-medium transition ${
                n === page ? "bg-gold text-navy-900" : "border border-gray-200 hover:border-gold"
              }`}
            >
              {n}
            </button>
          </span>
        );
      })}
      <button
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-navy-900 transition hover:border-gold disabled:opacity-40"
      >
        <FiChevronRight />
      </button>
    </div>
  );
}
