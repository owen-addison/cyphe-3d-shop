import { useState, useEffect } from 'react';
import Header from './components/Header';
import Info from './components/Info';
import Item from './components/Item';
import './App.css';

interface ItemData {
  id: number;
  name: string;
  imageSrc: string;
  ingredients: string[];
}

function App() {
  const [items, setItems] = useState<ItemData[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  // const [activeItemId, setActiveItemId] = useState<number | null>(null);

  // const toggleItemDetail = (id: number) => {
  //   setActiveItemId((prevId) => (prevId === id ? null : id));
  // };

  useEffect(() => {
    fetch('/api/items.json')
      .then((response) => response.json())
      .then((data: { items: ItemData[] }) => setItems(data.items))
      .catch((error) => console.error('Error fetching items:', error));
  }, []);

  return (
    <div className="app-container">
      <Header onShowInfo={() => setShowInfo(true)} />
      <div className="item-container">
        {items.map((item) => (
          <Item
            key={item.id}
            data={item}
            // isDetailedView={activeItemId === item.id}
            // toggleView={() => toggleItemDetail(item.id)}
          />
        ))}
      </div>
      {showInfo && <Info onClose={() => setShowInfo(false)} />}
    </div>
  );
}

export default App;
