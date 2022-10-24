import React, { useEffect, useState } from 'react';
import axios from 'axios';

function useBookSearch(query, pageNumber) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false)

  //reset search bar whenever query is changed
  useEffect(() => {
    setBooks([]);
  },[query])

  useEffect(() => {
    let cancel;
    setLoading(true);
    setError(false);
    axios({
      method: "GET",
      url: "http://openlibrary.org/search.json",
      params: {q: query, page: pageNumber},
      cancelToken: new axios.CancelToken(c => cancel = c) //cancel request race
    })
    .then(res => {
      setBooks(prevBooks =>{//when render new results, still render old books thats why we need prev. Set: select unique element
        return [...new Set([...prevBooks, ...res.data.docs.map(b => b.title)])];
      })
      setHasMore(res.data.docs.length > 0); //if there're still results in the array given back 
      setLoading(false);
    })
    .catch(e => { //cancelToken error handling
      if(axios.isCancel(e)) return //ignore the error if the error is from axios cancel token
      setError(true);
    })

    return () => cancel();
  },[query, pageNumber])//refetch whenever query or pageNumber changes

  return {books, loading, error, hasMore} //give back to App.js
}

export default useBookSearch
