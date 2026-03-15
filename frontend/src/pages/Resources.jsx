import { Container, Paper, Typography, Box, Link, Grid } from '@mui/material';
import { Phone, Web, LocalHospital } from '@mui/icons-material';

const Resources = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Mental Health & Support Resources
        </Typography>
        
        <Typography variant="body1" paragraph>
          Your mental health matters. If you're struggling, please reach out to these resources:
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Phone sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6">Crisis Hotlines</Typography>
                <Typography>National Suicide Prevention Lifeline: 988</Typography>
                <Typography>Crisis Text Line: Text HOME to 741741</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalHospital sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6">HIV/AIDS Resources</Typography>
                <Typography>
                  <Link href="https://www.hiv.gov" target="_blank">HIV.gov</Link> - Official U.S. government HIV/AIDS information
                </Typography>
                <Typography>
                  <Link href="https://www.cdc.gov/hiv" target="_blank">CDC HIV Resources</Link>
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Web sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6">Support Organizations</Typography>
                <Typography>
                  <Link href="https://www.thebody.com" target="_blank">TheBody.com</Link> - HIV/AIDS information and community
                </Typography>
                <Typography>
                  <Link href="https://www.poz.com" target="_blank">POZ</Link> - Health, life, and HIV
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Emergency
          </Typography>
          <Typography>
            If you're in immediate danger or having a medical emergency, please call 911 or go to your nearest emergency room.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Resources;
