import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import "./charactersAdmin.scss";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";

const characterTab = () => {
  const [characters, setCharacters] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    netWorth: "",
    imageURL: "",
  });
  const [loading, setLoading] = useState(false);

  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", formData.imageURL);
    data.append("upload_preset", "characters");
    data.append("cloud_name", "dwnqwdgey");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dwnqwdgey/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleAddNewChar = async () => {
    try {
      setLoading(true);
      const imageUrl = await uploadImage();
      await addDoc(collection(db, "characters"), {
        ...formData,
        imageURL: imageUrl,
      });

    } catch (error) {
      console.log(error.message);
    } finally {
      setShowForm(false);
      setFormData({ name: "", netWorth: "", imageURL: "" });
      setLoading(false);
      fetchCharacters();
    }
  };
  // Fetch characters from Firestore

  const fetchCharacters = async () => {
    try {
      setLoader(true);
      const charactersCollection = collection(db, "characters");
      const characterSnapshot = await getDocs(charactersCollection);

      const characterList = characterSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCharacters(characterList);
    } catch (err) {
      console.log("Error fetching characters:", err.message);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const deleteCharacter = async (id) => {
    try {
      const charDoc = doc(db, "characters", id);
      await deleteDoc(charDoc);
    } catch (err) {
      console.log("error deleting the character", id);
    } finally {
      fetchCharacters();
    }
  };

  return (
    <div dir="rtl">
      {showForm ? (
        <div className="add-character-form">
          <IoIosCloseCircleOutline
            className="close"
            onClick={() => setShowForm(false)}
          />
          <div className="form">
            <h2>إضافة شخصية جديدة</h2>
            <label>
              الاسم:
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </label>
            <label>
              الثروة:
              <input
                type="number"
                required
                value={formData.netWorth}
                onChange={(e) =>
                  setFormData({ ...formData, netWorth: e.target.value })
                }
              />
            </label>
            <input
              type="file"
              placeholder="upload the image"
              required
              onChange={(e) =>
                setFormData({ ...formData, imageURL: e.target.files[0] })
              }
            />
            <button onClick={handleAddNewChar} disabled={loading}>
              {loading ? <div className="loader"></div> : "إضافة"}
            </button>
          </div>
        </div>
      ) : null}
      <button className="add-character" onClick={() => setShowForm(true)}>
        <IoIosAddCircleOutline />
        <span>إضافة شخصية</span>
      </button>
      <div className="characters">
        {loader ? (
          <div
            className="loader"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          ></div>
        ) : (
          characters.map((char) => (
            <div key={char.id} className="character-row">
              <div className="character-details">
                <h3>{char.name}</h3>
                <p>Net Worth: ${char.netWorth.toLocaleString()}</p>
              </div>
              <button
                className="delete-character"
                onClick={() => deleteCharacter(char.id)}
              >
                <FaRegTrashAlt />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default characterTab;
