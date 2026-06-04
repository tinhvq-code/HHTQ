import { Box } from '@mui/material';

function PageShell({ children }) {
  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: '#101010', overflow: 'hidden' }}>
      {children}
    </Box>
  );
}

export default PageShell;
