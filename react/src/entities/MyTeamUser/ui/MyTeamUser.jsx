import "./MyTeamUser.scss";
import { Link } from "react-router-dom";

const MyTeamUser = ({ user }) => {
  return (
    <Link
      to={`https://t.me/${user.tg_username}`}
      className="myTeamUser__wrapper"
    >
      <img
        src={user.avatars.medium}
        alt={user.first_name + user.middle_name}
        className="myTeamUser__avatar"
      />
      <div className="myTeamUser__info">
        <div className="myTeamUser__name">{` ${user.middle_name} ${user.first_name} ${user.last_name} `}</div>
        <div className="myTeamUser__phone">{`${user.phone.substring(4)}`}</div>
      </div>
    </Link>
  );
};

export default MyTeamUser;
