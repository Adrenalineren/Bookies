import { useEffect, useContext, useState} from "react";

export default function ListPage() {
    const [items, setItems] = useState([]);
    const [draft, setDraft] = useState('');

    const handleKeyDown = e => {
        if (e.key === 'Enter' && draft.trim() !== '') {
            setItems(prev => [
            ...prev,
            { text: draft.trim(), checked: false }
        ]);
        setDraft("");
        }
    };

    const toggleChecked = (idx) => {
        setItems((prev) =>
            prev.map((it, i) =>
            i === idx ? { ...it, checked: !it.checked } : it
            )
        );
    };

    const deleteItem = (idxToDelete) => {
      setItems((prev) => prev.filter((_, i) => i !== idxToDelete));
    };

  useEffect(() => {
    fetch('http://localhost:4000/list', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.items) {
          setItems(data.items);
        }
      });
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    fetch('http://localhost:4000/list', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({items})
    });
  }, [items]);

  return (
    <div className="list-page">
      <img src='https://static.vecteezy.com/system/resources/previews/013/183/024/non_2x/love-book-reading-watercolor-books-hand-painted-free-png.png' alt="Book icon" className="book-icon"/>
      <h2 className="list-heading">My Reading List!</h2>
      <div className="list-container">
        {items.map((item, idx) => (
          <div key={idx} className="list-row">
            <input
              type="checkbox"
              className="list-checkbox"
              checked={item.checked}
              onChange={() => toggleChecked(idx)}
            />
            <span className="list-text">{item.text}</span>
            <button
              className="list-delete-button"
              onClick={() => deleteItem(idx)}
              >✖
              </button>
          </div>
        ))}

        <div className="list-row draft-row">
          <input
            type="text"
            placeholder="Type here and hit Enter!"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}