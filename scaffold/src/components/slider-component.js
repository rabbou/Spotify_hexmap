import React from 'react';

class SliderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderValue: 0,
      dateValue: '1/1/2017'
    };
  }

  onChange = (e) => {
    const firstDate = new Date(2017, 0, 1);
    const newDate = new Date(firstDate.getTime() + e.target.value * 24 * 60 * 60 * 1000);
    const dateString = `${newDate.getFullYear()}-${
      newDate.getMonth() + 1 < 10 ? '0' : ''}${newDate.getMonth() + 1}-${
      newDate.getDate() < 10 ? '0' : ''}${newDate.getDate()}`;
    const dateString2 = `${newDate.getMonth() + 1}/${newDate.getDate()}/${
      newDate.getFullYear()}`;
    this.setState({
      sliderValue: e.target.value,
      dateValue: dateString2});
    this.props.onChange(dateString);
  }

  render() {
    return (
      <div width = "2000">
        <input className="slider" type="range"
        value={this.state.sliderValue} min="0" max="365"
        step="1" onChange = {this.onChange.bind(this)}/>
        <div className="slider-value">{this.state.dateValue}</div>
      </div>
    );
  }
}
SliderComponent.displayName = 'SliderComponent';
export default SliderComponent;
