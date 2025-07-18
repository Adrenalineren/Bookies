import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function FriendProfilePage() {
    const {friendId} = useParams();
    const navigate = useNavigate();
    const [friend, setFriend] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchFriendData = async () => {
            try {
                const res = await fetch(`http://localhost:4000/friend/${friendId}`, {
                    credentials: 'include',
                });
                const data = await res.json();
                setFriend(data.friend);
                setPosts(data.posts);
            } catch (err) {
                console.error('Failed to fetch friend profile:', err);
            }
        };
        fetchFriendData();
    }, [friendId]);
    
    const handleUnfriend = async (friendId) => {
        try {
            await fetch (`http://localhost:4000/unfriend/${friendId}`, {
                method: 'POST',
                credentials: 'include',
            });
            navigate('/friends');
        } catch (err) {
            console.error('Unfriending failed:', err);
        }
    };

    if (!friend) return <div>Loading friend profile...</div>

    return (
        <div className="friend-profile-page">
            <h1>{friend.username}</h1>
            <p>Bio: {friend.bio}</p>
            <h2>{friend.username}'s Book Reviews</h2>
            <ul className="book-posts">
                {posts.map(post => (
                    <li key={post._id} className="book-post">
                        <h3>{post.title}</h3>
                        <p>{post.review}</p>
                    </li>
                ))}
            </ul>
            <button onClick={handleUnfriend}>Unfriend</button>
        </div>
    )
}