import { FaMagnifyingGlass } from "react-icons/fa6";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";

export function SearchFilter({ filterBy, onSetFilter, toggleState }) {
  const [searchInput, setSearchInput] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  function handleContentChange(ev) {
    ev.preventDefault(); // Prevent the default form submission behavior

    const value = ev.target.value;

    setSearchInput(value);
  }

  function handleSearchSubmit(ev) {
    ev.preventDefault(); // Prevent the default form submission behavior

    // Check if the current location is a certain email
    if (params.emailId) {
      navigate("/email");
      toggleState();
    }

    const value = searchInput;
    const newObject = { ...filterBy, substring: value };
    onSetFilter(newObject);
  }

  return (
    <div className="search-filter-container">
      <span className="search-logo">
        <FaMagnifyingGlass />
      </span>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchInput}
          placeholder="Search"
          onChange={handleContentChange}
        />
      </form>
    </div>
  );
}
