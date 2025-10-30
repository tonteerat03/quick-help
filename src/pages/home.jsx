import React from "react";
import './css/home.css';
import '../App.css';

const Home = () => {
    return ( 
        <div className="flex flex-col items-center justify-center m-70">
            <h1>Search</h1>
            <input type="text" name="Search" class="input" />
        </div>
     );
}
 
export default Home;