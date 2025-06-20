import { useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";


const ProfilePage = () => {
    const {userInfo} = useContext(UserContext);
    const [user, setUser] = useState({
        name: '',
        bio: "",
        avatar: "",
    })

    const [editMode, setEditMode] = useState(false); 
    const [tempBio, setBio] = useState('');
    const [tempAvatar, setAvatar] = useState('');

    useEffect(() => {

        if (!userInfo) return;

        /*
        setUser({
            name: userInfo.username || '',
            bio: userInfo.bio || "",
            avatar: userInfo.avatar || "",
        });
        setBio(userInfo.bio || "");
        setAvatar(userInfo.avatar || "");
        */

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
    }, [userInfo]);

     if (!userInfo) {
        return <Navigate to="/login" />;
    }   

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
                    <h1 className="profile-name">{user.name}</h1>
                    <label>Avatar</label>
                    <input 
                        type = "text" 
                        placeholder="Paste an image link here"
                        value={tempAvatar} 
                        onChange={(e) => setAvatar(e.target.value)} 
                        className="edit-input"
                    />
                    <label>Bio</label>
                    <input
                        type= "review"
                        placeholder="Add a bio"
                        value={tempBio}
                        onChange={(e) => setBio(e.target.value)}
                        className="edit-input"
                    />
                    <button onClick={saveChanges}>Save</button>
                    </>
                ) : (
                    <>
                    {user.avatar && (
                        <img src={user.avatar} alt="Profile" className="profile-avatar" />
                    )}
                    <h1 className="profile-name">{user.name}</h1>
                    <div className="bio">
                        <label>Bio:</label>
                        <p className="profile-bio">{user.bio}</p>
                    </div>
                    <button className= "button-hover" onClick={() => setEditMode(true)}>Edit Profile</button>
                
                    </>
                )}
        </div>
    );
};

export default ProfilePage;