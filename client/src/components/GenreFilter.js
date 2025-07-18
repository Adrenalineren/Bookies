

const genreIcons = {
  Fiction: "/FictionBook.png",
  "Non Fiction": "/NonFictionBook.png",
  Romance: "/RomanceBook.png",
  Fantasy: "/FantasyBook.png",
  Mystery: "/MysteryBook.png",
  Horror: "/HorrorBook.png",
  History: "/HistoryBook.png",
  Poetry: "/PoetryBook.png",
  "Science Fiction": "/ScienceFictionBook.png",
  Academia: "/AcademiaBook.png",
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

