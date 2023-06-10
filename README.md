# react-useInfiniteScrolling

Infinite get more data by scroll

[DEMO](https://roychen3.github.io/react-useInfiniteScrolling)

## Getting Started

```bash
npm run start
```

## Installation

node v16.14.2

```bash
npm install
```

## Usage

```jsx
import { useInfiniteScrolling } from './hook/useInfiniteScrolling';

function Component() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const handleInfiniteScrollingTrigger = useCallback(() => {
    if (hasMore && loading === false) {
      fetchData();
    }
  }, [hasMore, loading, fetchData]);
  const lastElementRef = useInfiniteScrolling(handleInfiniteScrollingTrigger);

  return (
    <div>
      {data.map((item, itemIdx) => (
        <Fragment key={item.id}>
          {itemIdx + 1 === data.length ? (
            <div ref={lastElementRef}>{item}</div>
          ) : (
            <div>{item}</div>
          )}
        </Fragment>
      ))}
      {hasMore === false && <p>in the end</p>}
    </div>
  );
}
```

## License

[LICENSE](LICENSE)
