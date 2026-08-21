import { useState } from 'react'
import { pointHistory } from '../data/mockData'

function PointHistory() {
  const [filter, setFilter] = useState('all')

  const filteredHistory = pointHistory.filter((item) => {
    if (filter === 'all') {
      return true
    }

    return item.type === filter
  })

  return (
    <div>
      <div className="page-heading">
        <h1>Point History</h1>
        <p>Track where points were credited and debited.</p>
      </div>

      <section className="card mt-4">
        <div className="filter-row">
          <button className={filter === 'all' ? 'filter-button active-filter' : 'filter-button'} type="button" onClick={() => setFilter('all')}>
            All
          </button>
          <button className={filter === 'credit' ? 'filter-button active-filter' : 'filter-button'} type="button" onClick={() => setFilter('credit')}>
            Credit
          </button>
          <button className={filter === 'debit' ? 'filter-button active-filter' : 'filter-button'} type="button" onClick={() => setFilter('debit')}>
            Debit
          </button>
        </div>

        {filteredHistory.length === 0 ? (
          <p className="empty-text">No point history found.</p>
        ) : (
          <div className="table-wrapper mt-4">
            <table className="simple-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Points</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.description}</td>
                    <td>
                      <span className={item.type === 'credit' ? 'status-credit' : 'status-debit'}>
                        {item.type}
                      </span>
                    </td>
                    <td className={item.type === 'credit' ? 'credit-text' : 'debit-text'}>
                      {item.type === 'credit' ? '+' : '-'}
                      {item.points}
                    </td>
                    <td>{item.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default PointHistory
