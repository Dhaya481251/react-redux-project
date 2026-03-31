import React,{ useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import AdminDashboard from '../../components/AdminDashboard/AdminDashboard';
import './AdminHome.css';
import UsersList from '../../components/UsersList/UsersList';
import EditUser from '../../components/EditUser/EditUser';
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar';

const AdminHome = () => {
  const [activeSection, setActivateSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection){
      case 'dashboard':
        return <AdminDashboard/>;
      case 'users':
        return <UsersList />;
      default:
        return <AdminDashboard/>;
    }
  }
  return (
    <>
    <div className='home'>
        <AdminSidebar activeSection={activeSection} onSectionChange={setActivateSection}/>
        <main className='main-content'>
          <AdminNavbar/>
          {renderContent()}
        </main>
    </div>
    </>
  )
}

export default AdminHome