import "pages/MainPage/ui/sass/main.scss"
import {NavLink} from "react-router-dom";
import {ABOUT_UNIVERSITY, CONTACTS, KNOWLEDGE_BASE, MAIN_ROUTE, PROFILE, PROJECT, SERVICES} from "shared/consts/paths";

const Sidebar = () => {
    return (
        <nav className="nav">
            <div className="nav__list">

                    <NavLink className={({isActive}) => isActive ? "nav__link nav__link_active" : "nav__link"} to={MAIN_ROUTE} >
                        <span>Главная</span>
                    </NavLink>

                    <NavLink className={({isActive}) => isActive ? "nav__link nav__link_active" : "nav__link"} to={KNOWLEDGE_BASE} >
                        <span>База знаний</span>
                    </NavLink>


                    <NavLink className={({isActive}) => isActive ? "nav__link nav__link_active" : "nav__link"} to={ABOUT_UNIVERSITY} >
                        <span>Об университете</span>
                    </NavLink>


                    <NavLink className={({isActive}) => isActive ? "nav__link nav__link_active" : "nav__link"} to={PROFILE}>
                        <span>Профиль</span>
                    </NavLink>


                    <NavLink className={({isActive}) => isActive ? "nav__link nav__link_active" : "nav__link"} to={CONTACTS} >
                        <span>Контакты</span>
                    </NavLink>

            </div>
        </nav>
    );
};

export default Sidebar;
