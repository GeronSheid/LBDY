import { useEffect, useState } from 'react';
import 'pages/KnowlegeBasePage/ui/sass/knowlegeBase.scss';
import DeleteIcon from 'shared/assets/img/delete-shaped.svg';
import ShareIcon from 'shared/assets/img/share.svg';
import { Link } from 'react-router-dom';
import useFetching from 'shared/hooks/useFetching';
import KnowlegeBaseApi from 'shared/api/KnowlegeBaseApi';
import { ModalWrapper } from 'shared/ui/ModalWrapper';
import jwtDecode from 'jwt-decode';
import shortString from 'shared/lib/shortString';
import useWindow from 'shared/hooks/useWindow';
import { Tooltip } from 'react-tooltip';

export const KnowlegeBaseItem = ({ props, refetchDocuments, setRefetchDocuments, isPublic, isMobile }) => {
  const myId = jwtDecode(localStorage.token).sub;
  // const [descriptionActive, setDescriptionActive] = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(false)
  // const [userData, setUserData] = useState()
  const [deleteDocument] = useFetching(async () => {
    return await KnowlegeBaseApi.deleteDocument(props._id)
  })
  const [patchDocument] = useFetching(async (isPublic) => {
    return await KnowlegeBaseApi.patchDocument(props._id, isPublic)
  })

  const { windowWidth, windowHeight, orientation } = useWindow()
  const isTable = 1024 < windowWidth && windowWidth <= 1440 || windowHeight > 600 && windowHeight <= 960

  const [publicity, setPublicity] = useState(false)

  useEffect(() => {
    setPublicity(props.public)

  }, [])

  const handlePatch = (isPublic) => {
    patchDocument(isPublic)
      .then(res => {
        if(!res || res.errors) return
        setPublicity(res.data.public)
        setRefetchDocuments(prev => prev * Math.random())
      })
  }

  const onDeleteSubmit = () => {
    deleteDocument()
      .then(res => {
        if (!res || res.errors) return

      })
    setTimeout(() => {
      setRefetchDocuments(prev => prev * Math.random())
    }, 500)

    setDeleteVisible(false)
  }

  return (
    <>
      {deleteVisible &&
        <ModalWrapper onClick={setDeleteVisible}>
          <div className={isMobile ? 'modalWindow_delete knowlegeBase__deleteModal' : 'modalWindow knowlegeBase__deleteModal'}>
            <div className='modalWindow__content'>
              <p className='modalWindow__title'>Ты уверен, что хочешь удалить медиа?</p>
              <div className='modalWindow__btn-wrap'>
                <button
                  className='btn-shape__filled btn-shape__filled_delete'
                  onClick={() => onDeleteSubmit()}
                >
                  Удалить
                </button>
                <button
                  className='btn-shape__empty'
                  onClick={() => setDeleteVisible(false)}
                >
                  Назад
                </button>
              </div>
            </div>
          </div>
        </ModalWrapper>
      }
      <div className={'knowlegeBase__item knowlegeBase-item'}>
        <div className='knowlegeBase-item__name'>
          <a href={props.url} download={props.origin === 'Файл' ? `${props.name}` : false} target='_blank'>{props.name}</a>
          <div className='knowlegeBase-item__description-wrap'>
            <p>{props.description}</p>
          </div>
        </div>
        {isMobile && props.grade === 0
          ?
          ''
          :
          <div className='knowlegeBase-item__col'>{isMobile ? <><span>Курс</span><span>{props.grade}</span></> : props.grade === 0 ? '-' : props.grade}</div>
        }
        {isMobile && props.semester === 0 
          ?
          ''
          :
          <div className='knowlegeBase-item__col'>{isMobile ? <><span>Семестр</span><span>{props.semester}</span></> : props.semester === 0 ? '-' : props.semester}</div>
        }
        {isMobile && props.teacher === null 
          ?
          ''
          :
          <div data-tooltip-id={`${props.teacher}-id`} className='knowlegeBase-item__col'>
            {isMobile
              ?
              <>
                <span>Преподаватель</span><span>{props.teacher ? `${props.teacher}` : ''}
                </span></>
              : 
              <>
                {props.teacher !== null ? `${props.teacher.split(' ')[0]} ${props.teacher.split(' ').length > 1 ? `${props.teacher.split(' ')[1].slice(0, 1)}.` : ''} ${props.teacher.split(' ').length > 1 ? `${props.teacher.split(' ')[2].slice(0, 1)}` : ''}` : '-'} </>}
          </div>
        }
        {isMobile && props.subject === null
          ?
          ''
          :
          <div data-tooltip-id={`${props.subject}-id`} className='knowlegeBase-item__col knowlegeBase-item__col_subject'>
            {isMobile 
              ? 
              <>
                <span>Предмет</span>
                <span>{props.subject}</span>
              </> 
              : 
              props.subject === null ? '-' : isTable ? shortString(props.subject) : props.subject}
          </div>
        }
        <div className='knowlegeBase-item__col'>{isMobile ? <><span>Тип</span><span>{props.type}</span></> : props.type}</div>
        <div className='knowlegeBase-item__col knowlegeBase-item__col_date'>{new Date(props.created_at).toLocaleDateString('ru-RU')}</div>
        <div className='knowlegeBase-item__btns'>
          {!isPublic &&
            <button onClick={() => setDeleteVisible(true)}>
              <DeleteIcon className="knowlegeBase-item__icon" width={24} height={24} />
            </button>
          }
          <button onClick={() => handlePatch(!publicity)}>
            {+props.user_id === +myId &&
              <ShareIcon className={publicity ? "knowlegeBase-item__icon knowlegeBase-item__icon_active" : 'knowlegeBase-item__icon'} width={24} height={24} />
            }
          </button>
        </div>
      </div>
      {!isMobile && props.teacher !== null &&
        <Tooltip
          id={`${props.teacher}-id`}
          place='bottom-start'
          offset={5}
          key={`tooltip-${props.teacher}-id`}
        >
          {props.teacher}
        </Tooltip>
      }
      {!isMobile && props.subject !== null &&
        <Tooltip
          id={`${props.subject}-id`}
          place='bottom-start'
          offset={5}
          key={`tooltip-${props.subject}-id`}
        >
          {props.subject}
        </Tooltip>
      }
    </>
  )
}
