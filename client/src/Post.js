export default function Post() {
    return (
        <div className="post">
            <div className="image">
            <img 
            src="https://png.pngtree.com/png-vector/20240201/ourmid/pngtree-aesthetic-book-illustration-png-image_11530249.png"
            alt="stack of books picture"
            />
            </div>
            <div className="texts">
                <h3>The Russian Revolution</h3>
                <p className="info">
                    <a className="author">Leon Trosky;</a>
                    <genre> history</genre>
                </p>
                <p className="review">The Russian Revolution: A New History is a political history of the Russian Revolution written by Sean McMeekin and published by Basic Books in 2017. The release was timed with the 100th anniversary of the Russian Revolution.</p>
            </div>
        </div>
    );
}