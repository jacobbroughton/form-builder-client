import { useEffect, useRef } from "react";
import { SortOptionType } from "../../../lib/types";
import "./SortFormsMenu.css";

export function SortFormsMenu({
  setSortMenuToggled,
  setSelectedSort,
  selectedSort,
}: {
  setSortMenuToggled: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSort: React.Dispatch<React.SetStateAction<SortOptionType>>;
  selectedSort: {
    id: number;
    name: string;
    value: string;
  };
}): JSX.Element {
  const ref = useRef<HTMLUListElement>(null);

  const sortOptions = [
    {
      id: 1,
      name: "Alphabetical: A-Z",
      value: "alphabetical-a-z",
    },
    {
      id: 2,
      name: "Alphabetical: Z-A",
      value: "alphabetical-z-a",
    },
    {
      id: 3,
      name: "Date: New-Old",
      value: "date-new-old",
    },
    {
      id: 4,
      name: "Date: Old-New",
      value: "date-old-new",
    },
  ];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
        setSortMenuToggled(false);
      }
    }

    document.addEventListener("click", handler);

    return () => document.removeEventListener("click", handler);
  });

  return (
    <ul className="sort-menu" ref={ref}>
      {sortOptions.map((sortOption) => (
        <li key={sortOption.id}>
          <button
            className={`${selectedSort.id === sortOption.id ? "selected" : ""}`}
            onClick={() => {
              setSortMenuToggled(false);
              setSelectedSort(sortOption);
            }}
          >
            {sortOption.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
