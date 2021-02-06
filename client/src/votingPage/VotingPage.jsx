import React,{useState,useEffect} from 'react'
import Navbar from '../navbar/Navbar'
import './VotingPage.css'
import axios from 'axios';
import Swal from 'sweetalert2';


export default function VotingPage() {
    const[vote,setVote] = useState('');
    const[msg,setMsg] = useState('');
    const[votingStatus,setVotingStatus] = useState(false);
    const[hasVoted,setHasVoted] = useState(false);

    //Check if the voter has voted before
    useEffect(()=>{
        console.log(sessionStorage.getItem('voterID'));
        axios.post('http://localhost:8080/api/checkIfVotedBefore', {
            "voterID":sessionStorage.getItem('voterID'),
          },{ validateStatus: false })
          .then(response =>  {
            setHasVoted(response.data.hasVotedBefore);
            setMsg(response.data.msg);
          })
          .catch(function (error) {
            console.log(error);
          });
    },[]);

    //Vote for a party
    const voteForParty = (event) =>{
        event.preventDefault();
        axios.post('http://localhost:8080/api/vote', {
            "voterID":sessionStorage.getItem('voterID'),
            "party":vote
          },{ validateStatus: false })
          .then(response =>  {
            setMsg(response.data.msg);
            if(response.data.result){
              Swal.fire(
                'Vote Registered',
                'Thanks for voting!',
                'success'
              )
                setVotingStatus(true);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    return (
        <div className="mainDiv2">
            <Navbar/>
              <div className="row">
                <div className="col-6 imageDiv2">
                </div>
                <div className="col-6 contentDiv2">
                  {
                    !hasVoted && !votingStatus ?
                    <div>
                      <form onSubmit={voteForParty}>
                      
                      <div className="row">
                        <div className="col-6">
                          <div className="row partyRow">
                          <div className="col-4">
                            <img src="./parties/BNP.png" style={{borderRadius:50}} width="50" height="50" alt="" />
                          </div>
                          <div className="col-8">
                            <button type="submit" className="votingButton" onClick={()=>setVote('BNP')}>BNP</button>
                          </div>
                        </div>
                        </div>
                        <div className="col-6">
                            <div className="row partyRow">
                              <div className="col-4">
                                <img src="./parties/aap.jpg" style={{borderRadius:50}} width="50" height="50" alt="" />
                              </div>
                              <div className="col-8">
                                <button type="submit" className="votingButton" onClick={()=>setVote('AAP')}>AAP</button>
                              </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6">
                          <div className="row partyRow">
                          <div className="col-4">
                            <img src="./parties/BSN.png" style={{borderRadius:50}} width="50" height="50" alt="" />
                          </div>  
                          <div className="col-8">
                            <button type="submit" className="votingButton" onClick={()=>setVote('BSN')}>BSN</button>
                          </div>
                        </div>
                        </div>
                        <div className="col-6">
                          <div className="row partyRow">
                            <div className="col-4">
                              <img src="./parties/INP.png" style={{borderRadius:50}} width="50" height="50" alt="" />
                            </div>
                            <div className="col-8">
                              <button type="submit" className="votingButton" onClick={()=>setVote('INP')}>INP</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6">
                          <div className="row partyRow">
                            <div className="col-4">
                              <img src="./parties/cip.svg" style={{borderRadius:50}} width="50" height="50" alt="" />
                            </div>
                            <div className="col-8">
                              <button type="submit" className="votingButton" onClick={()=>setVote('CIP')}>CIP</button>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">                          
                        <div className="row partyRow">
                          <div className="col-4">
                            <img src="./parties/ncs.jpg" style={{borderRadius:50}} width="50" height="50" alt="" />
                          </div>
                          <div className="col-8">
                            <button type="submit" className="votingButton" onClick={()=>setVote('NCS')}>NCS</button>
                          </div>
                        </div>
                        </div>
                      </div>
                    
                    </form>
                    </div>
                    


                    :

                    <h5>{msg}</h5>
                  }
                </div>
              </div>
              
        </div>
    )
}
