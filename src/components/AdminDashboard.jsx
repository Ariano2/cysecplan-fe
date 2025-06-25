import { Link } from 'react-router';

const AdminDashboard = () => {
  return (
    <div className="drawer md:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button md:hidden"
        >
          Open Admin Drawer
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <li>
            <Link
              className="bg-base-300 p-4 mt-2 hover:bg-secondary rounded-lg"
              to="/create/workshop"
            >
              Create New Workshop
            </Link>
          </li>
          <li>
            <Link
              className="bg-base-300 p-4 mt-2 hover:bg-secondary rounded-lg"
              to="/manage/workshops"
            >
              Manage Join Requests
            </Link>
          </li>
          <li>
            <Link
              className="bg-base-300 p-4 mt-2 hover:bg-secondary rounded-lg"
              to="/manage/products"
            >
              Manage Products
            </Link>
          </li>
          <li>
            <Link
              className="bg-base-300 p-4 mt-2 hover:bg-secondary rounded-lg"
              to="/manage/articles"
            >
              Manage Articles
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
