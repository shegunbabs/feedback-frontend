import './App.css'
import Header from './components/Header'
import Feedback from "./components/Feedback.tsx";

function App() {

    return (
        <>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-display">
                <div className="pb-10">
                    <Header text="User Feedbacks" />
                </div>
                <Feedback />
            </div>

        </>
    )
}

export default App
