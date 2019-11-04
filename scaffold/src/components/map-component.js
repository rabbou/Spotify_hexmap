import React from 'react';
import SliderComponent from './slider-component';
import CountryComponent from './country-component';
const colors = {
  NA: '#fc8d62',
  SA: '#66c2a5',
  EU: '#8da0cb',
  AU: '#e78ac3',
  AS: '#a6d854',
  global: '#888'
};

let curDate = null;
let playingAudio = new Audio();

class MapComponent extends React.Component {
  state = {
    songNames: {},
    songImages: {},
    songs: {},
    hexes: [],
    data: [],
    date: '2017-01-01',
    songData: [],
    country: ''
  };

  componentWillMount() {
    const {data, hexes, songData} = this.props;
    const {songNames, songImages, songs, date, country} = this.state;
    this.setState({
      songNames, songImages, songs, hexes, data, date, songData, country
    });
    const dayData = data.filter(d => d.Date === date).filter(d => d.Position === '1');
    dayData.forEach(d => {
      const song = songData.filter(d2 => d.URL === d2.URL)[0];
      songImages[d.Region] = song.image;
      songNames[d.Region] = d['Track.Name'];
      songs[d.Region] = song.previewURL;
    });
    this.render();
  }

  playSong(songURL) {
    if (!songURL) {
      playingAudio.pause();
      return;
    }
    playingAudio.pause();
    playingAudio = new Audio(songURL);
    playingAudio.play();
  }

  clickCountry(countryAbbr) {
    playingAudio.pause();
    // if (countryAbbr === '') {
    //   this.playSong(this.state.songs[countryAbbr]);
    // }
    this.setState({
      songNames: this.state.songNames,
      songImages: this.state.songImages,
      songs: this.state.songs,
      hexes: this.state.hexes,
      data: this.state.data,
      date: this.state.date,
      songData: this.state.songData,
      country: countryAbbr
    });
  }

  dateChange(date) {
    playingAudio.pause();
    curDate = date;
    const dayData = this.state.data.filter(d => d.Date === date).filter(d => d.Position === '1');
    const songNames = {};
    const songImages = {};
    const songs = {};
    dayData.forEach(d => {
      const song = this.state.songData.filter(d2 => d.URL === d2.URL)[0];
      songImages[d.Region] = song.image;
      songNames[d.Region] = d['Track.Name'];
      songs[d.Region] = song.previewURL;
    });
    if (date === curDate) {
      this.setState({
        songNames,
        songImages,
        songs,
        hexes: this.state.hexes,
        data: this.state.data,
        date,
        songData: this.state.songData,
        country: this.state.country
      });
    }
    this.render();
  }

  render() {

    const {data, hexes, date, songNames, songData, songImages, country} = this.state;
    const width = 2000;
    const hexWidth = width / 15;
    const scaling = 0.95;
    const dx = scaling * hexWidth / 2;
    const HY = scaling * hexWidth / Math.sqrt(3);
    const dy = HY / 2;
    const constructedPath = `M${(-dx)},${dy}
      l${dx},${dy}
      l${dx},${-dy}
      l0,${-HY}
      l${-dx},${-dy}
      l${-dx},${dy} Z
      `;

    const hexWidth2 = width / 10;
    const dx2 = scaling * hexWidth2 / 2;
    const HY2 = scaling * hexWidth2 / Math.sqrt(3);
    const dy2 = HY2 / 2;
    const constructedPath2 = `M${(-dx2)},${dy2}
      l${dx2},${dy2}
      l${dx2},${-dy2}
      l0,${-HY2}
      l${-dx2},${-dy2}
      l${-dx2},${dy2} Z
      `;
    return (
      <div>
        <svg id="vis" width={width} height={width * 0.65}>
          {hexes.map((row, idx) => {
            const hexCol = Number(row.HexRow);
            const hexRow = Number(row.HexCol);

            const pos = [
              200 + hexWidth * (-0.3 + 0.5 * Math.sqrt(3) * hexCol),
              200 + hexWidth * (-2 + (9 - hexRow) + ((hexCol % 2 === 1) ? 0.5 : 0))
            ];

            return (
              <g
              onClick={() => this.clickCountry(row.CountryAbbr)}
              transform={`translate(${pos[0]}, ${pos[1]})`}
              className="state-hex"
              key={idx}><path
                  fill={colors[row.Continent]}
                  stroke={'#fff'}
                  strokeWidth="2"
                  d={constructedPath}
                  transform="rotate(30)" />
                <text
                  fontFamily="Futura PT"
                  textAnchor="middle"
                  alignmentBaseline="central"
                  className={`state-hex-label ${''}`}
                  transform={`translate(0, ${-3 * hexWidth / 8})`}
                  >{row.CountryName}</text>
                <text
                  fontFamily="Futura PT"
                  textAnchor="middle"
                  alignmentBaseline="central"
                  className={`state-hex-label ${''}`}
                  transform={`translate(0, ${3 * hexWidth / 8})`}
                  >{songNames[row.CountryAbbr] ?
                    songNames[row.CountryAbbr].slice(0, 10) : ''}
                </text>
                <image x={-hexWidth / 4} y={-hexWidth / 4} width = {hexWidth / 2} height = {hexWidth / 2}
                href = {songImages[row.CountryAbbr] ?
                  songImages[row.CountryAbbr] : ''}/>
              </g>);
          })}
          <g
          onClick={() => this.clickCountry('global')}
          transform={`translate(${width / 2}, ${width * 0.65 * 0.9})`}
          ><path
              fill={'#AAA'}
              stroke={'#fff'}
              strokeWidth="2"
              d={constructedPath2}
              transform="rotate(30)" />
            <text
              fontFamily="Futura PT"
              fontSize="20px"
              textAnchor="middle"
              alignmentBaseline="central"
              className={`state-hex-label ${''}`}
              transform={`translate(0, ${-3 * hexWidth2 / 8})`}
              >{'Global'}</text>
            <text
              fontFamily="Futura PT"
              textAnchor="middle"
              fontSize="20px"
              alignmentBaseline="central"
              className={`state-hex-label ${''}`}
              transform={`translate(0, ${3 * hexWidth2 / 8})`}
              >{songNames.global ?
                songNames.global.slice(0, 10) : ''}
            </text>
            <image x={-hexWidth2 / 4} y={-hexWidth2 / 4} width = {hexWidth2 / 2} height = {hexWidth2 / 2}
            href = {songImages.global ?
              songImages.global : ''}/>
          </g>
          {country === '' ? null : (<g>
            <CountryComponent date={date} songData={songData}
            exitClick={this.clickCountry.bind(this)} onClick={this.playSong.bind(this)}
            countryName={hexes.filter(d => d.CountryAbbr === country).length > 0 ?
              hexes.filter(d => d.CountryAbbr === country)[0].CountryName : 'global'}
            color={colors[hexes.filter(d => d.CountryAbbr === country).length > 0 ?
              hexes.filter(d => d.CountryAbbr === country)[0].Continent : 'global']}
            data={data.filter(d => d.Region === country)}/>
          </g>)}
        </svg>
        <SliderComponent onChange={this.dateChange.bind(this)}/>
      </div>
    );
  }
}

MapComponent.displayName = 'MapComponent';
export default MapComponent;
