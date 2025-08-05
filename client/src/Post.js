import {format} from 'date-fns';
import {Link} from "react-router-dom";

export default function Post({_id, title, review, cover, createdAt, author, rating}) {
    return (
        <div className="post">
            <div className="image">
                <Link to = {`/post/${_id}`}>
                <img src={cover} alt=""/>
                </Link>
            </div>
            <div className="texts">
                <Link to = {`/post/${_id}`}>
                    <div className='post-title'>{title}</div>
                </Link>
                <div className="rating">
                    <strong>Rating: </strong>
                    {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                </div>
                <p className="info">
                    <span className="author">Review by {author.username}</span>
                    <time>{format(new Date(createdAt), 'MMM d, yyyy')}</time>
                </p>
                <p className="review">{review}</p>
            </div>
        </div>
    );
}