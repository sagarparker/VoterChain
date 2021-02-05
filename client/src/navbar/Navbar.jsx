import React from 'react';
import './Navbar.css'

export default function Navbar() {
    return (
        <div>
            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid">
                    
                    <span className="navbar-brand mb-0 h1"><img src="/chain.png" style={{marginTop:-10}} width="30" height="30" alt="siteLogo" /> VoterChain</span>
                </div>
            </nav>
        </div>
    )
}
