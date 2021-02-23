import React, {useState, useEffect} from "react";
import './App.css';
import { Route, Switch } from 'react-router-dom';
import AssoziationsLeafletMap from "./Components/AssoziationsLeafletMap";
import Header from "./Components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Row, Button, Image} from 'react-bootstrap';
import FreeGardenList from './Components/FreeGardenList';
import FreeGardenForm from './Components/FreeGardenForm';
import AssoziationItem from './Components/AssoziationItem';
import FreeGardenDetailItem from './Components/FreeGardenDetailItem';
import FavoritesLeafletMap from './Components/FavoritesLeafletMap';
import AssoziationsFavoritesList from './Components/AssoziationsFavoritesList';
import OwnAdDelete from './Components/OwnAdDelete';
import axios from 'axios';
import useLocalStorage from './useLocalStorage';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Scrollbars } from 'react-custom-scrollbars';
import { useHistory } from "react-router-dom";
import FreeGardenFavoritesList from "./Components/FreeGardenFavoritesList";
import FreeGardenLeafletMap from "./Components/FreeGardensLeafletMap";



function App() {
  
  const [kgvs, setKgvs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [gaerten, setGaerten] = useState([]);
  const [anzeige, setAnzeige] = useState({titel:'', beschreibung:'', kgv:'', pachtkosten:'', preis:'', verfügbar:'', gartemqm:'', name:'', email:'', telefon:''})
  const [ownAnzeige, setOwnAnzeige] = useLocalStorage('anzeigen', []);
  const [favourites, setFavourites] = useLocalStorage('favourite', []);

  const history = useHistory();

  const loadKgvs = (searchQuery) => {
    const API_URL = "https://goschreber.herokuapp.com"
    const url = `${API_URL}/kgvs`
    setIsLoading(true);
    setError(false);

    fetch(url)
      .then((res) => {
      
      console.log(res);

        if (!res.ok) throw new Error("Oh noo");
        setIsLoading(false);
        return res.json();
      })
      .then((json) => setKgvs(json.data))
      .catch((err) => setError(true));

  };

    useEffect(loadKgvs, []);
  
  
  const loadGaerten = (searchQuery) => {
      const API_URL = "https://goschreber.herokuapp.com"
      const url = `${API_URL}/anzeigens`
      setIsLoading(true);
      setError(false);
  
      fetch(url)
        .then((res) => {
        
        console.log(res);
  
          if (!res.ok) throw new Error("Oh noo");
          setIsLoading(false);
          return res.json();
        })
        .then((json) => setGaerten(json.data))
        .catch((err) => setError(true));
        };

      useEffect(loadGaerten, []);
/* //////////////////////////// ANZEIGEN IN LOCAL STORAGE///////////////////////////////////// */

function handleSubmit(e) { 
    e.preventDefault();
    axios
        .post("https://goschreber.herokuapp.com/anzeigens", anzeige)
        .then((res) => {
            const {_id} = res.data.data;
            setOwnAnzeige([
                ...ownAnzeige,
                _id
            ]);
            history.push(`frei/${_id}`);
        })  
  }
  const userAnzeigen = gaerten.filter(({_id}) => ownAnzeige.indexOf(_id) !== -1)

  /* ////////////////////////////////////////////////////////////////////////////////////////// */


  /* ///////////////////// SETTING FAVOURITES IN LOCAL STORAGE /////////////////////*/
  /* ////////////////////////////////////////////////////////////////////////////////*/


  
  function favouriteGarden(gardenid) {

    console.log(gardenid)
    console.log(favourites.indexOf(gardenid))

    if (favourites.indexOf(gardenid) === -1){
      setFavourites([
        ...favourites,
        gardenid
      ])
    } else {
      
      setFavourites(favourites.filter(item => item !== gardenid))
    }
  }

    const favouritedItems = kgvs.filter(({_id}) => favourites.indexOf(_id) !== -1)
    console.log(favouritedItems)

/*/////////////////////////////////////////////////////////////////////////////////////////////*/


const [merkFrei, setMerkFrei] = useLocalStorage('merkFreiGarten', []);
  
function merkFreiGarten(gartenid) {

  console.log(gartenid)
  console.log(merkFrei.indexOf(gartenid))

  if (merkFrei.indexOf(gartenid) === -1){
    setMerkFrei([
      ...merkFrei,
      gartenid
    ])
  } else {
    
    setMerkFrei(merkFrei.filter(item => item !== gartenid))
  }
}

  const merkFreiItems = gaerten.filter(({_id}) => merkFrei.indexOf(_id) !== -1)
  console.log(merkFreiItems)
/*////////////////////////////////////////////////////////////////////////////*/



  return (
      <>
        <Header />
        <Switch>
          <Route exact path="/">
            <Container fluid>
              <Row>
                <Col xs={8}>
                  <AssoziationsLeafletMap favouritedItems={favouritedItems} favourites={favourites} setFavourites={setFavourites} kgvs={kgvs}/>
                </Col>
                <Col>
                  <Scrollbars style={{ width: "100%", height: "100%" }}>
                    {kgvs.map(verein => <AssoziationItem favouritedItems={favouritedItems} favClick={() => favouriteGarden(verein._id)} verein={verein} key={verein._id}/>)}
                 </Scrollbars>
                </Col>
              </Row>
            </Container> 
          </Route>
          <Route exact path="/frei">
            <Container fluid>
              <Row>
            <Col xs={8}>
              <FreeGardenLeafletMap ownAnzeige={ownAnzeige} setMerkFrei={setMerkFrei} merkFrei={merkFrei} merkFreiItems={merkFreiItems} gaerten= {gaerten} kgvs={kgvs}/>
            </Col>  
            <Col>
              <Scrollbars style={{ width: "100%", height: "100%" }}>
                {gaerten.map(freigarten=> <FreeGardenList merkFreiItems={merkFreiItems} merkClick={() => merkFreiGarten(freigarten._id)} freigarten={freigarten} key={freigarten._id}/>)}
              </Scrollbars>
            </Col>
            </Row>
            </Container>
          </Route>
          <Route path="/frei/:id"> 
            <FreeGardenDetailItem setMerkFrei={setMerkFrei} merkFrei={merkFrei} merkFreiItems={merkFreiItems} />
          </Route>
          <Route exact path="/inserieren"> 
            <FreeGardenForm handleSubmit={handleSubmit} anzeige={anzeige} setAnzeige={setAnzeige} gaerten= {gaerten} kgvs={kgvs}/>
          </Route>
          <Route exact path="/verwalten">
            <Container className="mt-4"fluid>
              <Row>
              <Col xs={8}>
                <Image src="https://www.leipzig-lese.de/media_leipzig_lese/schreber_kopfbild_dsc04811.jpg" fluid rounded/>
            </Col>
            <Col>
              {userAnzeigen.map(eigAnzeige => <OwnAdDelete ownAnzeige={ownAnzeige} setOwnAnzeige={setOwnAnzeige} eigAnzeige={eigAnzeige} key={eigAnzeige._id}/>)} 
            </Col>
              </Row>
            </Container>
          </Route>
          <Route exact path="/merken">
            <Container fluid>
              <Row>
                <Col>
                  <h4 className="text-center mb-3">Merkliste Vereine</h4>
                  <CopyToClipboard text={favouritedItems.map(el => el.email)}>
                   <Button className="mb-2"variant="outline-success">Alle Email-Adressen in die Zwischenablage kopieren</Button>
                  </CopyToClipboard>
                  <Scrollbars style={{ width: "100%", height: "100%" }}>
                  {favouritedItems.map(verein => <AssoziationsFavoritesList favClick={() => favouriteGarden(verein._id)} verein={verein} favouritedItems={favouritedItems} setFavourites={setFavourites} favourites={favourites} key={verein._id}/>)}
                  </Scrollbars>
                </Col>
                <Col xs={6}>
                  {/* <h4 style={{color:"white" }}>g</h4> */}
                 <FavoritesLeafletMap favouritedItems={favouritedItems} setFavourites={setFavourites} favourites={favourites} merkFreiItems={merkFreiItems} setMerkFrei={setMerkFrei} merkFrei={merkFrei}/>
                </Col>
                <Col>
                  <h4 className="text-center mb-3">Merkliste Gärten</h4>
                  <CopyToClipboard text={merkFreiItems.map(el => el.email)}>
                   <Button className="mb-2"variant="outline-success">Alle Email-Adressen in die Zwischenablage kopieren</Button>
                  </CopyToClipboard>
                  <Scrollbars style={{ width: "100%", height: "100%" }}>
                    {merkFreiItems.map(freigarten => <FreeGardenFavoritesList merkClick={() => merkFreiGarten(freigarten._id)} freigarten={freigarten} key={freigarten._id} merkFreiItems={merkFreiItems} setMerkFrei={setMerkFrei} merkFrei={merkFrei}/>)}
                  </Scrollbars>
                </Col>
              </Row>
              </Container> 
          </Route>
        </Switch>  
      </>
  )
}

export default App;
