import { Routes, Route } from 'react-router-dom';
import Protected from '../Protected/Protected';

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <></>
            </Protected>
          }
        />
      </Routes>
    </>
  );
};

export default App;
