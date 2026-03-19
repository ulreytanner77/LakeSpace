"use client";

interface FilterPillsProps {
  options: string[];
  selected: string | null;
  onChange: (value: string | null) => void;
  icons?: Record<string, string>;
}

export default function FilterPills({ options, selected, onChange, icons }: FilterPillsProps) {
  if (options.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = selected === option;
        return (
          <button
            key={option}
            onClick={() => onChange(isActive ? null : option)}
            className={`text-xs font-medium px-3 py-1 rounded-full border transition-all capitalize ${
              isActive
                ? "bg-lake-500 text-white border-lake-500"
                : "bg-white text-sand-400 border-sand-200 hover:border-lake-300 hover:text-lake-500"
            }`}
          >
            {icons?.[option] ? `${icons[option]} ` : ""}{option}
          </button>
        );
      })}
    </div>
  );
}
