import React from 'react';
import {csv} from 'd3-fetch';
import MapComponent from './map-component';

class RootComponent extends React.Component {
  state = {
    loading: true,
    myData: null,
    mapData: null
  }

  componentWillMount() {
    Promise.all([
      csv('data/data.csv'),
      csv('data/mapTiles.csv'),
      fetch('./data/dataSongs.json')
        .then(response => response.json())
    ]).then(data => {
      this.setState({
        loading: false,
        myData: data[0],
        hexes: data[1],
        songData: data[2]
      });
    });
  }

  render() {
    const {myData, loading, hexes, songData} = this.state;
    if (loading) {
      return (<div className="loading">loading . . .</div>);
    }
    return (
      <div className="flex center flex-column">
        <div className="title"> Most Streamed Songs on Spotify in Different Countries Throughout 2017</div>
        <MapComponent data = {myData} hexes = {hexes} songData = {songData} />
      </div>
    );
  }
}
RootComponent.displayName = 'RootComponent';
export default RootComponent;
