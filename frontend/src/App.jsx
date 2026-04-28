import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  // One-to-One: Person & Passport
  const [persons, setPersons] = useState([]);
  const [personName, setPersonName] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [selectedPersonForPassport, setSelectedPersonForPassport] =
    useState("");

  // One-to-Many: Customer & Orders
  const [customers, setCustomers] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [orderItem, setOrderItem] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  // Many-to-One: Books & Author (inverse of One-to-Many)
  const [authors, setAuthors] = useState([]);
  const [authorName, setAuthorName] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [selectedAuthorId, setSelectedAuthorId] = useState("");

  // Many-to-Many: Actors & Movies
  const [actors, setActors] = useState([]);
  const [movies, setMovies] = useState([]);
  const [actorName, setActorName] = useState("");
  const [movieTitle, setMovieTitle] = useState("");
  const [selectedActorId, setSelectedActorId] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState("");

  useEffect(() => {
    fetchPersons();
    fetchCustomers();
    fetchAuthors();
    fetchActors();
    fetchMovies();
  }, []);

  // One-to-One: Person & Passport
  const fetchPersons = async () => {
    try {
      const response = await axios.get("http://localhost:5000/persons");
      setPersons(response.data);
      if (response.data.length > 0 && !selectedPersonForPassport)
        setSelectedPersonForPassport(response.data[0]._id);
    } catch (error) {
      console.error("Error fetching persons:", error);
    }
  };

  const handleAddPerson = async () => {
    if (!personName) return;
    try {
      await axios.post("http://localhost:5000/persons", { name: personName });
      setPersonName("");
      fetchPersons();
    } catch (error) {
      console.error("Error adding person:", error);
    }
  };

  const handleAddPassport = async () => {
    if (!passportNumber || !selectedPersonForPassport) return;
    try {
      await axios.post(
        `http://localhost:5000/persons/${selectedPersonForPassport}/passport`,
        { number: passportNumber },
      );
      setPassportNumber("");
      fetchPersons();
    } catch (error) {
      console.error("Error adding passport:", error);
    }
  };

  // One-to-Many: Customer & Orders
  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/customers");
      setCustomers(response.data);
      if (response.data.length > 0 && !selectedCustomerId)
        setSelectedCustomerId(response.data[0]._id);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleAddCustomer = async () => {
    if (!customerName) return;
    try {
      await axios.post("http://localhost:5000/customers", {
        name: customerName,
      });
      setCustomerName("");
      fetchCustomers();
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const handleAddOrder = async () => {
    if (!orderItem || !selectedCustomerId) return;
    try {
      await axios.post(
        `http://localhost:5000/customers/${selectedCustomerId}/orders`,
        { item: orderItem },
      );
      setOrderItem("");
      fetchCustomers();
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  // Many-to-One: Books & Author (view from books perspective)
  const fetchAuthors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/authors");
      setAuthors(response.data);
      if (response.data.length > 0 && !selectedAuthorId)
        setSelectedAuthorId(response.data[0]._id);
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  };

  const handleAddAuthor = async () => {
    if (!authorName) return;
    try {
      await axios.post("http://localhost:5000/authors", { name: authorName });
      setAuthorName("");
      fetchAuthors();
    } catch (error) {
      console.error("Error adding author:", error);
    }
  };

  const handleAddBook = async () => {
    if (!bookTitle || !selectedAuthorId) return;
    try {
      await axios.post(
        `http://localhost:5000/authors/${selectedAuthorId}/books`,
        { title: bookTitle },
      );
      setBookTitle("");
      fetchAuthors();
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  // Many-to-Many: Actors & Movies
  const fetchActors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/actors");
      setActors(response.data);
      if (response.data.length > 0 && !selectedActorId)
        setSelectedActorId(response.data[0]._id);
    } catch (error) {
      console.error("Error fetching actors:", error);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/movies");
      setMovies(response.data);
      if (response.data.length > 0 && !selectedMovieId)
        setSelectedMovieId(response.data[0]._id);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleAddActor = async () => {
    if (!actorName) return;
    try {
      await axios.post("http://localhost:5000/actors", { name: actorName });
      setActorName("");
      fetchActors();
    } catch (error) {
      console.error("Error adding actor:", error);
    }
  };

  const handleAddMovie = async () => {
    if (!movieTitle) return;
    try {
      await axios.post("http://localhost:5000/movies", { title: movieTitle });
      setMovieTitle("");
      fetchMovies();
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  const handleAssignActorToMovie = async () => {
    if (!selectedActorId || !selectedMovieId) return;
    try {
      await axios.post("http://localhost:5000/assign", {
        actorId: selectedActorId,
        movieId: selectedMovieId,
      });
      fetchActors();
      fetchMovies();
    } catch (error) {
      console.error("Error assigning actor to movie:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Database Relationships Showcase</h1>

      {/* One-to-One: Person & Passport */}
      <div style={styles.card}>
        <h2>1. One-to-One: Person & Passport</h2>

        <section style={styles.section}>
          <h3>Create Person</h3>
          <input
            type="text"
            placeholder="Person name"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleAddPerson} style={styles.button}>
            Add Person
          </button>
        </section>

        <section style={styles.section}>
          <h3>Create Passport for Person</h3>
          <select
            value={selectedPersonForPassport}
            onChange={(e) => setSelectedPersonForPassport(e.target.value)}
            style={styles.select}
          >
            <option value="" disabled>
              Select Person
            </option>
            {persons.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Passport number"
            value={passportNumber}
            onChange={(e) => setPassportNumber(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleAddPassport} style={styles.button}>
            Add Passport
          </button>
        </section>

        <section style={styles.section}>
          <h3>Directory</h3>
          {persons.map((person) => (
            <div key={person._id} style={styles.item}>
              <strong>{person.name}</strong>
              {person.passport ? (
                <span> - Passport: {person.passport.number}</span>
              ) : (
                <span> - No passport assigned</span>
              )}
            </div>
          ))}
        </section>
      </div>

      {/* One-to-Many: Customer & Orders */}
      <div style={styles.card}>
        <h2>2. One-to-Many: Customer & Orders</h2>

        <section style={styles.section}>
          <h3>Create Customer</h3>
          <input
            type="text"
            placeholder="Customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleAddCustomer} style={styles.button}>
            Add Customer
          </button>
        </section>

        <section style={styles.section}>
          <h3>Create Order for Customer</h3>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            style={styles.select}
          >
            <option value="" disabled>
              Select Customer
            </option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Order item"
            value={orderItem}
            onChange={(e) => setOrderItem(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleAddOrder} style={styles.button}>
            Add Order
          </button>
        </section>

        <section style={styles.section}>
          <h3>Customer Directory</h3>
          {customers.map((customer) => (
            <div key={customer._id} style={styles.item}>
              <strong>{customer.name}</strong>
              <div style={styles.subList}>
                Orders:
                <ul style={styles.list}>
                  {customer.orders && customer.orders.length > 0 ? (
                    customer.orders.map((order) => (
                      <li key={order._id}>{order.item}</li>
                    ))
                  ) : (
                    <li>No orders yet</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Many-to-One: Books & Author */}
      <div style={styles.card}>
        <h2>3. Many-to-One: Books & Author</h2>

        <section style={styles.section}>
          <h3>Create Author</h3>
          <input
            type="text"
            placeholder="Author name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleAddAuthor} style={styles.button}>
            Add Author
          </button>
        </section>

        <section style={styles.section}>
          <h3>Create Book for Author</h3>
          <select
            value={selectedAuthorId}
            onChange={(e) => setSelectedAuthorId(e.target.value)}
            style={styles.select}
          >
            <option value="" disabled>
              Select Author
            </option>
            {authors.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Book title"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleAddBook} style={styles.button}>
            Add Book
          </button>
        </section>

        <section style={styles.section}>
          <h3>Author Directory</h3>
          {authors.map((author) => (
            <div key={author._id} style={styles.item}>
              <strong>{author.name}</strong>
              <div style={styles.subList}>
                Books:
                <ul style={styles.list}>
                  {author.books && author.books.length > 0 ? (
                    author.books.map((book) => (
                      <li key={book._id}>{book.title}</li>
                    ))
                  ) : (
                    <li>No books yet</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Many-to-Many: Actors & Movies */}
      <div style={styles.card}>
        <h2>4. Many-to-Many: Actors & Movies</h2>

        <section style={styles.section}>
          <h3>Create Actor</h3>
          <input
            type="text"
            placeholder="Actor name"
            value={actorName}
            onChange={(e) => setActorName(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleAddActor} style={styles.button}>
            Add Actor
          </button>
        </section>

        <section style={styles.section}>
          <h3>Create Movie</h3>
          <input
            type="text"
            placeholder="Movie title"
            value={movieTitle}
            onChange={(e) => setMovieTitle(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleAddMovie} style={styles.button}>
            Add Movie
          </button>
        </section>

        <section style={styles.section}>
          <h3>Assign Actor to Movie</h3>
          <select
            value={selectedActorId}
            onChange={(e) => setSelectedActorId(e.target.value)}
            style={styles.select}
          >
            <option value="" disabled>
              Select Actor
            </option>
            {actors.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>
          <select
            value={selectedMovieId}
            onChange={(e) => setSelectedMovieId(e.target.value)}
            style={styles.select}
          >
            <option value="" disabled>
              Select Movie
            </option>
            {movies.map((m) => (
              <option key={m._id} value={m._id}>
                {m.title}
              </option>
            ))}
          </select>
          <button onClick={handleAssignActorToMovie} style={styles.button}>
            Assign
          </button>
        </section>

        <section style={styles.section}>
          <h3>Actors Directory</h3>
          {actors.map((actor) => (
            <div key={actor._id} style={styles.item}>
              <strong>{actor.name}</strong>
              <div style={styles.subList}>
                Movies:
                <ul style={styles.list}>
                  {actor.movies && actor.movies.length > 0 ? (
                    actor.movies.map((movie) => (
                      <li key={movie._id}>{movie.title}</li>
                    ))
                  ) : (
                    <li>No movies assigned</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </section>

        <section style={styles.section}>
          <h3>Movies Directory</h3>
          {movies.map((movie) => (
            <div key={movie._id} style={styles.item}>
              <strong>{movie.title}</strong>
              <div style={styles.subList}>
                Actors:
                <ul style={styles.list}>
                  {movie.actors && movie.actors.length > 0 ? (
                    movie.actors.map((actor) => (
                      <li key={actor._id}>{actor.name}</li>
                    ))
                  ) : (
                    <li>No actors assigned</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    background: "linear-gradient(135deg, teal 0%, darkteal 100%)",
    minHeight: "100vh",
  },
  title: {
    textAlign: "center",
    color: "white",
    marginBottom: "30px",
  },
  card: {
    background: "white",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "30px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  section: {
    marginBottom: "20px",
    padding: "15px",
    background: "#f9f9f9",
    borderRadius: "5px",
  },
  input: {
    padding: "8px",
    margin: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  select: {
    padding: "8px",
    margin: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    padding: "8px 15px",
    margin: "5px",
    backgroundColor: "teal",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  item: {
    padding: "10px",
    margin: "5px 0",
    background: "white",
    borderRadius: "4px",
    border: "1px solid #e0e0e0",
  },
  subList: {
    marginLeft: "20px",
    marginTop: "5px",
  },
  list: {
    margin: "5px 0",
    paddingLeft: "20px",
  },
};

export default App;
