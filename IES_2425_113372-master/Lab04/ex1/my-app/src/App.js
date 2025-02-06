import './App.css';

import { useState } from 'react';

function App() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />

      <Profile />

      <ShoppingList />

      <MyApp />

      <MyAppp />
    </div>
  );
}

export default App;



function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );
}


const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}



const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}


function MyApp() {
  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButtonn />
      <MyButtonn />
    </div>
  );
}

function MyButtonn() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}



function MyAppp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButtonnn count={count} onClick={handleClick} />
      <MyButtonnn count={count} onClick={handleClick} />
    </div>
  );
}

function MyButtonnn({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
