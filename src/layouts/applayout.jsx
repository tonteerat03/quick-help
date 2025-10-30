import { Outlet } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import './applayout.css';

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Header />
      <main className="content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
