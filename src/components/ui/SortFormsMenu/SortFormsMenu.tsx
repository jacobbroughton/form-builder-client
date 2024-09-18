import { useEffect, useRef } from "react";
import "./SortFormsMenu.css";

const SortFormsMenu = ({
  setSortMenuToggled,
}: {
  setSortMenuToggled: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const ref = useRef<HTMLUListElement>(null);

  const sortOptions = [
    {
      id: 1,
      name: "Alphabetical: A-Z",
      value: "",
    },
    {
      id: 2,
      name: "Alphabetical: Z-A",
      value: "",
    },
    {
      id: 3,
      name: "Created Date: New-Old",
      value: "",
    },
    {
      id: 4,
      name: "Created Date: Old-New",
      value: "",
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
        <li>
          <button onClick={() => console.log("Sort: ", sortOption)}>
            {sortOption.name}
          </button>
        </li>
      ))}
    </ul>
  );
};
export default SortFormsMenu;
