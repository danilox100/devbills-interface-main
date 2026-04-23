import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div>
      <h1 className="text-white">Header</h1>
      <Link to="/transacoes" className="text-white">
        Transações
      </Link>
    </div>
  );
};

export default Header;
