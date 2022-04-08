import React, { useCallback, useState } from 'react';
import { Grid, AppBar, Toolbar, Typography, Button, Link, Container } from '@material-ui/core';
import './App.css';
import GitHubIcon from '@material-ui/icons/GitHub';
import { makeStyles } from '@material-ui/core/styles';
import ImageSource from './ImageSource';
import Retropixels from './Retropixels';
import Logo from './logo.svg';
import AppVersion from './version';

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
  const [filename, setFilename] = useState(undefined);

  const classes = useStyles();

  const onSourceImageChanged = useCallback(
    newSourceImage => {
      setSourceImage(newSourceImage.jimpImage);
      setFilename(newSourceImage.filename);
    },
    [setSourceImage, setFilename]
  );

  return (
    <div className="App">
      <body className="App-body">
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar variant="dense">
              <img src={Logo} alt="Logo" className="logo" />
              <Typography variant="h6" className={classes.title} align="left">
                Retropixels
              </Typography>
              <Link href={AppVersion.url} color="inherit" variant="body2">
                v{AppVersion.buildnr}
              </Link>
              <Button color="inherit" href="https://github.com/micheldebree/retropixels">
                <GitHubIcon />
              </Button>
            </Toolbar>
          </AppBar>
        </div>
        <Container align="left">
          <Typography variant="overline">
            Convert images to <Link href="https://en.wikipedia.org/wiki/Commodore_64">Commodore 64</Link> format
          </Typography>
        </Container>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <ImageSource onChanged={onSourceImageChanged} />
          </Grid>
          <Grid item xs={12} sm={6} md={8}>
            <Retropixels jimpImage={sourceImage} filename={filename} />
          </Grid>
        </Grid>
      </body>
    </div>
  );
}

export default App;
