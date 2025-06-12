

const genreIcons = {
  Fantasy: "/FantasyBook.png",
  Romance: "/RomanceBook.png",
  Fiction: "/FictionBook.png",
  "Non Fiction": "/NonFictionBook.png"
};

export default function GenreFilter( {selectedGenre, onSelect}) {
    return (
        <div className="genre-filter">
            {Object.entries(genreIcons).map(([genre, icon]) => (
                <button
                key={genre}
                onClick={() => onSelect(genre)}
                className={`genre-button ${selectedGenre == genre ? "selected" : ''}`}>
                    <img src={icon} className="genre-icon"/>
                    <span className="genre-label">{genre}</span>
                </button>
            ))}
        </div>
    );
}

