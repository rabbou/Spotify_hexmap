import React from 'react';

class CountryComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {selected: null, curDate: null};

  componentWillMount() {
    const {date} = this.props;
    this.setState({selected: null, curDate: date});
  }

  componentWillUpdate(nextProps, nextState) {
    const {date} = nextProps;
    const {curDate} = nextState;
    if (curDate !== null && date !== curDate) {
      this.setState({selected: null, curDate: date});
    }

  }

  clickRect(index, song) {
    const {selected} = this.state;
    if (selected === index) {
      this.props.onClick(null);
      this.setState({selected: null});
      this.render();
      return;
    }
    this.setState({selected: index});
    this.props.onClick(song);
    this.render();
  }

  render() {
    const {date, data, songData, countryName, color} = this.props;
    const {selected} = this.state;
    const dayData = data.filter(d => d.Date === date);
    const songImages = {};
    const songNames = {};
    const songs = {1: null, 2: null, 3: null, 4: null, 5: null, 6: null,
      7: null, 8: null, 9: null, 10: null};
    const songArtists = {};
    dayData.forEach(d => {
      const song = songData.filter(d2 => d.URL === d2.URL)[0];
      songImages[d.Position] = song.image;
      songNames[d.Position] = d['Track.Name'];
      songs[d.Position] = song.previewURL;
      songArtists[d.Position] = d.Artist;
    });
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const width = 1500;
    const height = 1500 * 0.65;
    const cellHeight = height / 11;
    return (
      <g transform={`translate(250, ${250 * 0.65})`}>
        <rect x={0} y={0} width={width} height={height} fill="white"
        strokeWidth={1} stroke="black"/>
        <g>
          <rect x={0} y={0} width={width} height={cellHeight} fill={color}
          opacity={0.6}/>
          <text transform={`translate(${width * 0.5}, ${cellHeight / 2})`}
              fontFamily="Futura PT"
              fontSize={36}
              fill="black"
              alignmentBaseline="central"
              textAnchor="middle"> {countryName} </text>
          <image onClick={() => this.props.exitClick('')}
          x={width - cellHeight * 0.91} y={cellHeight * 0.1}
            width = {cellHeight * 0.8} height = {cellHeight * 0.8}
            href = "images/close.png"/>
        </g>
        {ranks.map(r => {
          const y = cellHeight * r;
          return (
            <g onClick={() => this.clickRect(r, songs[r])}
            transform={`translate(0, ${y})`} key = {r}>
              <rect x={0} y={0} width={width} height={cellHeight}
              fill={selected === r ? '#AAA' : color}
              opacity={0.6}
              />
              <line x1={0} x2={width} y1={0} y2={0} stroke="black" />
              <text transform={`translate(${width * 0.02}, ${cellHeight / 2})`}
              fontFamily="Futura PT"
              fontSize={36}
              fill="black"
              alignmentBaseline="central"> {r} </text>
              <text transform={`translate(${width * 0.17}, ${cellHeight / 2})`}
              fontFamily="Futura PT"
              fontSize={36}
              fill="black"
              alignmentBaseline="central">
                {!songNames[r] ? '' : `${songNames[r].slice(0, 50)} by ${songArtists[r].slice(0, 100)}`}
              </text>

              <image x={width * 0.05} y={cellHeight * 0.1}
              width = {cellHeight * 0.8} height = {cellHeight * 0.8}
              href = {songImages[r]}/>
              <image x={width * 0.11} y={cellHeight * 0.1}
              width = {cellHeight * 0.8} height = {cellHeight * 0.8}
              href = {songs[r] !== null ? '/images/sound.png' : ''}/>
            </g>
          );
        })}
      </g>
    );
  }
}

CountryComponent.displayName = 'CountryComponent';
export default CountryComponent;
