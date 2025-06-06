import { useParams } from "react-router-dom";
import React, { useState, useEffect} from "react";
import {format} from 'date-fns';

export default function PostPage() {
    const [postInfo, setPostInfo] = useState(null);
    const {id} = useParams();
    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then(response => {
                response.json().then(postInfo => {
                    setPostInfo(postInfo);
                });
            });
    }, []);

    if (!postInfo) return '';

return (
    <div className="post-page">
        <h1>{postInfo.title}</h1>
        {postInfo.createdAt && (
            <time>{format(new Date(postInfo.createdAt), 'dd MMM, yyyy')}</time>
        )}
        {postInfo.author && (
            <div className="author">Review by {postInfo.author.username}</div>
        )}
        <div className="image">
            <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postInfo.content }} />
    </div>
);

}