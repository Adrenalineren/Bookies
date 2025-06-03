import { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

export default function CreateBook() {
    const [title,setTitle] = useState('');
    const [details,setDetails] = useState('');
    const [content,setContent] = useState('');
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ]
    };
    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image',
    ];

    return(
        <form>
            <input type="title" placeholder="Title"/>
            <input type="details" placeholder="Details"/>
            <input type="file"/>
            <ReactQuill value = {content} modules={modules} formats={formats}/>
            <button style={{marginTop:'5px'}}>Done</button>
        </form>
    )
}