import { Link } from 'react-router-dom';
import './AboutUniversityPage.scss'
import { TabBar } from 'widgets/TabBar';
import { useEffect } from 'react';


const AboutUniversityPage = () => {

    useEffect(() => {
        document.title = 'Элбади - Об университете'
    }, [])

    return (
        <div className="main-container main-container_about-university">
                <div className="aboutUniversity__main">
                <div className="aboutUniversity__inDevelopment">
                    <p>Данная страница находится в разработке</p>
                    <Link className to='/'>
                        На главную
                    </Link>
                </div>
                </div>
        </div>
    );
};

export default AboutUniversityPage;
