/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';

// Material.
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ListItem, ListItemIcon, ListItemText, CssBaseline, Drawer, List, Box } from '@mui/material';

// Navigation Icons.
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import MonitorIcon from '@mui/icons-material/Monitor';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';

// Context.
import { MinerContext } from './MinerContext';
import { MinerState, serviceState$ } from './services/MinerManager';

// Screens.
import { HomeScreen, WalletsScreen, CoinsScreen, MinersScreen, MonitorScreen, SettingsScreen, AboutScreen } from './screens/AllScreens';

const drawerWidth = 200;
const mdTheme = createTheme();

const links = [
  { id: 0, to: '/$', icon: <HomeIcon />, text: 'Home', screen: <HomeScreen /> },
  { id: 1, to: '/wallets', icon: <AccountBalanceWalletIcon />, text: 'Wallets', screen: <WalletsScreen /> },
  { id: 2, to: '/coins', icon: <AddShoppingCartIcon />, text: 'Coins', screen: <CoinsScreen /> },
  { id: 3, to: '/miners', icon: <RocketLaunchIcon />, text: 'Miners', screen: <MinersScreen /> },
  { id: 4, to: '/monitor', icon: <MonitorIcon />, text: 'Monitor', screen: <MonitorScreen /> },
  { id: 5, to: '/settings', icon: <SettingsIcon />, text: 'Settings', screen: <SettingsScreen /> },
  { id: 6, to: '/about', icon: <InfoIcon />, text: 'About', screen: <AboutScreen /> },
];

const linkStyle = {
  textDecoration: 'none',
  color: 'black',
};

function NavLink(props: { id: number; to: string; icon: JSX.Element; text: string }) {
  const { id, to, icon, text } = props;

  return (
    <Link key={id} to={to} style={linkStyle}>
      <ListItem button>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>
    </Link>
  );
}

function NavScreen(props: { id: number; to: string; screen: JSX.Element }) {
  const { id, to, screen } = props;

  return (
    <Route key={id} path={to}>
      {screen}
    </Route>
  );
}

export function App() {
  const [managerState, setManagerState] = useState({ state: 'inactive', currentCoin: '', miner: '' } as MinerState);

  useEffect(() => {
    const subscription = serviceState$.subscribe((s) => {
      setManagerState(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <MinerContext.Provider value={managerState}>
      <Router>
        <ThemeProvider theme={mdTheme}>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer style={{ width: drawerWidth }} variant="persistent" open>
              <List style={{ width: drawerWidth }}>{links.map(NavLink)}</List>
            </Drawer>
            <Switch>{links.map(NavScreen)}</Switch>
          </Box>
        </ThemeProvider>
      </Router>
    </MinerContext.Provider>
  );
}
