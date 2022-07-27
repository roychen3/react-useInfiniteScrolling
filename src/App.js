import React, { useState, useEffect, useCallback } from 'react';

import { useInfiniteScrolling } from './hook/useInfiniteScrolling';

import './App.css';

function App() {
  const [todoList, setTodoList] = useState([])
  const [dataLoading, setDataLoading] = useState(false)
  const [startId, setStartId] = useState(0)
  const [hasMore, setHasMore] = useState(false)


  const fetchData = useCallback(async () => {
    setDataLoading(true)
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos?_start=${startId}&_limit=40`)
    const responseData = await response.json();
    const responseDataLength = responseData.length
    if (responseDataLength > 0) {
      setTodoList((preTodoList) => [...preTodoList, ...responseData])
      setStartId(responseData[responseDataLength - 1].id)
      setHasMore(true)
    } else {
      setHasMore(false)
    }
    setDataLoading(false);
  }, [startId]);

  const handleInfiniteScrollingTrigger = useCallback(() => {
    if (hasMore && dataLoading === false) {
      fetchData()
        .catch((error) => { console.log(error.message) });
    };
  }, [hasMore, dataLoading, fetchData]);
  const lastElementRef = useInfiniteScrolling(handleInfiniteScrollingTrigger);

  useEffect(() => {
    if (todoList.length === 0) {
      fetchData()
        .catch((error) => { console.log(error.message) });
    }
  }, [todoList, fetchData])

  return (
    <div className='list'>
      {todoList.map((item, itemIdx) => (
        <>
          {itemIdx + 1 === todoList.length ? (
            <div key={item.id} ref={lastElementRef} className="item">
              <span>{item.id}</span>
              <span>{item.completed ? 'O' : 'X'}</span>
              <span>{item.title}</span>
            </div>
          ) : (
            <div key={item.id} className="item">
              <span>{item.id}</span>
              <span>{item.completed ? 'O' : 'X'}</span>
              <span>{item.title}</span>
            </div>
          )}
        </>
      ))}
      {dataLoading && <p>loading...</p>}
      {hasMore === false && <p>in the end</p>}
    </div>
  );
}

export default App;
