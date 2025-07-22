import { useParams } from "react-router-dom";
import React, { useState, useEffect, useContext} from "react";
import {format} from 'date-fns';
import { UserContext } from "./UserContext";
import { Link } from "react-router-dom";

export default function PostPage() {
    const [postInfo, setPostInfo] = useState(null);
    const {id} = useParams();
    const {userInfo} = useContext(UserContext);
    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then(response => {
                response.json().then(postInfo => {
                    setPostInfo(postInfo);
                });
            });
    }, []);

    if (!postInfo) return '';

    function handleDelete() {
        const confirmed = window.confirm("Are you sure you want to delete the review?")
        if (!confirmed) return;

        fetch(`http://localhost:4000/post/${id}`,{
            method: 'DELETE',
            credentials: 'include',   
        }).then(response => {
            if (response.ok) {
                window.location.href = '/';
            } else {
                alert('Failed to delete the review.')
            }
        });
    }


return (
    <div className="post-page">
        <h1>{postInfo.title}</h1>
        {postInfo.createdAt && (
            <time>{format(new Date(postInfo.createdAt), 'dd MMM, yyyy')}</time>
        )}
        {postInfo.author && (
            <div className="author">Review by {postInfo.author.username}</div>
        )}
        {postInfo.genres && (
            <div className="genres">
                <strong>Genres: </strong>
                {Array.isArray(postInfo.genres) 
                    ? postInfo.genres.join(', ')
                    : postInfo.genres}
            </div>
        )}
        {postInfo.rating && (
            <div className="rating">
                <strong>Rating: </strong>
                {'★'.repeat(postInfo.rating)}{'☆'.repeat(5 - postInfo.rating)}
            </div>
        )}

        <div className="image">
            <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
        </div>
        {userInfo.id === postInfo.author._id && (
            <div className="edit-row">
                <Link className= "edit-btn" to={`/edit/${postInfo._id}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    Edit
                </Link>

                <button className="delete-btn" onClick={handleDelete}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
                        viewBox="0 0 24 24" strokeWidth={1.5} 
                        stroke="currentColor" className="size-6" 
                        width="20" height="20">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V4.5a1.5 1.5 0 0 1 
                        1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5V7m-6 0h6m1.5 0v12a2.25 
                        2.25 0 0 1-2.25 2.25H8.25A2.25 2.25 0 0 1 6 
                        19.5V7h12z" />
                    </svg>
                    Delete
                </button>
            </div>
        )}
        <div className= "content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
    </div>
);

}