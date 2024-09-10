// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './Pages/welcome';
import Form from './Pages/form';
import Noticket from './Pages/noticket';
import ThankYou from './Pages/thankyou';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Welcome />} />
          <Route path='/welcome' element={<Welcome />} />
          <Route path='/thankyou' element={<ThankYou />} />
          <Route path='/form' element={<Form />} />
          <Route path='/noticket' element={<Noticket />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
