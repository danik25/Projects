import React, { useEffect, useState } from "react";

export function DropDownFilter({ filterBy, onSetFilter }) {

  function handleIsReadChange(ev) {
    ev.preventDefault();

    let { value, name:field } = ev.target;

    let actualValue = undefined;
    switch (value) {
      case "false":
        actualValue = false;
        break;
      case "true":
        actualValue = true;
    }

    onSetFilter({ [field]: actualValue })
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
