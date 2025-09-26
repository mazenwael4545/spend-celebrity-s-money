import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./products.scss";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

const Products = () => {
  const location = useLocation();
  const character = location.state;
  const [netWorth, setNetWorth] = useState(Number(character.netWorth));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("انت لسه مسارفتش حاجة");
  const [showReceipt, setShowReceipt] = useState(false);

  if (!character) {
    return <div>No character selected</div>;
  }
  const productsCollectionRef = collection(db, "products");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productDocs = await getDocs(productsCollectionRef);
        const products = productDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const buyProduct = ({ id, price }) => {
    // adding the number of how many the product was bought
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              timesBought: product.timesBought ? product.timesBought + 1 : 1,
            }
          : product
      )
    );
    // making the calculations
    if (netWorth >= price) {
      setNetWorth(prev => prev - Number(price))
    }
  };

 const sellProduct = ({ id, price }) => {
  setProducts((prev) =>
    prev.map((product) =>
      product.id === id && product.timesBought && product.timesBought > 0
        ? {
            ...product,
            timesBought: product.timesBought - 1,
          }
        : product
    )
  );
  // Only add money back if the product was bought
  const prod = products.find((p) => p.id === id);
  if (prod?.timesBought && prod.timesBought > 0) {
    setNetWorth(prev=> prev + Number(price));
  }
};

  const boughtProducts = products.filter((prod) => "timesBought" in prod);
  useEffect(() => {
    if (boughtProducts.length > 0) {
      setShowReceipt(true);
      setMessage("تم بدء البعزقة");
    } else {
      setShowReceipt(false);
    }
  }, [boughtProducts]);

  return (
    <div className="products-page" dir="rtl">
      <header>
        <h1>{character.name}</h1>
        <div className="info">
          <div className="right">
            اللي متبقي معاك: {netWorth.toLocaleString()} $
          </div>
          <div className="left">{message}</div>
        </div>
      </header>
      <div className="products-container">
        {showReceipt ? (
          <div className="receipt-sidebar">
            <h1>الحساب</h1>
            <ul>
              {boughtProducts.map((prod) => (
                <li key={prod.id}>
                  {prod.title}...{prod.timesBought}X
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {loading ? (
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
          <div className="products">
            {products.map((product) => (
              <div className="product" key={product.id}>
                <img src={product.imageURL} alt="" />
                <div className="product-info">
                  <span className="product-title">{product.title}</span>
                  <span className="product-price">
                    ${product.price.toLocaleString()}
                  </span>
                  <div className="buttons">
                    <button onClick={() => buyProduct(product)}>buy</button>
                    <button onClick={()=> sellProduct(product)}>sell</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
