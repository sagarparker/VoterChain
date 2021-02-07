import React from 'react';
import './Navbar.css'

export default function Navbar() {
    return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="/"><img src="/chain.png" style={{marginTop:-10,marginLeft:10}} width="30" height="30" alt="siteLogo" /> VoterChain</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">

                        <li className="nav-item" style={{marginLeft:1250}}>
                            <a className="nav-link" href="/totalVotes">Votes count</a>
                        </li>

                    </ul>
                </div>
            </nav>
    )
}
