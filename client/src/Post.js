import {format} from 'date-fns';
export default function Post({title, review, content, cover, createdAt, author}) {
    return (
        <div className="post">
            <div className="image">
            <img src={'http://localhost:4000/' + cover} alt=""/>
            </div>
            <div className="texts">
                <h3>{title}</h3>
                <p className="info">
                    <a className="author">{author.username}</a>
                    <time>{format(new Date(createdAt), 'MMM d, yyyy')}</time>
                </p>
                <p className="review">{review}</p>
            </div>
        </div>
    );
}