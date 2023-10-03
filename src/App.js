import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect, Fragment} from 'react';
import {Container, AppBar, Box, Toolbar, Typography, Button, Avatar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
Collapse, Pagination, Grid} from '@mui/material';
import axios from 'axios';
//learning points, rest api, reactjs, fullstack, nodejs, mui, pair programming, etc. 
// git add .; git commit -m "message"; git push

async function getPokemon(pageNumber) {
  const result = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${(pageNumber-1)*10}`); //calls the pokemon api (which is a rest api), axios is a library that lets you make calls to other apis
  return result;
}

function App() {
  const [pokemonData, setPokemonData] = useState([]); //In "cuz ur stupid terms" use state makes pokemonData an array, and setPokemonData sets the values based on the api
  
  const [openId, setOpenId] = React.useState(-1);
  const [page, setPage] = React.useState(0);
  const handleChange = (event, value) => {
    setPage(value);
  };
  const [pokemonInfo, setPokemonInfo] = useState({}); //In "cuz ur stupid terms" use state makes pokemonData an array, and setPokemonData sets the values based on the api

  const handleListItemClick = (event, id, name) => {
    setOpenId(id);
    
  }

  const retrievePokemon = async (name) => {
    const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    setPokemonInfo(result.data);
    //when you make an http request (like a get function), responses is always going to be a lot of stuff, but we want the data specifically
    //everytime you do get, make sure you call .data
    //https://axios-http.com/docs/res_schema
    return result;
  }

  useEffect(() => {
    (async () => { //when using async in use effect, you gotta to the empty parentheses 
      const pokemonAPIResults = await getPokemon(page);
      const pokemon = pokemonAPIResults.data.results;
      setPokemonData(pokemon); 
    })()
  }, [page]); 

  return (
    <Container maxWidth = {false}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pokedex
          </Typography>
          <Avatar alt="Pokeball" src="/pokeballtransparent.png"/>
        </Toolbar>
      </AppBar>
      <Grid container direction="column" justifyContent="center" alignItems="center" spacing = {4}>
      <Grid item xs={12}>
      <List>
        {
          pokemonData.map(pokemonIterator => {
            const url_id = pokemonIterator.url.split('/')[6];
            return ( //always have keys :D
            //<> and </> are fragments, say hi :D
            <Fragment key={pokemonIterator.name}> 
            <ListItem disablePadding key={pokemonIterator.name}>
              <ListItemButton selected={openId === url_id}
          onClick={async (event) => {
            //async how does it work?
            handleListItemClick(event, url_id, pokemonIterator.name);
            //await, how does it work?
            //"magic" - corinna yong, the best teacher ever (ty github copilot)
            await retrievePokemon(pokemonIterator.name);
          }}> 

                <ListItemText primary= {pokemonIterator.name} />
              </ListItemButton>
            </ListItem>
            <Collapse in={openId===url_id} timeout="auto" unmountOnExit>
              <Container>
                <img src={pokemonInfo.sprites?.front_default} />
                {pokemonInfo.types?.map(type => {
                  //what does the question mark do? 
                  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
                  return <Typography>{type.type.name}</Typography>
                })}
              </Container>  
            </Collapse>
            </Fragment>
            );
          }) 
        }
        </List>
        </Grid>
        <Grid item xs={12}>
        <Pagination count={129} page={page} onChange={handleChange} />
        </Grid>
      </Grid>
    </Container>
  );
}
 //Where the Actual Coding Happens

  
export default App;
