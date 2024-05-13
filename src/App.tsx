import './App.css'
import { Route ,Routes } from 'react-router-dom'
import { Sender } from './components/Sender'
import { Receiver } from './components/Receiver'
import { Test } from './components/Test'
function App() {
  return (
    <div>
      <Routes>
        <Route path='sender' element={<Sender/>}></Route>
        <Route path='receiver' element={<Receiver/>}></Route>
        <Route path='test' element={<Test></Test>}></Route>
      </Routes>
    </div>
  ) 
}

export default App
