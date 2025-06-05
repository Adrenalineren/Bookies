export default function Post({title, review, content, cover}) {
    return (
        <div className="post">
            <div className="image">
            <img src={'http://localhost:4000/' + cover} alt=""/>
            </div>
            <div className="texts">
                <h3>{title}</h3>
                {/*
                <p className="info">
                    <a className="author">Leon Trosky;</a>
                    <genre> history</genre>
                </p>
                */}
                <p className="review">{review}</p>
            </div>
        </div>
    );
}