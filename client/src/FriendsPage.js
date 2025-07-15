import { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";

export default function FriendsPage() {
    const { userInfo } = useContext(UserContext);
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        //loading the existing friends
        fetch('http://localhost:4000/friends', {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => setFriends(data));
    }, []);
    
    const handleSearch = () => {
        fetch(`https://localhost:4000/search-users?query=${search}`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => setResults(data));
    };

    const addFriend = (friendId) => {
        fetch('http://localhost:4000/add-friend', {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({friendId}), //to refresh friends list
        })
            .then(res => res.json())
            .then(updated => setFriends(updated));
    }

    return (
        <div className="friends=page">
            <img src="https://static.vecteezy.com/system/resources/thumbnails/021/243/357/small/mom-and-kids-sit-on-floor-with-book-and-enthusiastically-read-interesting-stories-png.png" alt="Friends icon" className="friends-icon"/>
            <div className="search-section">
                <input 
                    type="text"
                    placeholder="Search usernames"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="button-hover" onClick={handleSearch}>Search</button>
            </div>
            <div className="search-results">
                {results.map(user => (
                    <div key={user._id} className="user-result">
                        <img src={`http://localhost:4000${user.avatar}`} alt = "avatar" width={50} height={50}/>
                        <span>{user.username}</span>
                        <button onClick={() => addFriend(user._id)}>Add Friend</button>
                    </div>
                ))}
            </div>

            <hr />

            <h2>Your Friends</h2>
            <div className="friends-list">
                {friends.map(friends => (
                    <div key={friends._id} className="friend-card">
                        <img src={`http://localhost:4000${friends.avatar}`} alt="avatar" width={60} height={60}/>
                        <div>{friends.username}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}