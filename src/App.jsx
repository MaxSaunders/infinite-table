import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import useBookSearch from './useBookSearch'
import './App.css'

const scrollToTop = () => {
  window.scrollTo(0, 0)
}

const Row = ({ rowData }) => {
  if (!rowData) {
    return (
      <>
        <td />
        <td />
        <td />
      </>
    )
  } else {
    return (
      <>
        {Object.values(rowData)?.map((value, index) =>
          <td key={`${value}-${index}`}>{value}</td>
        )}
      </>
    )
  }
}

function defaultTable(array) {
  if (array?.length < 50) {
    return [...array, ...Array(50 - array?.length)]
  }
  return array
}

function isElementInViewport(el) {
  var rect = el?.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function onVisibilityChange(el, callback, callback2) {
  if (el == null || el == undefined) return () => callback2()
  var old_visible
  return function () {
    var visible = isElementInViewport(el)
    if (visible && visible != old_visible) {
      old_visible = visible;
      if (typeof callback == 'function') {
        callback()
      }
    }
    callback2()
  }
}

export default function App() {
  const [atTop, setAtTop] = useState(true)
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  const {
    books,
    hasMore,
    loading,
    error
  } = useBookSearch(query, pageNumber)

  const elem = useMemo(() =>{
    return document.getElementById('observer-element')
  }, [books, loading])

  useEffect(() => {
    const handler = onVisibilityChange(elem, function () {
      setPageNumber(prevPageNumber => prevPageNumber + 1)
    }, function () {
      if(window.pageYOffset < 500) {
        setAtTop(true)
      } else {
        setAtTop(false)
      }
    })

    addEventListener('DOMContentLoaded', handler, false);
    addEventListener('load', handler, false);
    addEventListener('scroll', handler, false);
    addEventListener('resize', handler, false);

    return () => {
      addEventListener('DOMContentLoaded', handler);
      addEventListener('load', handler);
      addEventListener('scroll', handler);
      addEventListener('resize', handler);
    };
  }, [elem]);

  function handleSearch(e) {
    setQuery(e.target.value)
    setPageNumber(1)
  }

  return (
    <>
      {!atTop && <button className='scroll-button' onClick={scrollToTop}>Scroll to Top</button>}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: 'larger' }}>Search: </label>
        <input placeholder='search query' type="text" value={query} onChange={handleSearch}></input>
      </div>
      <table>
        <tbody>
          {defaultTable(books)?.map((book, index) => {
            if (books?.length == (index + 20)) {
              return (
                <tr id={`observer-element`} key={`${book}-${index}`} style={{ backgroundColor: 'red' }}>
                {/* <tr id={`observer-element`} style={{ backgroundColor: 'red' }} key={`${book}-${index}`}> */}
                  {/* <td><div key={book}>{book}</div></td> */}
                  <Row rowData={book} />
                </tr>
              )
            } else {
              return (
                <tr key={`${book}-${index}`}>
                  {/* <td><div key={book}>{book}</div></td> */}
                  <Row rowData={book} />
                </tr>
              )
            }
          })}
          {loading && <tr><td>Loading...</td></tr>}
          {error && <tr><td>Error</td></tr>}
        </tbody>
      </table>
    </>
  )
}