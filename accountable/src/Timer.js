import React, {Component} from 'react';

export class Timer extends Component {
  constructor(props){
    super(props);
    this.state = {
      remainingMinutes: this.props.remainingMinutes,
      remainingSeconds: 0
    };
  }

  updateRemainMinutesAndSeconds(timeRemainingInSeconds){
    let remainingMinutes = Math.floor(timeRemainingInSeconds/60);
    let remainingSeconds = timeRemainingInSeconds % 60;
    this.setState({
      remainingMinutes,
      remainingSeconds
    });
  }

  countDown(timeRemainingInSeconds,shouldSkipCallback){
    this.setState({
      timeRemainingInSeconds
    });
    if (!shouldSkipCallback && timeRemainingInSeconds % 60 === 0) {
      this.props.onEveryMinute(1);
    }
    if (timeRemainingInSeconds === 0){
      this.props.onCompletion();
    }
    localStorage.setItem('timeRemainingInSeconds',timeRemainingInSeconds);
    if(timeRemainingInSeconds > 0){
      this.updateRemainMinutesAndSeconds(timeRemainingInSeconds);
      timeRemainingInSeconds = timeRemainingInSeconds-1;
      this.setTimeoutId = setTimeout(this.countDown.bind(this,timeRemainingInSeconds, false), 1000);
    }
  }

  compareServerTimeAndComponentTimeAndUpdateServer(serverSideTimeRemainingInSeconds){
    let componentTimeRemainingInSeconds = localStorage.getItem('timeRemainingInSeconds');
    if(componentTimeRemainingInSeconds && componentTimeRemainingInSeconds < serverSideTimeRemainingInSeconds) {
      let differenceInMinutes = Math.floor((serverSideTimeRemainingInSeconds - componentTimeRemainingInSeconds)/60)
      if(differenceInMinutes>0){
        this.props.onEveryMinute(differenceInMinutes)
      }
      return componentTimeRemainingInSeconds;
    }
    return serverSideTimeRemainingInSeconds;
  }

  componentWillReceiveProps(nextProps){
    if(this.props.timeRemainingInSeconds !== nextProps.timeRemainingInSeconds){
      let timeRemainingInSeconds = this.compareServerTimeAndComponentTimeAndUpdateServer(nextProps.timeRemainingInSeconds);
      this.countDown(timeRemainingInSeconds,true);
    }
  }

  componentWillUnmount(){
    clearTimeout(this.setTimeoutId);
  }

  render(){
    return (
      <div className='timer'>
          <div className='font-weight-bold lead number-display'>
            {
              this.state.remainingMinutes>9?
              this.state.remainingMinutes:'0'+this.state.remainingMinutes
            }:{
              this.state.remainingSeconds>9?
              this.state.remainingSeconds:'0'+this.state.remainingSeconds
            }
          </div>
           
              <div className='info'>remaining</div>
          

      </div>
    )
  }
}

export default Timer;