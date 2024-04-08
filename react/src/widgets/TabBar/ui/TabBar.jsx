import Main from 'shared/assets/img/Main.svg';
import KNB from 'shared/assets/img/KNB.svg';
import University from 'shared/assets/img/University.svg';
import Profile from 'shared/assets/img/Profile.svg';
import { NavLink } from 'react-router-dom';
import './tabBar.scss'
import {ABOUT_UNIVERSITY, CONTACTS, KNOWLEDGE_BASE, MAIN_ROUTE, PROFILE, PROJECT, SERVICES} from "shared/consts/paths";

export const TabBar = () => {
  return (
    <div className="tabBar">
      <nav className="tabBar__nav">
        <ul className='tabBar__list'>
          <li className="tabBar__item">
            <NavLink
              className={({isActive}) => isActive ? "tabBar__link tabBar__link_active" : "tabBar__link"}
              to={MAIN_ROUTE}
            >
              <Main/>
            </NavLink>
          </li>
          <li className="tabBar__item">
            <NavLink
              className={({isActive}) => isActive ? "tabBar__link tabBar__link_active" : "tabBar__link"}
              to={KNOWLEDGE_BASE}
            >
              <KNB/>
            </NavLink>
          </li>
          <li className="tabBar__item">
            <NavLink
              className={({isActive}) => isActive ? "tabBar__link tabBar__link_active" : "tabBar__link"}
              to={ABOUT_UNIVERSITY}
            >
              <University/>
            </NavLink>
          </li>
          <li className="tabBar__item">
            <NavLink
              className={({isActive}) => isActive ? "tabBar__link tabBar__link_active" : "tabBar__link"}
              to={PROFILE}
            >
              <Profile/>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  )
}
