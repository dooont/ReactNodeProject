import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';
//learning points, rest api, reactjs, fullstack, nodejs, mui, pair programming, etc. 

async function getPokemon(pageNumber) {
  const result = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${pageNumber*10}`); //calls the pokemon api (which is a rest api), axios is a library that lets you make calls to other apis
  return result;
}

function App() {
  const [pokemonData, setPokemonData] = useState([]); //In "cuz ur stupid terms" use state makes pokemonData an array, and setPokemonData sets the values based on the api
  
  const [page, setPage] = React.useState(0);
  const handleChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    (async () => { //when using async in use effect, you gotta to the empty parentheses 
      const pokemonAPIResults = await getPokemon(page);
      const pokemon = pokemonAPIResults.data.results;
      // console.log(pokemonAPIResults);
      // console.log(pokemon);
      setPokemonData(pokemon); 
    })()
  }, [page]); 
  
  // const pokemon = [
  //     {
  //       name: 'Bulbasaur',
  //       id: 1,
  //       type: "Grass"
  //     },
  //     {
  //       name: 'Ivysaur',
  //       id: 2,
  //       type: ["Grass", "Poison"]
  //   },
  //     {name: 'Venusaur',
  //     id: 3,
  //     type: ["Grass", "Poison"]}
  // ];

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
      <Container>
      <List>
        {
          pokemonData.map(x => {
            return ( //always have keys :D
            <ListItem disablePadding key={x.name}>
              <ListItemButton>
                <ListItemText primary= {x.name} />
              </ListItemButton>
            </ListItem>
            );
          }) 
        }
        </List>
        </Container>
      </Container>
      <Pagination count={129} page={page} onChange={handleChange} />
    </React.Fragment>
  );
}
 //Where the Actual Coding Happens

 
export default App;
