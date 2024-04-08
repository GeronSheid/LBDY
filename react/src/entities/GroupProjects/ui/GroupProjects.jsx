import "pages/MainPage/ui/sass/main.scss"

const GroupProjects = ({name, startDate, endDate, projectId, thisProject}) => {
    return (
        <div className="projects__grouped" id="groupedProjects">
            <button className="projects-item projects-item_btn">
                <span className="projects-item__name">
                    {name}
                </span>
                <div className="projects-item__info">
                    <span className="projects-item__date-range">
                        {`${startDate} - ${endDate}`}
                    </span>
                    <div className="projects-item__progress">
                        <span className="projects-item__progress-tasks">
                            9/13 задач
                        </span>
                        <svg
                            className="projects-item__progress-divider" width="4" height="4"
                            viewBox="0 0 4 4" xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle id="Ellipse 9" opacity="0.65" cx="2" cy="2" r="2" />
                        </svg>
                        <span className="projects-item__progress-percent">69%</span>
                    </div>
                </div>
                <div className="projects-item__bar">
                    <div className="projects-item__bar-inner"></div>
                </div>
                <div className="projects-item__group">
                    
                </div>
            </button>
        </div>
    );
};

export default GroupProjects;
