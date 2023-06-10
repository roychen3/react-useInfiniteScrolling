import React, { useState, useEffect, useCallback, Fragment } from 'react';

import { useInfiniteScrolling } from './hook/useInfiniteScrolling';

import './App.css';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [startId, setStartId] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchData = useCallback(() => {
    let cancelFetch = false;
    setDataLoading(true);
    fetch(
      `https://jsonplaceholder.typicode.com/todos?_start=${startId}&_limit=40`
    )
      .then((response) => response.json())
      .then((responseData) => {
        if (cancelFetch) return;
        const responseDataLength = responseData.length;
        if (responseDataLength > 0) {
          setTodoList((preTodoList) => [...preTodoList, ...responseData]);
          setStartId(responseData[responseDataLength - 1].id);
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      })
      .catch((error) => {
        console.error(error.message);
      })
      .finally(() => {
        setDataLoading(false);
      });

    return () => {
      cancelFetch = true;
    };
  }, [startId]);

  const handleInfiniteScrollingTrigger = useCallback(() => {
    if (hasMore && dataLoading === false) {
      fetchData();
    }
  }, [hasMore, dataLoading, fetchData]);
  const lastElementRef = useInfiniteScrolling(handleInfiniteScrollingTrigger);

  useEffect(() => {
    let cancelFetch = () => {};
    if (todoList.length === 0) {
      cancelFetch = fetchData();
    }

    return () => {
      cancelFetch();
    };
  }, [todoList, fetchData]);

  return (
    <div className="list">
      {todoList.map((item, itemIdx) => (
        <Fragment key={item.id}>
          {itemIdx + 1 === todoList.length ? (
            <div ref={lastElementRef} className="item">
              <span>{item.id}</span>
              <span>{item.completed ? 'O' : 'X'}</span>
              <span>{item.title}</span>
            </div>
          ) : (
            <div className="item">
              <span>{item.id}</span>
              <span>{item.completed ? 'O' : 'X'}</span>
              <span>{item.title}</span>
            </div>
          )}
        </Fragment>
      ))}
      {dataLoading && <p>loading...</p>}
      {hasMore === false && <p>in the end</p>}
    </div>
  );
}

export default App;
