import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';

// Material.
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';

// Navigation Icons.
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import MonitorIcon from '@mui/icons-material/Monitor';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';

// Screens.
import { HomeScreen } from './screens/HomeScreen';
import { WalletsScreen } from './screens/WalletsScreen';
import { CoinsScreen } from './screens/CoinsScreen';
import { ChartScreen } from './screens/ChartScreen';
import { MonitorScreen } from './screens/MonitorScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AboutScreen } from './screens/AboutScreen';

const drawerWidth = 200;
const mdTheme = createTheme();

export function App() {
  const linkeStyle = {
    textDecoration: 'none',
    color: 'black',
  };

  return (
    <Router>
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Drawer style={{ width: drawerWidth }} variant="persistent" open>
            <List style={{ width: drawerWidth }}>
              <Link to="/" style={linkeStyle}>
                <ListItem button>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
              </Link>
              <Link to="/wallets" style={linkeStyle}>
                <ListItem button>
                  <ListItemIcon>
                    <AccountBalanceWalletIcon />
                  </ListItemIcon>
                  <ListItemText primary="Wallets" />
                </ListItem>
              </Link>
              <Link to="/coins" style={linkeStyle}>
                <ListItem button>
                  <ListItemIcon>
                    <AddShoppingCartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Coins" />
                </ListItem>
              </Link>
              <Link to="/chart" style={linkeStyle}>
                <ListItem button>
                  <ListItemIcon>
                    <ShowChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Chart" />
                </ListItem>
              </Link>
              <Link to="/monitor" style={linkeStyle}>
                <ListItem button>
                  <ListItemIcon>
                    <MonitorIcon />
                  </ListItemIcon>
                  <ListItemText primary="Monitor" />
                </ListItem>
              </Link>
              <Link to="/settings" style={linkeStyle}>
                <ListItem button>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItem>
              </Link>
              <Link to="/about" style={linkeStyle}>
                <ListItem button>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText primary="About" />
                </ListItem>
              </Link>
            </List>
          </Drawer>
          <Switch>
            <Route path="/wallets" component={WalletsScreen} />
            <Route path="/coins" component={CoinsScreen} />
            <Route path="/chart" component={ChartScreen} />
            <Route path="/monitor" component={MonitorScreen} />
            <Route path="/settings" component={SettingsScreen} />
            <Route path="/about" component={AboutScreen} />
            <Route path="/" component={HomeScreen} />
          </Switch>
        </Box>
      </ThemeProvider>
    </Router>
  );
}
