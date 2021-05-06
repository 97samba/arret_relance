import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Create from './Pages/Create';
import DashBoard from './Pages/DashBoard'
import Manage from './Pages/Manage';
import Settings from './Pages/Settings';
import Layout from './Components/Layout'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Quicksand',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 1000,
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/">
              <DashBoard />
            </Route>

            <Route  path="/create">
              <Create />
            </Route>

            <Route  path="/manage">
              <Manage />
            </Route>

            <Route  path="/settings">
              <Settings />
            </Route>
          </Switch>
        </Layout>

      </Router>
   </ThemeProvider>
  );
}

export default App;
