import { useEffect, useState } from "react";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { db } from "../config/firebase";
import { addDoc, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { FaRegTrashAlt } from "react-icons/fa";
import "./productsAdmin.scss";

const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
    imageURL: "",
  });
  const [showForm, setShowForm] = useState(false);

  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", formData.imageURL);
    data.append("upload_preset", "products");
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

  const handleAddNewProd = async () => {
    try {
      setLoader(true);
      const imageURL = await uploadImage();
      await addDoc(collection(db, "products"), {
        ...formData,
        imageURL,
      });
    } catch (err) {
      console.log(err.message);
    } finally {
      setShowForm(false);
      setFormData({ title: "", price: 0, imageURL: "" });
      setLoader(false);
      fetchProducts();
    }
  };

  const fetchProducts = async () => {
    try {
      setLoader(true);
      const productsCollectionRef = collection(db, "products");
      const productsSnapshot = await getDocs(productsCollectionRef);

      const filteredProducts = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(filteredProducts);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id)=> {
    try{
      const prodDoc = doc(db, "products", id);
      await deleteDoc(prodDoc);
    }catch(err){
      console.log(err.message);
    }finally{
      fetchProducts()
    }
  }
  return (
    <div dir="rtl">
      {showForm ? (
        <div className="add-products-form">
          <IoIosCloseCircleOutline
            className="close"
            onClick={() => setShowForm(false)}
          />
          <div className="form">
            <h2>إضافة منتج جديدة</h2>
            <label>
              الاسم:
              <input
                type="text"
                name="name"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </label>
            <label>
              السعر:
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </label>
            <input
              type="file"
              placeholder="upload the image"
              onChange={(e) =>
                setFormData({ ...formData, imageURL: e.target.files[0] })
              }
            />
            <button disabled={loader} onClick={handleAddNewProd}>
              {loader ? <div className="loader"></div> : "إضافة"}
            </button>
          </div>
        </div>
      ) : null}
      <button className="add-product" onClick={() => setShowForm(true)}>
        <IoIosAddCircleOutline />
        <span>إضافة منتج</span>
      </button>
      <div className="products">
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
          products.map((prod) => (
            <div key={prod.id} className="prod-row">
              <div className="prod-details">
                <h3>{prod.title}</h3>
                <p>${Number(prod.price).toLocaleString()}</p>
              </div>
              <button className="delete-char" onClick={()=> deleteProduct(prod.id)}>
                <FaRegTrashAlt />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default ProductsTab;
