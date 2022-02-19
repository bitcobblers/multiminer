/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
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
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import MonitorIcon from '@mui/icons-material/Monitor';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';

// Context.
import { MinerContext } from './MinerContext';
import { MinerState, serviceState$ } from './services/MinerManager';

// Screens.
import { HomeScreen } from './screens/HomeScreen';
import { WalletsScreen } from './screens/WalletsScreen';
import { CoinsScreen } from './screens/CoinsScreen';
import { MinersScreen } from './screens/MinersScreen';
import { MonitorScreen } from './screens/MonitorScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AboutScreen } from './screens/AboutScreen';

const drawerWidth = 200;
const mdTheme = createTheme();

const links = [
  { id: 0, to: '/', icon: <HomeIcon />, text: 'Home' },
  { id: 1, to: '/wallets', icon: <AccountBalanceWalletIcon />, text: 'Wallets' },
  { id: 2, to: '/coins', icon: <AddShoppingCartIcon />, text: 'Coins' },
  { id: 3, to: '/miners', icon: <RocketLaunchIcon />, text: 'Miners' },
  { id: 4, to: '/monitor', icon: <MonitorIcon />, text: 'Monitor' },
  { id: 5, to: '/settings', icon: <SettingsIcon />, text: 'Settings' },
  { id: 6, to: '/about', icon: <InfoIcon />, text: 'About' },
];

const linkStyle = {
  textDecoration: 'none',
  color: 'black',
};

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
              <List style={{ width: drawerWidth }}>
                {links.map((value) => {
                  return (
                    <Link key={value.id} to={value.to} style={linkStyle}>
                      <ListItem button>
                        <ListItemIcon>{value.icon}</ListItemIcon>
                        <ListItemText primary={value.text} />
                      </ListItem>
                    </Link>
                  );
                })}
              </List>
            </Drawer>
            <Switch>
              <Route path="/wallets" component={WalletsScreen} />
              <Route path="/coins" component={CoinsScreen} />
              <Route path="/miners" component={MinersScreen} />
              <Route path="/monitor" component={MonitorScreen} />
              <Route path="/settings" component={SettingsScreen} />
              <Route path="/about" component={AboutScreen} />
              <Route path="/" component={HomeScreen} />
            </Switch>
          </Box>
        </ThemeProvider>
      </Router>
    </MinerContext.Provider>
  );
}
