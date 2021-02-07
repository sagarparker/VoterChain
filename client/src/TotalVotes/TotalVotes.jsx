import React,{useState,useEffect} from 'react';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import './TotalVotes.css';

export default function TotalVotes() {
    const [votesCount,setVotesCount] = useState({});

    // Fetching the total no of votes on page load
    useEffect(()=>{
        axios.get('http://localhost:8080/api/votingResult',{ validateStatus: false })
          .then(response =>  {
            setVotesCount(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
    },[]);

    return (
        <div className="mainDiv">
            <Navbar/>
            <div className="row">
                <div className="col-6 imageDiv3">

                </div>
                <div className="col-6 contentDiv3">
                    <div className="votesTable">
                        <div className="row">
                            <div className="col-6 tableHeader" style={{borderTopLeftRadius:15}}>
                                    Political Party
                            </div>
                            <div className="col-6 tableHeader" style={{borderTopRightRadius:15,borderRight:'none'}}>
                                    Total Votes
                            </div>
                            <div className="col-6 tableData" >
                            <img src="./parties/BNP.png" style={{borderRadius:50,marginRight:10}} width="50" height="50" alt="" />
                                    BNP
                            </div>
                            <div className="col-6 tableData" style={{paddingTop:20}}>
                                    {votesCount?.data?.BNP}
                            </div>
                            <div className="col-6 tableData">
                            <img src="./parties/aap.jpg" style={{borderRadius:50,marginRight:10}} width="50" height="50" alt="" />
                                    AAP
                            </div>
                            <div className="col-6 tableData" style={{paddingTop:20}}>
                                    {votesCount?.data?.AAP}
                            </div>
                            <div className="col-6 tableData">
                            <img src="./parties/bsn.png" style={{borderRadius:50,marginRight:10}} width="50" height="50" alt="" />
                                    BSN
                            </div>
                            <div className="col-6 tableData" style={{paddingTop:20}}>
                                    {votesCount?.data?.BSN}
                            </div>
                            <div className="col-6 tableData">
                            <img src="./parties/INP.png" style={{borderRadius:50,marginRight:10}} width="50" height="50" alt="" />
                                    INP
                            </div>
                            <div className="col-6 tableData" style={{paddingTop:20}}>
                                    {votesCount?.data?.INP}
                            </div>
                            <div className="col-6 tableData">
                            <img src="./parties/cip.svg" style={{borderRadius:50,marginRight:10}} width="50" height="50" alt="" />
                                    CIP
                            </div>
                            <div className="col-6 tableData" style={{paddingTop:20}}>
                                    {votesCount?.data?.CIP}
                            </div>
                            <div className="col-6 tableData" style={{borderBottomLeftRadius:15}}>
                            <img src="./parties/ncs.jpg" style={{borderRadius:50,marginRight:10}} width="50" height="50" alt="" />
                                    NCS
                            </div>
                            <div className="col-6 tableData" style={{paddingTop:20,borderBottomRightRadius:15}}>
                                    {votesCount?.data?.NCS}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            

        </div>
    )
}
