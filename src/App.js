import {React,useCallback,useRef,useState} from 'react';
import useBookSearch from './useBookSearch';

function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  
  //custom Hook
  const { //deconstruct useBookSearch
    books,
    hasMore,
    error,
    loading
  } = useBookSearch(query, pageNumber);

  //infinite scrolling
  //intersection observer: allows tracking elemens' positions in relation to another route element
  const observer = useRef();
  const lastBookElementRef = useCallback(node => {
    if(loading) return
    if(observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMore){ //if it's the bottom and there are still results in the array:
        setPageNumber(prevPageNumber => prevPageNumber + 1)//increment the page number->page number changes->useEffect triggers so it will append to the bottom
      }
    })
    if(node) observer.current.observe(node);
  },[loading, hasMore]); //only when loading and hasmore is changed will useCallback be triggered

  function handleSearch(e){
    setQuery(e.target.value); //query changes alongside input 
    setPageNumber(1);
  }
  return (
    <>
      <input type="text" value ={query} onChange={handleSearch}></input>
      {books.map((book,index) => {
        if(books.length === index + 1) return <div ref={lastBookElementRef} key={book}>{book}</div> //the last node -> reference to lastBookElementRef
        else return <div key={book}>{book}</div>
      })}

      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </>  
  )
}

export default App
