import "./CommentItem.scss";

const CommentItem = ({ comment, users }) => {
  function getUser(users, user_id) {
    for (const user of users) {
      if (user.id === user_id) {
        return user;
      }
    }

    return {
      id: 0,
      avatars: {
        small: "https://s3-storage.lbdy.ru/avatars/0_small.jpg",
      },
      first_name: "Пользователь",
      middle_name: "",
    };
  }
  const user = getUser(users, comment.user_id);
  // const user = users.filter((user) => user.id === comment.user_id)[0];
  const userName = user.first_name + " " + user.last_name;
  const userAvatar = user.avatars.small;
  return (
    <div className="commentItem__wrapper">
      <div className="commentItem__avatar">
        <img src={userAvatar} alt="" />
      </div>
      <div className="commentItem__texts">
        <div className="commentItem__user">{userName}</div>
        <div className="commentItem__message">{comment.message}</div>
      </div>
    </div>
  );
};
export default CommentItem;
