// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogIn from './Pages/login'
import Welcome from './Pages/welcome';
import Form from './Pages/form';
import Noticket from './Pages/noticket';
import ThankYou from './Pages/thankyou';
import QueueDisplay from './Pages/queuedisplay';
import Reporting from './Pages/reporting';
import FrontDisplay from './Pages/frontdisplay';
import Credentials from './Pages/credentials';
import AnalystDetails from './Pages/analystdetails';
import StatisticsPage from './Pages/history';
const App = () => {
  return (
    <div>
   
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LogIn />} />
          <Route path='/login' element={<LogIn />} />
          
          <Route path='/frontdisplay' element={<FrontDisplay/>} />
          <Route path='/credentials' element={<Credentials/>} />
          <Route path= '/queuedisplay' element = {<QueueDisplay/>}/>
          <Route path='/reporting' element={<Reporting />} />
          <Route path='/welcome' element={<Welcome />} />
          <Route path='/thankyou' element={<ThankYou />} />
          <Route path='/form' element={<Form />} />
          <Route path='/noticket' element={<Noticket />} />
          <Route path= '/analyst/:analystName' element={<AnalystDetails/>}/>
          <Route path= '/history' element={<StatisticsPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
