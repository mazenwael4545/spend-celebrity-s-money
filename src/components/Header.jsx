import "./header.scss";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-text">بعزق فلوس المشاهير</span>
        <img src="/dollar.png" className="logo-image" alt="" />
      </div>
    </header>
  );
};

export default Header;
