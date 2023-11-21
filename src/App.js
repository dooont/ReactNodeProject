import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, Fragment } from 'react';
import {
  Container, AppBar, Box, Toolbar, Typography, Button, Avatar, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Collapse, Pagination, Grid, Chip, Stack, LinearProgress
} from '@mui/material';
import axios from 'axios';
import _ from 'lodash';
//learning points, rest api, reactjs, fullstack, nodejs, mui, pair programming, etc. 
// git add .; git commit -m "message"; git push

function App() {
  const [pokemonData, setPokemonData] = useState([]); //In "cuz ur stupid terms" use state makes pokemonData an array, and setPokemonData sets the values based on the api

  const [progressWebsite, setProgressWebsite] = React.useState(false);
  const [progressPokemon, setProgressPokemon] = React.useState(false);

  const [openId, setOpenId] = React.useState({});


  const [page, setPage] = React.useState(0);
  const handleChange = (event, value) => {
    setPage(value);
  };
  const [pokemonInfo, setPokemonInfo] = useState({}); //In "cuz ur stupid terms" use state makes pokemonData an array, and setPokemonData sets the values based on the api
  const [pokemonDescription, setPokemonDescription] = useState({});

  async function getPokemon(pageNumber) {
    const result = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${(pageNumber - 1) * 10}`); //calls the pokemon api (which is a rest api), axios is a library that lets you make calls to other apis
    
    const pokemonObject = result.data.results.reduce((acc, currentValue, index) => {
      acc[currentValue.name] = false;
      return acc;
    } , {} ) //if array was empty, it'd return back an empty object
    //so apparently you can update content of an array of an object with const?? that's crazy

    console.log(pokemonObject);

    setOpenId(pokemonObject);
    return result.data.results;
  }

  const handleListItemClick = (event, name) => {
    // openId[name] = true;
    //when we update state, you can't just set openId after, we have to give it a brand new object
    //if static, . if dynamic, []
    const updatedOpenId = _.cloneDeep(openId);
    updatedOpenId[name.toLowerCase()] = !openId[name.toLowerCase()];
    setOpenId(updatedOpenId);
    console.log(updatedOpenId);
    //only one opens rn because it's looking for a static number
    //we need react state management
  }

  const retrievePokemon = async (name) => {
    const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);

    const updatedPokemonInfo = {

      ...pokemonInfo, 
      [name.toLowerCase()]: result.data
      //[] is how we dynamically set it to the name we want
    };

    setPokemonInfo(updatedPokemonInfo);
    //when you make an http request (like a get function), responses is always going to be a lot of stuff, but we want the data specifically
    //everytime you do get, make sure you call .data
    //https://axios-http.com/docs/res_schema
    return result;
  }

  const retrievePokemonDescription = async (name) => {
    const result = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
    const flavor_text_entries = result.data?.flavor_text_entries;
    const english_flavor_text = flavor_text_entries?.find((entry => entry.language.name == 'en'))?.flavor_text ?? 'na';
    const line = english_flavor_text
    const newline = line.replace(/(\r\n|\n|\r|\f)/gm, " ");
    // console.log(newline);

    const updatedPokemonDesc = {
      ...pokemonDescription,
      [name.toLowerCase()]: newline
    };
    setPokemonDescription(updatedPokemonDesc);
    return newline;
  }

  useEffect(() => {
    (async () => { //when using async in use effect, you gotta to the empty parentheses
      setProgressWebsite(true);
      const pokemonAPIResults = await getPokemon(page);
      setPokemonData(pokemonAPIResults);
      setProgressWebsite(false);
    })()
  }, [page]);

  const getColor = (type) => {
    const typeLookUp = {
      //hashmap of all the types
      normal: '#A8A77A',
      fire: '#EE8130',
      water: '#6390F0',
      electric: '#F7D02C',
      grass: '#7AC74C',
      ice: '#96D9D6',
      fighting: '#C22E28',
      poison: '#A33EA1',
      ground: '#E2BF65',
      flying: '#A98FF3',
      psychic: '#F95587',
      bug: '#A6B91A',
      rock: '#B6A136',
      ghost: '#735797',
      dragon: '#6F35FC',
      dark: '#705746',
      steel: '#B7B7CE',
      fairy: '#D685AD',
    }
    return typeLookUp[type] ?? 'black';
    //?? = nullish coalescing operator
  }

  console.log(pokemonInfo);
  console.log(pokemonDescription);
  console.log(openId);

  return (
    <Container maxWidth={false}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pokedex
          </Typography>
          <Avatar alt="Pokeball" src="/pokeballtransparent.png" />
        </Toolbar>
      </AppBar>

      {progressWebsite ?
        <LinearProgress /> :
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={4}>
          <Grid item xs={12}>
            <List>
              {
                pokemonData.map(pokemonIterator => {
                  // const url_id = pokemonIterator.url.split('/')[6];
                  //[] in this situation means it's the 7th item in the array
                  const pokemonName = pokemonIterator.name.charAt(0).toUpperCase() + pokemonIterator.name.slice(1);

                  console.log(pokemonName);

                  return ( //always have keys :D
                    //<> and </> are fragments, say hi :D
                    <Fragment key={pokemonName}>
                      <ListItem disablePadding key={pokemonName} sx={{ minWidth: '1000px' }}>
                        <ListItemButton selected={openId[pokemonIterator.name]}
                          onClick={async (event) => {
                            //async how does it work?
                            handleListItemClick(event, pokemonIterator.name);
                            //await, how does it work?
                            //"magic" - corinna yong, the best teacher ever 
                            await retrievePokemon(pokemonIterator.name);
                            await retrievePokemonDescription(pokemonIterator.name);
                            //this one needs to be lowercase cuz it's calling from the API
                          }}>

                          <ListItemText primary={pokemonName} />
                        </ListItemButton>
                      </ListItem>
                      <Collapse in={openId[pokemonIterator.name]} timeout="auto" unmountOnExit>
                        <Container maxWidth='false'>
                          <Stack direction='row' alignItems='center' justifyContent='space-between'>
                            <img src={pokemonInfo[pokemonIterator.name]?.sprites?.front_default} />
                            <Box>
                              {
                                pokemonDescription[pokemonIterator.name]
                              }
                            </Box>
                            <Box>
                              {pokemonInfo[pokemonIterator.name]?.types?.map(type => {
                                //what does the question mark do? 
                                //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
                                // return <Typography>{type.type.name}</Typography>
                                const pokemonTyping = type.type.name //gets the typing of the pokemon
                                return <Chip label={pokemonTyping.charAt(0).toUpperCase() + pokemonTyping.slice(1)}
                                  style={{ backgroundColor: getColor(pokemonTyping), color: 'white', margin: '2px' }} />
                              })}
                            </Box>
                          </Stack>
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
      }



    </Container>
  );
}
//Where the Actual Coding Happens

export default App;
