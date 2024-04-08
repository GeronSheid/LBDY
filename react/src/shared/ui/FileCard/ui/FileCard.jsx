import { Link } from "react-router-dom";
import "./FileCard.scss"
import Cross from "shared/assets/img/cross.svg"

const FileCard = ({index, name, deleteFile, url, isDark, isDownload}) => {
    return (
        <div className="file" style={isDark ? {color: '#687074b3'} : {color: '#fff'}}>
            {
                isDownload
                ? <Link to={url} download={name} target="_blank">{name}</Link>
                : <span style={{cursor: 'default'}}>{name}</span>
            }
            <div className="file-size">
                <Cross className={isDark ? 'file__cross file__cross_dark' : 'file__cross'} onClick={() => deleteFile(index, url)}/>
            </div>

        </div>
    );
};

export default FileCard;
