import { useEffect, useState } from "react";
import {Navigate, useParams} from 'react-router-dom';
import Editor from "./Editor";

export default function EditPost() {
    const {id} = useParams();
    const [title,setTitle] = useState('');
    const [review,setReview] = useState('');
    const [content,setContent] = useState('');
    const [files, setFiles] = useState('');
    const [genre, setGenre] = useState([]);
    const [rating, setRating] = useState(0);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch('http://localhost:4000/post/' + id)
        .then(response => {
            response.json().then(postInfo => {
                setTitle(postInfo.title);
                setContent(postInfo.content);
                setReview(postInfo.review);
                setGenre(postInfo.genres || []);
                setRating(postInfo.rating || 0);
            });
        });
    }, []);

    function handleGenreSelect(ev){
        const { value, checked } = ev.target;
        if (checked) {
            setGenre(prev => [...prev,value]);
        } else {
            setGenre(prev => prev.filter(genre => genre != value));
        }
    }

    async function updatePost(ev) {
        ev.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('review', review);
        data.set('content', content);
        data.set('id', id);
        data.set('genres', JSON.stringify(genre));
        data.set('rating', rating);
        if (files?.[0]) {
            data.set('file', files?.[0]);
        }
        const response = await fetch('http://localhost:4000/post', {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });
        if (response.ok) {
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to = {'/post/' + id}/>
    }

    return(
        <form onSubmit={updatePost}>
            <input type="title" 
                placeholder="Title" 
                value={title} 
                onChange={ev => setTitle(ev.target.value)} />
            <div className="genres-input">
                <span>Genres: </span>
                {["Fantasy", "Romance", "Fiction", "Non Fiction"].map(g => (
                <label key={g} className="genre-option">
                    <input 
                    type="checkbox" 
                    checked={genre.includes(g)}
                    value={g} onChange={handleGenreSelect} 
                    className="genre-option"/>
                    <span>{g}</span>
                </label>
                ))}
            </div>
            <div className="rating-input">
                <span>Rating: </span>
                {[1,2,3,4,5].map((star) => (
                    <label key={star}>
                    <input type="radio" 
                    value={star} 
                    checked = {rating === star}
                    onChange={() => setRating(star)}
                    style={{display:"none"}}
                    required={star ===1}
                    />
                    <span style={{ 
                    cursor: "pointer",
                    color: star <= rating ? "#ffc107" : "#e4e5e9",
                    fontSize: "24px"
                    }}>
                        ★
                    </span>
                    </label>
                ))}
            </div>
            <input type="review" 
                placeholder="Review"
                value={review}
                onChange={ev => setReview(ev.target.value)} />
            <input type="file" 
                onChange={ev => setFiles(ev.target.files)}/>
            <Editor onChange={setContent} value={content}/>
            <button style={{marginTop:'5px'}}>Update!</button>
        </form>
    );
}