import React from "react";

export default function SearchBar({value, onChange, onSearch}) {
    return (
        <div className="search-container">
            <div className="search-input-box">
                <span className="search-icon">🔍</span>
                <input
                type="text"
                placeholder="Search for books"
                value= {value}
                onChange={e => onChange(e.target.value)}
                className="search-input"
                />
            </div>
            <button className="search-button" onClick={onSearch}>Search</button>
        </div>
    );
}
