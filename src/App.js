import './App.css';
import pokeball from './pokeballtransparent.png';
import React, { useState, useEffect, Fragment } from 'react';
import {
  Container, AppBar, Box, Toolbar, Typography, Button, Avatar, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Collapse, Pagination, Grid, Chip, Stack, LinearProgress, Divider
} from '@mui/material';
import axios from 'axios';
import _ from 'lodash';

function App() {
  const [pokemonData, setPokemonData] = useState([]);

  const [progressWebsite, setProgressWebsite] = React.useState(false);

  const [openId, setOpenId] = React.useState({});


  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };
  const [pokemonInfo, setPokemonInfo] = useState({});
  const [pokemonDescription, setPokemonDescription] = useState({});

  async function getPokemon(pageNumber) {
    const result = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${(pageNumber - 1) * 10}`);
    const pokemonObject = result.data.results.reduce((acc, currentValue, index) => {
      acc[currentValue.name] = false;
      return acc;
    }, {})

    function getNumber(page) {

    }


    setOpenId(pokemonObject);
    return result.data.results;
  }

  const handleListItemClick = (event, name) => {
    const updatedOpenId = _.cloneDeep(openId);
    updatedOpenId[name.toLowerCase()] = !openId[name.toLowerCase()];
    setOpenId(updatedOpenId);
  }

  const retrievePokemon = async (name) => {
    const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const updatedPokemonInfo = {
      ...pokemonInfo,
      [name.toLowerCase()]: result.data
    };
    setPokemonInfo(updatedPokemonInfo);
    return result;
  }

  const retrievePokemonDescription = async (name) => {
    const result = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
    const flavor_text_entries = result.data?.flavor_text_entries;
    const english_flavor_text = flavor_text_entries?.find((entry => entry.language.name == 'en'))?.flavor_text ?? 'na';
    const line = english_flavor_text
    const newline = line.replace(/(\r\n|\n|\r|\f)/gm, " ");
    const updatedPokemonDesc = {
      ...pokemonDescription,
      [name.toLowerCase()]: newline
    };
    setPokemonDescription(updatedPokemonDesc);
    return newline;
  }

  useEffect(() => {
    (async () => {
      setProgressWebsite(true);
      const pokemonAPIResults = await getPokemon(page);
      setPokemonData(pokemonAPIResults);
      setProgressWebsite(false);
    })()
  }, [page]);

  const getColor = (type) => {
    const typeLookUp = {
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
  }

  return (
    <Container maxWidth={false} sx={{ width: '80%' }}>
      <AppBar position="static" sx={{ backgroundColor: '#700101' }}>
        <Toolbar sx={{}}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pokédex
          </Typography>
          <Avatar alt="Pokeball" src={pokeball} />
        </Toolbar>
      </AppBar>

      {progressWebsite ?
        <LinearProgress /> :
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={4}>
          <Grid item xs={12} sx={{ width: '100%' }}>
            <List>
              {
                pokemonData.map((pokemonIterator, pokemonIndex) => {
                  const pokemonID = (page - 1) * 10 + pokemonIndex + 1; 
                  const pokemonName = pokemonIterator.name.charAt(0).toUpperCase() + pokemonIterator.name.slice(1);
                  return (
                    <Fragment key={pokemonName}>
                      {/* <Stack justifyContent="space-between" direction="row" alignItems="center"> */}
                        <ListItem disablePadding key={pokemonName} sx={{ minWidth: '300px', width: '100%' }} secondaryAction={
                          <ListItemText secondary={"#"+pokemonID} sx={{ fontSize: "12px"}} />
                        }>
                          <ListItemButton selected={openId[pokemonIterator.name]}
                            onClick={async (event) => {
                              handleListItemClick(event, pokemonIterator.name);
                              await retrievePokemon(pokemonIterator.name);
                              await retrievePokemonDescription(pokemonIterator.name);
                            }}>
                            <ListItemText primary={pokemonName} />
                          </ListItemButton>
                        </ListItem>
                      {/* </Stack> */}
                      <Divider component="li" />
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
            <Pagination count={25} page={page} onChange={handleChange} />
          </Grid>
        </Grid>
      }



    </Container>
  );
}

export default App;
