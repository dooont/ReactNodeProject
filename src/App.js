import logo from './logo.svg';
import './App.css';
import React from 'react';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';

function App() {
  return (
    <React.Fragment>
      <Container maxWidth = {false}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pokedex
          </Typography>
          <Avatar alt="Pokeball" src="/pokeballtransparent.png"/>
        </Toolbar>
      </AppBar>
      </Container>
    </React.Fragment>
  );
}
 //Where the Actual Coding Happens

 
export default App;
