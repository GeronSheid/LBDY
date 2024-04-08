import { Link } from "react-router-dom"
import { LANDING_PATH } from "shared/consts/paths"
import './header.scss';



const Header = ({auth, title}) => {
    return (
        <header className={auth ? "header header_auth" : "header"}>
            <div className="logo">
                <Link className="logo__link" to={LANDING_PATH}>
                    <img src="https://s3-storage.lbdy.ru/landing/img/logo.svg" alt="" />
                    <img src="https://s3-storage.lbdy.ru/landing/img/logo-sign.svg" alt="" />
                </Link>
            </div>
            <legend className="header__title">
                {title}
            </legend>
        </header>
    )
}

export default Header