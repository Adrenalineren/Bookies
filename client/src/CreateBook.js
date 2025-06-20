import { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {Navigate} from 'react-router-dom';
import Editor from "./Editor";

export default function CreateBook() {
    const [title,setTitle] = useState('');
    const [review,setReview] = useState('');
    const [content,setContent] = useState('');
    const [files, setFiles] = useState('');
    const [genre, setGenre] = useState([]);
    const [rating, setRating] = useState(0);
    const [redirect, setRedirect] = useState(false);

    function handleGenreSelect(ev){
        const { value, checked } = ev.target;
        if (checked) {
            setGenre(prev => [...prev,value]);
        } else {
            setGenre(prev => prev.filter(genre => genre != value));
        }
    }
    async function createNewPost(ev) {
        const data = new FormData();
        data.set('title', title);
        data.set('review', review);
        data.set('content', content);
        data.set('file', files[0]);
        data.set('genres', JSON.stringify(genre));
        data.set('rating', rating);

        ev.preventDefault();
        console.log(files)
        const response = await fetch('http://localhost:4000/post', {
            method: 'POST',
            body: data, 
            credentials: 'include',
         });
         if (response.ok) {
            setRedirect(true);
         }
    }

    if (redirect) {
        return <Navigate to = {'/'}/>
    }
    return(
        <form onSubmit={createNewPost}>
            <input type="title" 
                placeholder="Title" 
                value={title} 
                onChange={ev => setTitle(ev.target.value)} />
            <div className="genres-input">
                <span>Genres: </span>
                {["Fantasy", "Romance", "Fiction", "Non Fiction"].map(genre => (
                <label key={genre} className="genre-option">
                    <input type="checkbox" value={genre} onChange={handleGenreSelect} className="genre-option"/>
                    <span>{genre}</span>
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
            <Editor value={content} onChange={setContent}/>
            <button className="button-hover" style={{marginTop:'5px'}}>Done!</button>
        </form>
    );
}