import React from 'react'
import PreviousItem from "shared/assets/img/previous-item.svg"
import NextItem from "shared/assets/img/next-item.svg"

export const DateChanger = ({
    scheduleToggle, 
    todayDate, 
    setTodayDate,
    dayStep, 
    yesterday, 
    tomorrow, 
    prevCounter, 
    setPrevCounter,
    nextCounter, 
    setNextCounter,
    prevWeek, 
    nextWeek,
    changeSchedule,
    toLocaleDateString,
    week,
    isMobile = false
  }) => {
  return (
    <>
      {scheduleToggle
        ?
        <div className="change-dates">
          <button
            className="change-dates__btn"
            onClick={(e) => {
              setTodayDate(todayDate - dayStep)
            }}
          >
            <PreviousItem />
            {!isMobile &&
              <span>
                {
                  new Date(yesterday).toLocaleDateString('ru-RU')
                }
              </span>
            }
          </button>
          {isMobile &&
            <span>
              {new Date(todayDate).toLocaleDateString('ru-RU')}
            </span>
          }
          <button
            className="change-dates__btn"
            onClick={(e) => {
              setTodayDate(todayDate + dayStep)
            }}
          >
            {!isMobile &&
              <span>
                {
                  new Date(tomorrow).toLocaleDateString('ru-RU')
                }
              </span>
            }
            <NextItem />
          </button>
        </div>
        :
        <div className="change-dates">
          <button
            className="change-dates__btn"
            onClick={(e) => {
              changeSchedule(-7 * prevCounter)
              setNextCounter(nextCounter - 1)
              setPrevCounter(prevCounter + 1)
            }}
          >
            <PreviousItem />
            {!isMobile &&
              <span>
                {prevWeek.length !== 0
                  && toLocaleDateString(prevWeek[1].date) + " — " + toLocaleDateString(prevWeek[0].date)
                }
              </span>
            }
          </button>
          {isMobile &&
            <span>
              {toLocaleDateString(week[1].date) + ' — ' + toLocaleDateString(week[0].date)}
            </span>
          }
          <button
            className="change-dates__btn"
            onClick={(e) => {
              changeSchedule(7 * nextCounter)
              setNextCounter(nextCounter + 1)
              setPrevCounter(prevCounter - 1)
            }}
          >
            {!isMobile &&
              <span>
                {nextWeek.length !== 0
                  && toLocaleDateString(nextWeek[1].date) + " — " + toLocaleDateString(nextWeek[0].date)
                }
              </span>
            }
            <NextItem />
          </button>
        </div>
      }
    </>
  )
}
