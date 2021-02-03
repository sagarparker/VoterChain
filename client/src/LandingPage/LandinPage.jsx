import React,{useState} from 'react'
import {useHistory} from 'react-router-dom';
import './LandingPage.css'
import axios from 'axios';


export default function LandingPage() {
    const history = useHistory();
    const[voterID,setVoterID] = useState('');
    const[serviceID,setServiceID] = useState('');
    const[userPhoneNo,setUserPhoneNo] = useState('');
    const[msg,setMsg] = useState('');
    const[sendOtpResult,setSendOtpResult] = useState(false);
    const[otp,setOtp] = useState('');

    //Send OTP 
    const sendOTP = (event) =>{
        event.preventDefault(); 
        axios.post('http://localhost:8080/api/sendOtpForlogin', {
            voter_id:voterID
          },{ validateStatus: false })
          .then(response =>  {
            setMsg(response.data.msg);
            setServiceID(response.data.serviceID);
            setUserPhoneNo(response.data.phone_no);
            if(response.data.result){
                setSendOtpResult(true);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    //Verify OTP
    const verifyOTP = (event) =>{
        event.preventDefault(); 
        axios.post('http://localhost:8080/api/verifyOtpForLogin', {
            phone_no:userPhoneNo,
            serviceID:serviceID,
            otp:otp
          },{ validateStatus: false })
          .then(response =>  {
            setMsg(response.data.msg);
            if(response.data.otpVerified){
                sessionStorage.setItem('voterID',voterID);
                history.push("/votingPage");
            }
            
          })
          .catch(function (error) {
            console.log(error);
          });
    }



    return (
        <div className="mainDiv">
            <div className="row">
                <div className="col-7 imageDiv">
                    <img src="/landingPage.jpg" alt="LandingPageImage" className="landingPageImage" />
                </div>
                <div className="col-5 contentDiv">
                    <div className="formDiv">
                        {
                            !sendOtpResult ?
                            // If OTP is not sent
                            <form onSubmit={sendOTP} className="mt-3">
                                <input type="text" name="username" required className="inputfield" placeholder="Enter your Voter ID" 
                                value={voterID} onChange={e=> setVoterID(e.target.value)}/>
                                <button type="submit" className="submitBtn">Send OTP</button>
                            </form>
                            :
                            //If OTP is sent
                            <form onSubmit={verifyOTP} className="mt-3">
                                <input type="number" name="otp" required className="inputfield" placeholder="Enter your OTP" 
                                value={otp} onChange={e=> setOtp(e.target.value)}/>
                                <button type="submit" className="submitBtn">Verify OTP</button>
                            </form>

                        }
                        <h6 style={{textAlign:'center',marginTop:20}}>{msg}</h6>
                    </div>
                </div>

                
            </div>
        </div>
    )
}
