import React, {Component} from 'react';
import './App.scss';
import './controls.scss'
class App extends Component{

  state = {
      ctx: null,
      workTime: 25,
      minutesCounter: 0,
      secondsCounter: 0,
      totalSeconds: 0,
      isPaused: true,
      timer: null,
      progressTimer: null,
      progressCounter: 0,
      height: 200,
      width: 200,
      diff: null,
      start: 4.72
  }

  constructor() {
    super();

    this.timerRef = React.createRef();



  }

  componentDidMount() {

      this.setState({ctx: this.timerRef.current.getContext("2d")});

      setTimeout(()=> {
          this.initTimer();
      }, 100)

  }



    initTimer() {

      let {workTime} = this.state;

      let totalSeconds = workTime * 60;


        this.setState({progress: 0})
        this.setState({progressCounter: 0});
        this.setState({minutesCounter: workTime})
        this.setState({totalSeconds: totalSeconds})
        this.setState({secondsCounter: 0})
        this.setState({workTime: 25})
            this.initTimerDisplay();
    }

    getTimeDisplay() {
        let minutesDisplay;
        if( this.state.minutesCounter < 10) {
            minutesDisplay = '0' +this.state.minutesCounter;
        } else {
            minutesDisplay = this.state.minutesCounter
        }
        let secondsDisplay;
        if( this.state.secondsCounter < 10) {
            secondsDisplay = '0' +this.state.secondsCounter;
        } else {
            secondsDisplay = this.state.secondsCounter;
        }

        return {minutesDisplay, secondsDisplay}
    }

    initTimerDisplay() {

        let {ctx, width, height} = this.state

        // Setting canvas properties
        ctx.clearRect(0,0,width, height);
        ctx.fillStyle = '#5bddf8';
        ctx.font='32px Montserrat';
        ctx.shadowColor="#5bddf8"


        const {minutesDisplay, secondsDisplay} = this.getTimeDisplay();
        ctx.fillText(minutesDisplay + " : " + secondsDisplay, 57, 110, this.state.width);
        ctx.beginPath();

        this.setState(ctx)
    }


    startPomodoroTimer() {
      let {minutesCounter, secondsCounter, timer, progressTimer} = this.state;
        let timerRunner = setInterval(()=> {

            // Start the timer if the timer data are properly initialized or timer has not finished count down
            if(this.state.secondsCounter === 0 && this.state.minutesCounter >= 0) {

                minutesCounter--;
                secondsCounter = 60;
                this.setState({minutesCounter: minutesCounter})
                this.setState({secondsCounter: secondsCounter})
                if(this.state.minutesCounter < 0 ) {


                    timer = clearInterval(timerRunner);
                    progressTimer = clearInterval(progressTimer)
                    this.setState({timer: timer})
                    this.setState({progressTimer: progressTimer});
                }
            }
            if(this.state.minutesCounter >= 0) {
                secondsCounter--;
                this.setState({secondsCounter: secondsCounter})
            }
            // if timer has finished counting down reset timer
            if(this.state.minutesCounter < 0 && this.state.secondsCounter === 60) {
                this.setState({isPaused: true})
                this.initTimer();
            }


        }, 1000);

        this.setState({timer: timerRunner})
    }

    startProgressBar() {
      let {ctx, progressCounter, totalSeconds, width, height, start} = this.state;

      // Updating canvas based on updated state of the timer
        let progressTimer = setInterval(()=> {
            if(progressCounter <= totalSeconds) {


                let updatedProgress = progressCounter * 100 / totalSeconds;
                this.setState({progress: updatedProgress})

                this.setState({diff: (this.state.progress / 100) * Math.PI*2*10})
                ctx.clearRect(0,0,width, height);
                ctx.shadowColor="#5bddf8"
                ctx.fillStyle = '#5bddf8';
                ctx.font='32px Montserrat';
                ctx.textAllign ='center';

                const {minutesDisplay, secondsDisplay} = this.getTimeDisplay()


                ctx.fillText(minutesDisplay + " : " + secondsDisplay, 57, 110, width);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#5bddf8'
                ctx.beginPath();
                ctx.arc(100,100, 90, start, this.state.diff/10+ start , false);
                ctx.stroke();


                progressCounter++;
                this.setState({progressCounter: progressCounter})
                this.setState({ctx: ctx});


            }

        },1000)
        this.setState({progressTimer: progressTimer})

    }
    timerControl() {

        let {timer, progressTimer, isPaused} = this.state;
        if(isPaused) {
            this.startProgressBar();
            this.startPomodoroTimer();
            this.setState({isPaused: false})

        } else {

            timer = clearInterval(timer)
            progressTimer = clearInterval(progressTimer)

            this.setState({timer: timer})
            this.setState({progressTimer: clearInterval(progressTimer)})
            this.setState({isPaused: true})
        }
    }




    render() {

    return(
        <div className={"container"}>
            <div className={"timer-wrapper"}>
                <div className={"timer"}>
                    <canvas width={200} height={200} ref={this.timerRef}></canvas>
                </div>
                {this.state.isPaused ?
                    <button className={"button"} onClick={(e)=> this.timerControl()}>START</button> :
                    <button className={"button"} onClick={(e)=> this.timerControl()}>PAUSE</button>
                }
            </div>
        </div>
    )
  }

}

export default App;
