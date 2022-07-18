import React, { Component } from 'react';
import logo from './Neko2.svg';
import './App.css';
import { FormGroup, ControlLabel, FormControl, Radio } from 'react-bootstrap';
import { Table } from 'react-bootstrap';

class App extends Component {

  // 交通用具
  enmKotuyogu = {
    ZIDOSYA : 1,
    NIRINSYA: 2,
  };

  constructor(props) {
    super(props);

    // Version
    this.myVersion = "2.0.0";
    // 適用期間
    this.myKikan = "2022/4/1～2022/9/30";

    // 平均月間所定労働日数
    this.myDate = 20;
    // ガソリン単価
    this.myTanka = 175;
    // 平均燃費
    this.myNenpi = new Map();
    this.myNenpi.set(this.enmKotuyogu.ZIDOSYA,10);  // 自動車
    this.myNenpi.set(this.enmKotuyogu.NIRINSYA,30); // 二輪車

    // state定義
    // - 通勤距離
    // - 交通用具
    this.state = {
      inputDist : 0 ,
      kotuyogu  : this.enmKotuyogu.ZIDOSYA ,
    };
  }

  componentWillMount(){

    // 前回値の読込
    /*global localStorage*/
    if (localStorage.inputDate!=null) {

      // 交通用具
      // - localStorageは文字列で保存されるぽいので変換する。
      let tmp = this.enmKotuyogu.ZIDOSYA;
      switch(localStorage.kotuyogu){
        case "1":
          tmp = this.enmKotuyogu.ZIDOSYA;
          break;
        case "2":
          tmp = this.enmKotuyogu.NIRINSYA;
          break;
        default :
      }

      // state更新
      this.setState({
        inputDist : localStorage.inputDist ,
        kotuyogu  : tmp,
      });
    }
  }

  render() {
    return (
      <div className="App">
        <head>
        </head>
        <body className="App-intro">
          <div className="App-term">
            <text>{`適用期間：${this.myKikan}`}</text>
          </div>
          <div className="App-version">
            <text>{`Ver ${this.myVersion}`}</text>
          </div>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">経費精算（自家用車）</h1>
          </header>
          <Table className="Table-Main">
            <tbody>
              <tr>
                <td>
                  <ControlLabel>通勤距離(往復)</ControlLabel>
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
              <tr>
                <td>
                  <ControlLabel>平均月間労働日数</ControlLabel>
                </td>
                <td>
                  <FormControl type="number" placeholder="入力してください"
                               value={this.myDate}
                               disabled/>
                </td>
                <td>
                  <ControlLabel>日</ControlLabel>
                </td>
              </tr>
              <tr>
                <td>
                  <ControlLabel>ガソリン単価</ControlLabel>
                </td>
                <td>
                  <FormControl type="number" placeholder="入力してください"
                               value={this.myTanka}
                               disabled/>
                </td>
                <td>
                  <ControlLabel>円</ControlLabel>
                </td>
              </tr>
              <tr>
                <td>
                  <ControlLabel>交通用具</ControlLabel>
                </td>
                <td>
                  <FormGroup>
                    <Radio name="rbnKotuyogu"
                           checked={this.state.kotuyogu === this.enmKotuyogu.ZIDOSYA}
                           onChange={()=>this.setState({kotuyogu : this.enmKotuyogu.ZIDOSYA})}
                           inline>
                      自動車
                    </Radio>
                    <Radio name="rbnKotuyogu"
                           checked={this.state.kotuyogu === this.enmKotuyogu.NIRINSYA}
                           onChange={()=>this.setState({kotuyogu : this.enmKotuyogu.NIRINSYA})}
                           inline>
                      二輪車
                    </Radio>
                  </FormGroup>
                </td>
                <td>
                  <ControlLabel></ControlLabel>
                </td>
              </tr>
              <tr>
                <td>
                  <ControlLabel>平均燃費</ControlLabel>
                </td>
                <td>
                  <FormControl type="number" placeholder="入力してください"
                               value={this.myNenpi.get(this.state.kotuyogu)}
                               onChange={this.onChangeNenpi}
                               disabled/>
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
                  <ControlLabel>{this.calcKin()}</ControlLabel>
                </td>
                <td>
                  <ControlLabel>円</ControlLabel>
                </td>
              </tr>
            </tbody>
          </Table>

          <div className="App-formula">
            <ControlLabel></ControlLabel>
            <ControlLabel>{`　 【${this.state.inputDist}km×${this.myDate}日×${this.myTanka}円/${this.myNenpi.get(this.state.kotuyogu)}km】`}</ControlLabel>
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

  // 変更イベント：通勤距離
  onChangeInputDist = (event) => {
    // stateの更新
    this.setState({
      inputDist : event.target.value ,
    });
    // 前回値の保存
    this.saveZenkaiti();
  }

  // 変更イベント：平均燃費
  onChangeNenpi = () => {
    // 前回値の保存（交通用具）
    this.saveZenkaiti();
  }

  // 金額計算
  calcKin = () => {
    let myKingaku = this.myTanka*this.myDate*this.state.inputDist/this.myNenpi.get(this.state.kotuyogu);
    myKingaku = Math.round(myKingaku); // 端数処理（四捨五入）
    return myKingaku;
  }

  // 前回値の保存
  saveZenkaiti = () => {
    localStorage.kotuyogu = this.state.kotuyogu;
    localStorage.inputDist = this.state.inputDist;
  }
}

export default App;
