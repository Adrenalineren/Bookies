import {format} from 'date-fns';
import {Link} from "react-router-dom";

export default function Post({_id, title, review, content, cover, createdAt, author}) {
    return (
        <div className="post">
            <div className="image">
                <Link to = {`/post/${_id}`}>
                <img src={'http://localhost:4000/' + cover} alt=""/>
                </Link>
            </div>
            <div className="texts">
                <Link to = {`/post/${_id}`}>
                    <h3>{title}</h3>
                </Link>
                <p className="info">
                    <a className="author">Review by {author.username}</a>
                    <time>{format(new Date(createdAt), 'MMM d, yyyy')}</time>
                </p>
                <p className="review">{review}</p>
            </div>
        </div>
    );
}