import { useContext } from "react";
import { useGetInputTypes } from "../../../hooks/useGetInputTypes";
import { InputTypeType } from "../../../lib/types";
import { XIcon } from "../icons/XIcon";
import "./InputTypeSelector.css";
import { CurrentViewContext } from "../../../providers/CurrentViewProvider";
import FilledCircleIcon from "../icons/FilledCircleIcon";

export const InputTypeSelector = ({
  setStagedNewInputType,
}: {
  setStagedNewInputType: React.Dispatch<React.SetStateAction<InputTypeType | null>>;
}) => {
  const { inputTypes, loading: inputTypesLoading } = useGetInputTypes();
  const { setCurrentView } = useContext(CurrentViewContext);

  function renderIcon(inputTypeName: string) {
    switch (inputTypeName) {
      case "Short Answer": {
        return <p className="small-text">abc</p>;
      }
      case "Paragraph": {
        return <p className="small-text">abc</p>;
      }
      // case "Number": {
      //   return <NumberIcon />;
      // }
      // case "Email": {
      //   return (
      //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      //       <path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256l0 32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32l0 80 0 32c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" />
      //     </svg>
      //   );
      // }
      // case "URL": {
      //   return (
      //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
      //       {/* <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> */}
      //       <path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
      //     </svg>
      //   );
      // }
      // case "Telephone": {
      //   return (
      //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      //       <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
      //     </svg>
      //   );
      // }
      case "Date": {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L64 64C28.7 64 0 92.7 0 128l0 16 0 48L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-256 0-48 0-16c0-35.3-28.7-64-64-64l-40 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L152 64l0-40zM48 192l80 0 0 56-80 0 0-56zm0 104l80 0 0 64-80 0 0-64zm128 0l96 0 0 64-96 0 0-64zm144 0l80 0 0 64-80 0 0-64zm80-48l-80 0 0-56 80 0 0 56zm0 160l0 40c0 8.8-7.2 16-16 16l-64 0 0-56 80 0zm-128 0l0 56-96 0 0-56 96 0zm-144 0l0 56-64 0c-8.8 0-16-7.2-16-16l0-40 80 0zM272 248l-96 0 0-56 96 0 0 56z" />
          </svg>
        );
      }
      case "Time": {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
          </svg>
        );
      }
      case "Color": {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3L344 320c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
          </svg>
        );
      }
      case "Linear Scale": {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
            <path d="M117.9 62.4c-16.8-5.6-25.8-23.7-20.2-40.5s23.7-25.8 40.5-20.2l113 37.7C265 15.8 290.7 0 320 0c44.2 0 80 35.8 80 80c0 3-.2 5.9-.5 8.8l122.6 40.9c16.8 5.6 25.8 23.7 20.2 40.5s-23.7 25.8-40.5 20.2L366.4 145.2c-4.5 3.2-9.3 5.9-14.4 8.2L352 480c0 17.7-14.3 32-32 32l-192 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0 0-294.7c-21-9.2-37.2-27-44.2-49l-125.9-42zM200.4 288L128 163.8 55.6 288l144.9 0zM128 384C65.1 384 12.8 350 2 305.1c-2.6-11 1-22.3 6.7-32.1l95.2-163.2c5-8.6 14.2-13.8 24.1-13.8s19.1 5.3 24.1 13.8l95.2 163.2c5.7 9.8 9.3 21.1 6.7 32.1C243.2 350 190.9 384 128 384zm382.8-92.2L438.4 416l144.9 0L510.8 291.8zm126 141.3C626 478 573.7 512 510.8 512s-115.2-34-126-78.9c-2.6-11 1-22.3 6.7-32.1l95.2-163.2c5-8.6 14.2-13.8 24.1-13.8s19.1 5.3 24.1 13.8l95.2 163.2c5.7 9.8 9.3 21.1 6.7 32.1z" />
          </svg>
        );
      }
      case "Multiple Choice": {
        return <FilledCircleIcon/>
      }
    }
  }

  return (
    <div className="input-type-selector">
      <div className="navigation-buttons">
        <button
          className="navigation-button cancel"
          type="button"
          onClick={() => setCurrentView("metadata-inputs")}
        >
          <XIcon /> Cancel
        </button>
      </div>
      <div className="input-types-selector">
        {inputTypesLoading ? (
          [...new Array(5)].map((arrItem) => (
            <div className="skeleton input-type-placeholder" key={arrItem}>
              &nbsp;
            </div>
          ))
        ) : inputTypes.length === 0 ? (
          <p>No input types</p>
        ) : (
          inputTypes.map((inputType) => (
            <>
              <button
                type="button"
                onClick={() => {
                  setStagedNewInputType(inputType);
                  setCurrentView("staged-input-form");
                }}
              >
                <div className="icon-container">
                  {/* <span>abc</span> */}
                  {renderIcon(inputType.name)}
                </div>
                <div className="content">
                  <p className="name">{inputType.name}</p>
                  <p className="description">{inputType.description}</p>
                </div>
              </button>
            </>
          ))
        )}
      </div>
    </div>
  );
};