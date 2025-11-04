import { Outlet } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import './applayout.css';
import ChatBot from '../components/chatbot';

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Header />
      <main className="content">
        <Outlet />
      </main>
      <ChatBot/>
      <Footer />
    </div>
  );
};

export default AppLayout;
