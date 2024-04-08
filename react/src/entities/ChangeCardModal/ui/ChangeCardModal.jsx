import { Link } from "react-router-dom"


const ChangeCardModal = ({ close, link, variant = 0, isMobile=false, isMarginBottom=false, setStartQuerry = () => {}, setRefetchProfileStatus, activate = () => {}, userId }) => {
    const variants = [
        {h2: 'Сменить привязанную карту?', p: 'С неё будет списана оплата за месяц, время будет добавленно к твоей подписке', link: 'Сменить карту'},
        {h2: 'Оформить подписку?', p: 'Ты сможешь пользоваться платформой после окончания пробного периода', link: 'Оформить'},
        {h2: 'Активировать подписку?', p: 'Ты сможешь и дальше пользоваться платформой', link: 'Активировать'},
        {h2: 'Необходимо оплатить подписку', p: '', link: 'К оплате'}
    ]
    return (
        <div className={isMobile ? "modalWindow_delete" : "modalWindow"} >
            <div className="modalWindow__content">
                <h2 className="modalWindow__title">{variants[variant].h2}</h2>
                {variants[variant].p !== '' &&
                    <p className="modalWindow__text">{variants[variant].p}</p>
                }
                <div className="modalWindow__btn-wrap" style={(isMarginBottom) ? {marginBottom: 75} : {}}>
                    <button className="btn-shape__filled" onClick={() => {setStartQuerry(true); setRefetchProfileStatus(); activate(userId); close()}}>{variants[variant].link}</button>
                    <button onClick={close} className="btn-shape__empty">Назад</button>
                </div>
            </div>
        </div>
    )
}
export default ChangeCardModal