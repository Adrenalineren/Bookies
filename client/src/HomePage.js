import Post from "./Post";
import SearchBar from "./components/SearchBar";
import GenreFilter from "./components/GenreFilter";
import { useState, useEffect } from "react";

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [query, setQuery] = useState(''); //for Search
    const [filteredPosts, setFilteredPosts] = useState([]);
    

    useEffect(() => {
        fetch('http://localhost:4000/post').then(response => {
            response.json().then(posts => {
                setPosts(posts);
                setFilteredPosts(posts);
            });
        });
    }, []);

    useEffect(() => {
        handleSearch();
    }, [selectedGenre]);

    //for Genre filter & Search
    const handleSearch = () => {
        let result = posts;
        if (selectedGenre) {
            result = result.filter(post => post.genres.includes(selectedGenre));
        }

        if (query) {
            const lowerQuery = query.toLowerCase();
            result = result.filter(post =>
                post.title.toLowerCase().includes(lowerQuery)
            );
        }
        setFilteredPosts(result);
    }
        

    const clearFilters = () => {
        setSelectedGenre('');
        setQuery('');
        setFilteredPosts(posts);
    }

    return (
        <>
        <GenreFilter selectedGenre={selectedGenre} onSelect={setSelectedGenre}/>
        {(selectedGenre || query) && (
            <button 
            onClick={clearFilters}
            className="clear-filter-button">
                Clear Filters/Search
            </button>
        )}
        <SearchBar value={query} onChange={setQuery} onSearch={handleSearch}/>

            {filteredPosts.length > 0 ? (filteredPosts.map(post =>(
                <Post key={post._id} {...post} />
            ))
        ) : (
            <p>No books found</p>
        )}
        </>
    );
}
/*
{posts.length > 0 && posts.map(post => (
                <Post {...post} />    
            ))}
*/