import React from 'react';

export const withDeviceOrientation = ({ debug }) => Component => {
    return class WithDeviceOrientation extends React.Component {
        constructor(props) {
            super(props);

            this.eventListener = null;

            this.state = {
                beta: 0.0,
                gamma: 0.0,
                alpha: 0.0,
            };
        }

        getOrientation = () => ({
            beta: this.state.beta,
            gamma: this.state.gamma,
            alpha: this.state.alpha,
        })

        addEventListener = () => {
            // Only add one listener
            if (this.eventListener) {
                return;
            }

            this.eventListener = window.addEventListener('deviceorientation', event => {
                let beta = event.beta < -60 || event.beta > 60 ? this.state.beta : Number(event.beta.toFixed(0));
                if ((beta > 0 && beta < 3) || (beta < 0 && beta > -3)) {
                    beta = 0;
                }

                let gamma = event.gamma < -60 || event.gamma > 60 ? this.state.gamma : event.gamma;
                if ((gamma > 0 && gamma < 3) || (gamma < 0 && gamma > -3)) {
                    gamma = 0;
                }

                this.setState({
                    beta,
                    gamma,
                    alpha: event.alpha,
                });
            })
        }

        componentDidMount() {
            this.addEventListener();
            if (DeviceOrientationEvent.requestPermission) {
                DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response == 'granted') {
                        this.addEventListener();    
                    }
                })
                .catch(console.error)
            } else {
                this.addEventListener();
            }
        }

        render() {
            return (
                <div>
                    {debug && (
                        <div>
                            <p>gamma: {this.state.gamma}</p>
                            <p>beta: {this.state.beta}</p>
                            <p>alpha: {this.state.alpha}</p>
                        </div>
                    )}
                    <Component 
                        getOrientation={this.getOrientation}
                        {...this.props}
                    />
                </div>
            );
        }
    }
}

// deviceOrientationHandler = evt => {
//     // useAnimationFrame(deltaTime => {
//     //   // Pass on a function to the setter of the state
//     //   // to make sure we always have the latest state
//     //   // setCount(prevCount => (prevCount + deltaTime * 0.01) % 100)
//     // })

//     // const v = 0.4;
//     // const diffBeta = Math.max(-v, Math.min(v, beta - this.state.beta));
//     // const diffGamma = Math.max(-v, Math.min(v, gamma - this.state.gamma));

//     // const angle = 45;
//     // const newBeta = Math.max(-angle, Math.min(angle, this.state.beta + diffBeta));
//     // const newGamma = Math.max(-angle, Math.min(angle, this.state.gamma + diffGamma));

//     // const i = Math.max(0, Math.min(this.m, transformRage(-45, 45, 0, this.m - 1, newBeta)));
//     // const j = Math.max(0, Math.min(this.n, transformRage(-45, 45, 0, this.n - 1, newGamma)));
//   }
