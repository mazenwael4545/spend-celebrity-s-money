import { useEffect, useState } from "react";
import Header from "../components/Header";
import "./main.scss";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

const Main = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [characters, setCharacters] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const characterCollectionRef = collection(db, "characters");

  useEffect(() => {
    const getCharacters = async () => {
      try {
        setLoading(true);
        const data = await getDocs(characterCollectionRef);
        const filterdData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCharacters(filterdData);
      } catch (err) {
        console.log(`error fetching data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    getCharacters();
  }, []);

  const choosingCharacter = () => {
    navigate("/products", {
      state: characters.find((char) => char.id === selectedId),
    });
  };

  return (
    <div className="main">
      <Header />
      <div className="container">
        <div className="top">
          <h2>choose a Celebrity</h2>
          <button
            className="button"
            onClick={choosingCharacter}
            disabled={selectedId ? false : true}
            style={{ cursor: selectedId ? "pointer" : "not-allowed" }}
          >
            next
          </button>
        </div>
        <div className="characters" dir="rtl">
          {loading ? (
            <div className="loader"></div>
          ) : characters.length === 0 ? (
            <p style={{ color: "white", textAlign: "center" }}>
              لا توجد شخصيات مضافة بعد.
            </p>
          ) : (
            characters.map((char) => (
              <div
                className={`character ${
                  selectedId === char.id ? "selected" : ""
                }`}
                onClick={() => setSelectedId(char.id)}
                key={char.id}
              >
                <img src={char.imageURL} alt={char.image} />
                <span className="name">{char.name}</span>
                <span className="balance">
                  ${Number(char.netWorth).toLocaleString()}
                </span>
              </div>
            ))
          ) }
        </div>
      </div>
    </div>
  );
};

export default Main;
