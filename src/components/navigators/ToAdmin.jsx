import { useNavigate } from 'react-router';
const ToAdmin = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate('/admin');
      }}
      className="btn"
    >
      Back to Admin Dashboard
    </button>
  );
};

export default ToAdmin;
