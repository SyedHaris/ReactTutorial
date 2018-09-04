import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props)
  {
    return (
      <button className="square" onClick={ props.onClick } >
        { props.value }
      </button>
    );
  }
  
  class Board extends React.Component {

    renderSquare(i) {
      return <Square 
                    key = {i}
                    value = { this.props.squares[i] } 
                    onClick = { () => this.props.onClick(i) }
                    />;
    }
  
    render() {

     let  rows = [];

      for(let i = 0; i < 9 ; i += 3)
      {

        let cols = [];

        for(let j = i; j < (i + 3) ; j++ )
        {
          cols.push(this.renderSquare(j));
        }

        rows.push(<div key = {i} className = "board-row" > { cols } </div>);

      }
 
      return (
        <div>
          {/* <div className="status">{status}</div> */}
         { rows }
        </div>
      );
    }

  }
  
  class Game extends React.Component {
    constructor(props)
    {

      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          colRow: []
        }],
        step: 0,
        xIsNext: true,
        checked: 1
      };

    }

    handleClick(i) {
      
      const colRow = getColRow(i).toString();
      const history = this.state.history.slice(0, this.state.step + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      if (calculateWinner(squares) || squares[i]) {
        return;
      }

      squares[i] = this.state.xIsNext ? 'X' : 'O';

      this.setState({
        history: history.concat([{
          squares: squares,
          colRow: colRow
        }]),
        step: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step){

      this.setState({
        step: step,
        xIsNext: (step % 2) === 0
      });

    }

    sort(order, moves){
      
            if(order === ASC)
            {
              this.setState(
                {
                  checked: 1
                }
              );
            }
            
            else if(order === DESC)
            {
              this.setState(
                {
                  checked: 0
                }
              );
            }
      
          }

    render() {

      const history = this.state.history;
      const current = history[this.state.step];
      const winner = calculateWinner(current.squares);

      let moves = history.map((step, move) => {
        const desc = move ?
                      'Go to move #' + move :
                      'Restart game';
        const cls = move == (history.length - 1) ? 'bold' : '' ;
        
        return (
          <li key = { move } className =  {cls} >
            <button onClick={ () => this.jumpTo(move) }>
                { desc }
            </button>
            <span> { step.colRow } </span>
          </li>
          
        );
      });
  
      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
  let sort;
  
  sort =  (
    <div>
      <p>Order moves:</p>
      <form>
      <label>Ascending</label>
      <input type="radio"   name="sort"  checked={ this.state.checked ? true : false } onClick = { () => this.sort(ASC, moves) }/>   
      <label>Descending</label>         
      <input type="radio" name="sort" checked={ this.state.checked ? false : true }  onClick = { () => this.sort(DESC, moves) } />
    </form>
    </div>
    
    );

    if(!this.state.checked){

      moves = moves.reverse();
      moves.unshift(moves[moves.length - 1]);
      moves.length = moves.length - 1 ;

    }
  

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares = { current.squares }
              onClick = { i => this.handleClick(i) }
            />
          </div>
          <div className="game-info">
            <div>{ status }</div>
            { sort}
            <ol>{ moves }</ol>
          </div>
        </div>
      );
    }
  }

  class Sort extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        check: 1
      };
    }

    handleClick(order, moves){

      if(order === ASC)
      {
        this.setState(
          {
            check: 1
          }
        );
      }
      
      else if(order === DESC)
      {
        this.setState(
          {
            check: 0
          }
        );
      }

      moves.reverse();

    }

    renderRadioBtn(){
      if(this.state.check)
          return (
            <div>
              <label>Ascending</label>
              <input type="radio"  checked onClick = { () => this.handleClick(ASC, this.props.moves) }/>   
              <label>Descending</label>         
              <input type="radio" onClick = { () => this.handleClick(DESC, this.props.moves) } />
            </div>
        
          );
        else
            return (
              <div>
                <label>Ascending</label>
                <input type="radio"   onClick = { () => this.handleClick(ASC, this.props.moves) }/>   
                <label>Descending</label>         
                <input type="radio" checked onClick = { () => this.handleClick(DESC, this.props.moves) } />
              </div>
          
            );
    }

    render(){
      return this.renderRadioBtn();
    }


  } 
  
  // ========================================

  const [ASC, DESC] = [0, 1];

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  function getColRow(index){


    const colRow = [
      [0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]
    ];

    return colRow[index];
  }
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  