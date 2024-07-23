import axios from 'axios';
import React, { useState, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
const Groups = () => {
    const [data, setData] = useState();
    const navigate = useNavigate();
  
  
    useEffect(() => {
      async function getGroups() {
        const res = await axios.get('/groups');
        setData(res.data.groups)
      }
      getGroups()
    }, []);
    return (
  
      <section>
        <div>Groups</div>
        <section>
          {data ? (
            data.map(item => (
              <button onClick={() => navigate(`${item.id}`)}>
                <div>
                  <h1>{item.title}</h1>
                  <h1>Host: {item.host}</h1>
                  <h2>{item.groupId}</h2>
                </div>
              </button>
            ))) : (<div></div>)}
  
        </section>
        <div>
          <Link to="add">New Group</Link>
        </div>
      </section>
    )
  }

export default Groups