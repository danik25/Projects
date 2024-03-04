import React, { useEffect, useState } from "react";

export function DropDownFilter({ filterBy, onSetFilter }) {
  const [inputValue, setInputValue] = useState("");

  function handleSearchSubmit(ev) {
    ev.preventDefault(); // Prevent the default form submission behavior

    let { value } = ev.target;

    const newObject = { ...filterBy, substring: value };
    onSetFilter(newObject);
  }

  function handleIsReadChange(ev) {
    ev.preventDefault();

    let { value, name } = ev.target;
    let actualValue = undefined;
    switch (value) {
      case "false":
        actualValue = false;
        break;
      case "true":
        actualValue = true;
    }

    const newObject = { ...filterBy, [name]: actualValue };
    onSetFilter(newObject);
  }

  return (
    <div>
      <label htmlFor="isRead"></label>

      <select
        className="custom-select"
        name="isRead"
        id="isRead"
        onChange={handleIsReadChange}
      >
        <option value="undefined">All</option>
        <option value="true">Read</option>
        <option value="false">Unread</option>
      </select>
    </div>
  );
}
