import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

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
    
    const {userInfo: user} = useContext(UserContext);
    const handleUnfriend = async () => {
        try {
            const res = await fetch (`http://localhost:4000/unfriend/${friendId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({userId: user._id}),
            });

            if (res.ok) {
                navigate('/friends');
            } else {
                console.error('Unfriend failed');
            }
        } catch (err) {
            console.error(err);
        }
    };
    


    if (!friend) return <div>Loading friend profile...</div>

    return (
        <div className="friend-profile-page">
            <h2>{friend.username}'s book reviews</h2>
            <p>Bio: {friend.bio}</p>
            <ul className="book-posts">
                {posts.map(post => (
                    <li key={post._id} className="book-post">
                        <h3>{post.title}</h3>
                        <p>{post.review}</p>
                    </li>
                ))}
            </ul>
            <button className= "button-hover" onClick={handleUnfriend}>Unfriend</button>
        </div>
    )
}