import Navigation from "../organisms/Navigation";

const App = ({ children }) => (
  <div>
    <Navigation />
    {children}
  </div>
);

export default App;
