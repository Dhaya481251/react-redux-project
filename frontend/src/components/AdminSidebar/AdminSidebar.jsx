import React from 'react'
import './AdminSidebar.css'

const AdminSidebar = ({activeSection, onSectionChange}) => {
  return (
    <aside className="sidebar">
        <ul className='list1'>
            <li className={`list-items1 ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => onSectionChange('dashboard')}>Dashboard </li>
            <li className={`list-items1 ${activeSection === 'users' ? 'active' : ''}`} onClick={() => onSectionChange('users')}>User </li>
        </ul>
    </aside>
  )
}

export default AdminSidebar
