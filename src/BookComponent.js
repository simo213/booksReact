
import React, { useRef, useState, useEffect, useCallback } from 'react';

function BookComponent() {
  const [state, setState] = useState([])
  const [hasError, setHasError] = useState(false)
  const [loading, setLoading] = useState(false)
  const componentMounted = useRef(true);

  const makeAPICall = async () => {
    const response = await fetch("http://localhost:8081/books", {
      mode: 'cors'
    }).then(response => response.json())
      .then(data => {
        console.log(data);
        if (componentMounted.current) { // (5) is component still mounted?
          var items = JSON.parse(data.items);
          setState(items);
          setLoading(false);
        }
        return () => { // This code runs when component is unmounted
          componentMounted.current = false; // (4) set it to false when we leave the page
        }
      })
      .catch(err => {
        console.log("error");
        setHasError(true);
        setLoading(false)
      });
  };

  useEffect(() => {
    setLoading(true);
    makeAPICall();
  }, [])


  return (
    <div>
      <div >
        <h2>Books</h2>
      </div>
      {
        loading ? <div>Loading...</div> : hasError ? <div>Error occured.</div> :
          <div >{state.map(function (d, idx) {
            return (<div  key={idx}>
              <li> Title: {d.title} </li>
              <li> Author: {d.author} </li>
              <li> Status: {d.status} </li>
            </div>)
          })}
          </div>

      }
    </div>
  )
}

export default BookComponent;