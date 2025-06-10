import Post from "./Post";
import SearchBar from "./components/SearchBar";
import { useState, useEffect } from "react";

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [query, setQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/post').then(response => {
            response.json().then(posts => {
                setPosts(posts);
                setFilteredPosts(posts);
            });
        });
    }, []);

    const handleSearch = () => {
        const lowerQuery = query.toLowerCase();
        const result = posts.filter(post =>
        post.title.toLowerCase().includes(lowerQuery)
        );
        setFilteredPosts(result);
  };

    return (
        <>
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