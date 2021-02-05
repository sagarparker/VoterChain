import React,{useState} from 'react'
import Navbar from '../navbar/Navbar'
import './VotingPage.css'
import axios from 'axios';

export default function VotingPage() {
    const[vote,setVote] = useState('');
    const[msg,setMsg] = useState('');
    const[votingStatus,setVotingStatus] = useState(false);

    const voteForParty = (event) =>{
        event.preventDefault();
        axios.post('http://localhost:8080/api/vote', {
            "voterID":"SOK6723438",
            "party":vote
          },{ validateStatus: false })
          .then(response =>  {
            setMsg(response.data.msg);
            if(response.data.result){
                setVotingStatus(true);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    return (
        <div>
            <Navbar/>
            {
                !votingStatus ?

                <form onSubmit={voteForParty}>
                <button type="submit" onClick={()=>setVote('BJP')}>BJP</button>
                <button type="submit" onClick={()=>setVote('INC')}>INC</button>
                <button type="submit" onClick={()=>setVote('AAP')}>AAP</button>
                <button type="submit" onClick={()=>setVote('NCP')}>NCP</button>
                <button type="submit" onClick={()=>setVote('BSP')}>BSP</button>
                <button type="submit" onClick={()=>setVote('CPI')}>CPI</button>
                </form>

                :

                <h5>The user has voted</h5>
            }


            <h5>{msg}</h5>
                
            
        </div>
    )
}
