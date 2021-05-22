import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import GitHubIcon from '@material-ui/icons/GitHub';
import { makeStyles } from '@material-ui/core/styles';
import SourceImage from './SourceImage';
import ImagePreProcessor from './ImagePreProcessor';
import Retropixels from './Retropixels';

// https://github.com/harishmahamure/photoCompress

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

function App() {
  const [sourceImage, setSourceImage] = useState(undefined);
  const [processedImage, setProcessedImage] = useState(undefined);

  const classes = useStyles();

  return (
    <div className="App">
      {/* <header className="App-header">Retropixels</header> */}
      <body className="App-body">
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                Retropixels
              </Typography>
              <Button color="inherit" href="https://github.com/micheldebree/retropixels">
                <GitHubIcon />
              </Button>
            </Toolbar>
          </AppBar>
        </div>
        <Grid container spacing={3}>
          <Grid item xs>
            <SourceImage onChanged={jimpImage => setSourceImage(jimpImage)} />
          </Grid>
          <Grid item xs>
            <ImagePreProcessor jimpImage={sourceImage} onChanged={jimpImage => setProcessedImage(jimpImage)} />
          </Grid>
          <Grid item xs>
            <Retropixels jimpImage={processedImage} />
          </Grid>
        </Grid>
      </body>
    </div>
  );
}

export default App;