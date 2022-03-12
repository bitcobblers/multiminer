import { useEffect, useState, useRef } from 'react';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';

// Material.
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, ListItem, ListItemIcon, ListItemText, CssBaseline, Drawer, List, Box, PaletteMode, Switch as ToggleSwitch } from '@mui/material';
import { SnackbarProvider, SnackbarKey, useSnackbar } from 'notistack';

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
import { MinerState, minerState$, minerErrors$ } from '../models';

// Screens.
import { HomeScreen, WalletsScreen, CoinsScreen, MinersScreen, MonitorScreen, SettingsScreen, AboutScreen } from './screens';

const drawerWidth = 200;

const links = [
  { id: 0, to: '/', icon: <HomeIcon />, text: 'Home', screen: <HomeScreen /> },
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

function safeReverse<T>(items: Array<T>) {
  return [...items].reverse();
}

function AppContent({ themeToggle }: { themeToggle: React.ReactNode }) {
  const [managerState, setManagerState] = useState({ state: 'inactive', currentCoin: '', miner: '' } as MinerState);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const stateSubscription = minerState$.subscribe((s) => {
      setManagerState(s);
      enqueueSnackbar(`Miner is now ${s.state}.`);
    });

    const alertSubscription = minerErrors$.subscribe((s) => {
      enqueueSnackbar(s, { variant: 'error' });
    });

    return () => {
      stateSubscription.unsubscribe();
      alertSubscription.unsubscribe();
    };
  }, [enqueueSnackbar]);

  return (
    <MinerContext.Provider value={managerState}>
      <Router>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Drawer
            style={{ width: drawerWidth, display: 'flex' }}
            sx={{
              '& .MuiPaper-root': {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              },
            }}
            variant="persistent"
            open
          >
            <List style={{ width: drawerWidth }}>{links.map(NavLink)}</List>
            {themeToggle}
          </Drawer>
          <Switch>{safeReverse(links).map(NavScreen)}</Switch>
        </Box>
      </Router>
    </MinerContext.Provider>
  );
}

export function App() {
  const snackRef = useRef<SnackbarProvider>(null);

  const closeSnack = (key: SnackbarKey) => () => {
    snackRef.current?.closeSnackbar(key);
  };

  const [themeMode, setThemeMode] = useState<PaletteMode>('light');

  const mdTheme = createTheme({ palette: { mode: themeMode } });

  return (
    <ThemeProvider theme={mdTheme}>
      <SnackbarProvider maxSnack={5} ref={snackRef} action={(key) => <Button onClick={closeSnack(key)}>Dismiss</Button>}>
        <AppContent
          themeToggle={
            <div className="theme-toggle">
              <span style={{ textTransform: 'capitalize' }}>{themeMode} mode</span>
              <ToggleSwitch
                onChange={(event) => {
                  setThemeMode(event.target.checked ? 'dark' : 'light');
                }}
              />
            </div>
          }
        />
      </SnackbarProvider>
    </ThemeProvider>
  );
}
