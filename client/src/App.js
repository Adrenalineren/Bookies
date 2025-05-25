import './App.css';

function App() {
  return (
    <main>
      <header>
        <a href="#" className="logo">Bookies</a>
        <nav>
          <a href="#">Login</a>
          <a href="#">Register</a>
        </nav>
      </header> 
      <div className="post">
        <div className="image">
          <img 
          src="https://img.pikbest.com/wp/202435/of-books-and-opened-book-on-the-top-cartoon-illustration_10770955.jpg!bw700"
          alt="stack of books picture"
        />
        </div>
        <div className="texts">
           <h3>The Russian Revolution</h3>
           <p>very educational</p>
        </div>
      </div>
      <div className="post">
        <div className="image">
          <img 
          src="https://img.pikbest.com/wp/202435/of-books-and-opened-book-on-the-top-cartoon-illustration_10770955.jpg!bw700"
          alt="stack of books picture"
        />
        </div>
        <div className="texts">
           <h3>The Perks of being a Wallflower</h3>
           <p>why so depressing bro...</p>
        </div>
      </div>
      <div className="post">
        <div className="image">
          <img 
          src="https://img.pikbest.com/wp/202435/of-books-and-opened-book-on-the-top-cartoon-illustration_10770955.jpg!bw700"
          alt="stack of books picture"
        />
        </div>
        <div className="texts">
           <h3>All the light we cannot see</h3>
           <p>once again, why so depressing bro...</p>
        </div>
      </div>
    </main>
  );
}

export default App;
