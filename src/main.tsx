import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from './theme.tsx'
import { Provider } from 'react-redux'
import store from './store/store.ts'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
  {/* CssBaseline ensures consistent styling */}
  <CssBaseline />
  <Provider store={store}>
  <App />

  </Provider>
</ThemeProvider>
)
