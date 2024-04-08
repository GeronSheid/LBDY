import { PaymentsHistoryTable } from 'widgets/PaymentsHistoryTable';
import './paymentHistory.scss';

export const PaymentsHistory = ({nextPaymentDate = '14 ноября'}) => {
  const data = [
    {date: '14.04.2023', details: 'Пробный план, месячно', price: 500, receipt: 'https://checki.ru/18992'},
    {date: '14.05.2023', details: 'Пробный план, месячно', price: 500, receipt: 'https://checki.ru/18992'},
    {date: '14.06.2023', details: 'Пробный план, месячно', price: 500, receipt: 'https://checki.ru/18992'},
    {date: '14.07.2023', details: 'Пробный план, месячно', price: 500, receipt: 'https://checki.ru/18992'},
    {date: '14.08.2023', details: 'Пробный план, месячно', price: 500, receipt: 'https://checki.ru/18992'}
  ]
  return (
    <div className='paymentsHistory'>
      <div className='paymentsHistory__controls'>
        <legend className='legend legend_thin'>
          История оплат
        </legend>
        <span className='paymentsHistory__nextDate'>
          {`Следующее списание: ${nextPaymentDate}`}
        </span>
      </div>
      <PaymentsHistoryTable data={data}/>
    </div>
  )
}
