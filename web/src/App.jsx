import React, { useState } from 'react';
import { Grid, AppBar, Toolbar, Typography, Button, Link } from '@material-ui/core';
import './App.css';
import GitHubIcon from '@material-ui/icons/GitHub';
import { makeStyles } from '@material-ui/core/styles';
import SourceImage from './SourceImage';
import ImagePreProcessor from './ImagePreProcessor';
import Retropixels from './Retropixels';
import Logo from './logo.svg';

const buildNr = '%BUILD_NR%';
const commitUrl = '%COMMIT_URL%';

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
  const [filename, setFilename] = useState(undefined);

  const classes = useStyles();

  function onSourceImageChanged(newSourceImage) {
    setSourceImage(newSourceImage.jimpImage);
    setFilename(newSourceImage.filename);
  }
  return (
    <div className="App">
      {/* <header className="App-header">Retropixels</header> */}
      <body className="App-body">
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar variant="dense">
              <img src={Logo} alt="Logo" className="logo" />
              <Typography variant="h6" className={classes.title} align="left">
                Retropixels
              </Typography>
              <Link href={commitUrl} color="inherit">
                v{buildNr}
              </Link>
              <Button color="inherit" href="https://github.com/micheldebree/retropixels">
                <GitHubIcon />
              </Button>
            </Toolbar>
          </AppBar>
        </div>
        <Grid container spacing={3}>
          <Grid item xs>
            <SourceImage onChanged={onSourceImageChanged} />
          </Grid>
          <Grid item xs>
            <ImagePreProcessor jimpImage={sourceImage} onChanged={jimpImage => setProcessedImage(jimpImage)} />
          </Grid>
          <Grid item xs>
            <Retropixels jimpImage={processedImage} filename={filename} />
          </Grid>
        </Grid>
      </body>
    </div>
  );
}

export default App;
