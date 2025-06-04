import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";


const ProfilePage = () => {
    const {userInfo} = useContext(UserContext);
    const [user, setUser] = useState({
        name: userInfo.username,
        bio: "",
        avatar: "",
    });

    const [editMode, setEditMode] = useState(false); 
    const [tempBio, setBio] = useState("");
    const [tempAvatar, setAvatar] = useState("");

    useEffect(() => {
        fetch('http://localhost:4000/user',{
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((user) => {
                setUser({
                    name: user.username,
                    bio: user.bio || "",
                    avatar: user.avatar || "",
                });
            setBio(user.bio || "");
            setAvatar(user.avatar || "");
        });
    }, []);



    const saveChanges = async() => {
        setUser({
            ...user,
            bio: tempBio,
            avatar: tempAvatar,
        });
        setEditMode(false);

        await fetch('http://localhost:4000/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            bio: tempBio,
            avatar: tempAvatar,
        }),
        });

    };
    
    return (
        <div className="profile-container">
            {
                editMode? (
                    <>
                    <h1>{userInfo.username}</h1>
                    <labe>Avatar</labe>
                    <input 
                        type = "text" 
                        placeholder="Paste an image link here"
                        value={tempAvatar} 
                        onChange={(e) => setAvatar(e.target.value)} 
                    />
                    <label>Bio</label>
                    <textarea
                        placeholder="Add a bio"
                        value={tempBio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                    <button onClick={saveChanges}>Save</button>
                    </>
                ) : (
                    <>
                    {user.avatar && (
                        <img src={user.avatar} alt="Profile" className="profile-avatar" />
                    )}
                    <h1 className="profile-name">{user.name}</h1>
                    <label>Bio:</label>
                    <p className="profile-bio">{user.bio}</p>
                    <button onClick={() => setEditMode(true)}>Edit Profile</button>
                
                    </>
                )}
        </div>
    );
};

export default ProfilePage;