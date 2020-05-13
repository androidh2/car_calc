import React, { Component } from 'react';
import logo from './Neko2.svg';
import './App.css';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { Table } from 'react-bootstrap';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { inputDate: 0
                 , inputDist: 0
                 , outputKin: 0
    };
    // ガソリン単価
    this.myTanka = 149;
  }

  componentWillMount(){
    // 前回値の読込
    /*global localStorage*/
    if (localStorage.inputDate!=null) {
      this.setState({
          inputDate: localStorage.inputDate
        , inputDist: localStorage.inputDist
        , outputKin : this.calcKin(localStorage.inputDate, localStorage.inputDist)
      });
    }
  }

  render() {
    return (
      <div className="App">
        <head>
        </head>
        <body className="App-intro">
          <div className="App-version">
            <text>Ver 1.0.9</text>
          </div>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">経費精算（自家用車）</h1>
          </header>
          <Table className="Table-Main">
            <tbody>
              <tr>
                <td>
                  <ControlLabel>勤務日数</ControlLabel>
                </td>
                <td>
                  <FormControl type="number" placeholder="入力してください"
                               value={this.state.inputDate}
                               onChange={this.onChangeInputDate}/>
                </td>
                <td>
                  <ControlLabel>日</ControlLabel>
                </td>
              </tr>
              <tr>
                <td>
                  <ControlLabel>通勤距離</ControlLabel>
                </td>
                <td>
                  <FormControl type="number" placeholder="入力してください"
                               value={this.state.inputDist}
                               onChange={this.onChangeInputDist}/>
                </td>
                <td>
                  <ControlLabel>km</ControlLabel>
                </td>
              </tr>
              <tr className="App-result">
                <td>
                  <ControlLabel>算出結果</ControlLabel>
                </td>
                <td>
                  <ControlLabel>{this.state.outputKin}</ControlLabel>
                </td>
                <td>
                  <ControlLabel>円</ControlLabel>
                </td>
              </tr>
            </tbody>
          </Table>

          <div className="App-formula">
            <ControlLabel></ControlLabel>
            <ControlLabel>{`【${this.myTanka}円×${this.state.inputDate}日×${this.state.inputDist}km/10km】`}</ControlLabel>
          </div>

          <FormGroup className="App-remark">
            <ControlLabel>注記）</ControlLabel>
            <ControlLabel>「申請日」は対象月の月末とすること。</ControlLabel>
          </FormGroup>

          <footer>
            <p>
              <a href="https://github.com/androidh2/car_calc">開発状況（GitHub）</a>
            </p>
          </footer>

        </body>
      </div>
    );
  }

  // 変更イベント：勤務日数
  onChangeInputDate = (event) => {
    this.setState({
        inputDate : event.target.value
      , outputKin : this.calcKin(event.target.value, this.state.inputDist)
    });
  }

  // 変更イベント：通勤距離
  onChangeInputDist = (event) => {
    this.setState({
        inputDist : event.target.value
      , outputKin : this.calcKin(this.state.inputDate, event.target.value)
    });
  }

  // 金額計算
  calcKin = (myDate, myDist) => {

    // 前回値の保存
    localStorage.inputDate=myDate;
    localStorage.inputDist=myDist;

    let myKingaku = this.myTanka*myDate*myDist/10;
    return myKingaku;
  }
}

export default App;
