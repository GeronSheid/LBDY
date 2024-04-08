import { Scrollbar } from 'react-scrollbars-custom';
import './paymentsHistoryTabel.scss';

export const PaymentsHistoryTable = ({data}) => {
  return (
    <div className='paymentsHistoryTable'>
      <div className='paymentsHistoryTable__header'>
        <ul className='paymentsHistoryTable__list'>
          <li className="paymentsHistoryTable__item">
            Дата
          </li>
          <li className="paymentsHistoryTable__item">
            Детали
          </li>
          <li className="paymentsHistoryTable__item">
            Сумма
          </li>
          <li className="paymentsHistoryTable__item">
            Чек
          </li>
        </ul>
      </div>
      <div className='paymentsHistoryTable__content'>
        <Scrollbar
          disableTrackYWidthCompensation={true}
          trackYProps={{ style: { width: "4px", background: "transparent", marginRight: -8 } }}
          thumbYProps={{ style: { background: "#687074", maxHeight: "62px", opacity: 0.5 } }}
        >
          {data.map(item =>
            <div className='paymentsHistoryTable__row'>
              <ul className='paymentsHistoryTable__list'>
                <li className="paymentsHistoryTable__item">
                  {item.date}
                </li>
                <li className="paymentsHistoryTable__item">
                  {item.details}
                </li>
                <li className="paymentsHistoryTable__item">
                  {item.price}
                </li>
                <li className="paymentsHistoryTable__item">
                  {item.receipt}
                </li>
              </ul>
            </div>
          )}
        </Scrollbar>
      </div>
    </div>
  )
}
