import { FaMagnifyingGlass } from "react-icons/fa6";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";

export function SearchFilter({ filterBy, onSetFilter, toggleState }) {
  const [filterByToEdit, setFilterByEdit] = useState(filterBy);
  const params = useParams();
  const navigate = useNavigate();

  function handleTypeChange(ev) {
    ev.preventDefault()

    const { value, name:field } = ev.target;

    setFilterByEdit(prevFilter => {
      return { ...prevFilter, [field]: value }
      })
  }

  function onSubmit(ev) {
    ev.preventDefault()

    // Check if the current location is a certain email
    if (params.emailId) {
      navigate("/mail/inbox");
      toggleState();
    }

    onSetFilter({ searchStr: filterByToEdit.searchStr });
  }

  return (
    <div className="search-filter-container">
      <span className="search-logo">
        <FaMagnifyingGlass />
      </span>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="searchStr"
          value={filterByToEdit.searchStr}
          placeholder="Search"
          onChange={handleTypeChange}
        />
      </form>
    </div>
  );
}
