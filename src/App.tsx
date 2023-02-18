import React from 'react'
import Note from './component/Note'
import { Routes, Route } from "react-router-dom"

export default function App() {
  return (
    <>
     <Routes>
        <Route path="/" element={ <Note /> } />
    </Routes>
    </>
  )
}
