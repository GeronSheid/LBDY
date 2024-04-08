import { IconButton } from "shared/ui/IconButton"
import DeleteIcon from 'shared/assets/img/delete-shaped.svg';
import useFetching from "shared/hooks/useFetching"
import "./MediaUnit.scss"
import { Link } from "react-router-dom";
import { ModalWrapper } from "shared/ui/ModalWrapper";
import { DeleteMediaUnitModal } from "entities/DeleteMediaUnitModal";
import { useState } from "react";
import KnowlegeBaseApi from "shared/api/KnowlegeBaseApi";


const MediaUnit = ({ media, refetch, setRefetch, isFile, isMobile }) => {

    const [modalOpen, setModalOpen] = useState(false)
    const [deleteDocument] = useFetching( async (id) => {
        return await KnowlegeBaseApi.deleteDocument(id)
    }) 

    
    const handleDelete = (id) => {
        deleteDocument(id)
            .then(res => {
                if(!res || res.erors) return
                setRefetch(!refetch)
                setRefetch(!refetch)
            })
        setModalOpen(false)
        
    }

    return (
        <>
            {modalOpen &&
                <ModalWrapper>
                    <DeleteMediaUnitModal
                        func={handleDelete}
                        closeModal={setModalOpen}
                        id={media._id}
                        isFile={isFile}
                        isMobile={isMobile}
                    />
                </ModalWrapper>
            }
            <div className="mediaUnit__wrapper">
                <div className="mediaUnit__left">
                    <Link to={media.url} className="mediaUnit__name" target='_blank'>{media.name}</Link>
                    <div className="mediaUnit__description">{`Загружен ${new Date(media.created_at).toLocaleDateString('ru-RU')}`}</div>

                </div>
                <IconButton
                    icon={<DeleteIcon width={24} height={24} color={'#fff'} />}
                    onClick={() => setModalOpen(true)}
                />
            </div>
        </>
    )
}

export default MediaUnit