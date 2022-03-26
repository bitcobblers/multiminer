import { useEffect, useState, useRef, useMemo } from 'react';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';

// Material.
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { Button, ListItemIcon, ListItemText, CssBaseline, Drawer, List, Box, PaletteMode, Switch as ToggleSwitch, ListItemButton } from '@mui/material';
import { SnackbarProvider, SnackbarKey, useSnackbar } from 'notistack';
import { lightGreen, teal } from '@mui/material/colors';

// Navigation Icons.
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import MonitorIcon from '@mui/icons-material/Monitor';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';

// Components.
import { Toolbar } from './components/Toolbar';

// Context.
import { MinerContext } from './MinerContext';
import { MinerState, minerState$, minerErrors$ } from '../models';

// Screens.
import { HomeScreen, WalletsScreen, CoinsScreen, MinersScreen, MonitorScreen, SettingsScreen, AboutScreen } from './screens';
import { minerExited$, minerStarted$ } from './services/MinerService';

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

const NavLink = (props: { id: number; to: string; icon: JSX.Element; text: string }) => {
  const { id, to, icon, text } = props;
  const theme = useTheme();

  return (
    <Link key={id} to={to} style={{ textDecoration: 'none' }}>
      <ListItemButton sx={{ color: theme.palette.text.primary }}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </Link>
  );
};

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
  const [managerState, setManagerState] = useState<MinerState>({ state: 'inactive', currentCoin: '' });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const stateSubscription = minerState$.subscribe((s) => {
      setManagerState(s);
    });

    const startedSubscription = minerStarted$.subscribe(({ coin }) => {
      enqueueSnackbar(`Miner is now mining ${coin}.`);
    });

    const stoppedSubscription = minerExited$.subscribe((code) => {
      if (code) {
        enqueueSnackbar(`Miner exited with code ${code}.`);
      } else {
        enqueueSnackbar('Miner exited.');
      }
    });

    const alertSubscription = minerErrors$.subscribe((s) => {
      enqueueSnackbar(s, { variant: 'error' });
    });

    return () => {
      stateSubscription.unsubscribe();
      startedSubscription.unsubscribe();
      stoppedSubscription.unsubscribe();
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
                alignItems: 'stretch',
              },
            }}
            variant="persistent"
            open
          >
            <List style={{ width: drawerWidth }}>{links.map(NavLink)}</List>
            <Toolbar />
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

  const THEME_KEY = 'theme-mode';
  const [themeMode, setThemeMode] = useState<PaletteMode>((localStorage.getItem(THEME_KEY) as PaletteMode) ?? 'light');
  const mdTheme = useMemo(() => {
    const isDark = themeMode === 'dark';
    return createTheme({
      palette: {
        primary: isDark ? lightGreen : teal,
        text: {
          primary: isDark ? '#C9D1D9' : 'rgba(0, 0, 0, 0.87);',
        },
        mode: themeMode,
      },
    });
  }, [themeMode]);

  return (
    <ThemeProvider theme={mdTheme}>
      <SnackbarProvider maxSnack={5} ref={snackRef} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} action={(key) => <Button onClick={closeSnack(key)}>Dismiss</Button>}>
        <AppContent
          themeToggle={
            <div className="theme-toggle">
              <span style={{ textTransform: 'capitalize' }}>{themeMode} mode</span>
              <ToggleSwitch
                checked={themeMode === 'dark'}
                onChange={(event) => {
                  const mode = event.target.checked ? 'dark' : 'light';
                  localStorage.setItem(THEME_KEY, mode);
                  setThemeMode(mode);
                }}
              />
            </div>
          }
        />
      </SnackbarProvider>
    </ThemeProvider>
  );
}
