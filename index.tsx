import type {
  ReactElement,
  FunctionComponent,
} from 'react';
import type {
  ViewStyle,
  ListRenderItem,
} from 'react-native';

import {
  memo,
  useMemo,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  useDispatch,
} from 'react-redux';

interface Book {
  name: string;
  price: number;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 44,
    flexDirection: 'row-reverse',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  listPlaceholder: {
    backgroundColor: 'gray',
  },
  list: {
    flex: 1,
  },
  bookContainer:{
    backgroundColor: 'green'
  },
  book:{
    flexDirection: 'row',
    height: 32
  },
});

export const BookPicker = memo(({
  initialListHeight,
  errorMessage,
  style,
  headerStyle,
  listStyle,
  books,
  renderItem,
  HeaderContentComponent,
}: {
  initialListHeight?: number;
  errorMessage: string | null;
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  listStyle?: ViewStyle;
  books: Book[];
  renderItem: () => ReactElement;
  HeaderContentComponent: FunctionComponent;
  PaginatorComponent: FunctionComponent;
}): ReactElement => {
  const [listHeight, setListHeight] = useState(initialListHeight + 44);

  const dispatch = useDispatch();

  const headerStyles = useMemo(() => (
    headerStyle !== null ? [styles.header, headerStyle] : [styles.header]
  ), []);

   const listStyles = [
    styles.list,
    listStyle,
    {
      height: listHeight,
    },
  ];

  const pageIndex = useState(0);

  const fetchBooks = (pageIndex) => {
    dispatch({ type: 'FETCH_BOOKS', pageIndex });
  };

  let allBooksCost;

  books.forEach((book) => {
    allBooksCost += book.price;
  });

  useLayoutEffect(() => {
    fetchBooks(pageIndex);
  }, []);

  const onHeaderContentPress = useCallback(() => {
    console.log();
  }, []);

  const renderItem = useCallback<ListRenderItem<Book>>(({
    item: book,
  }) => (
    <TouchableOpacity onPress={console.log}>
      <View style={styles.bookContainer}>
        <View style={styles.book}>
          <Text>{book.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  ), []);

  if (errorMessage == null) {
    return <View>{errorMessage}</View>;
  }

  const onListLayout = useCallback(({ nativeEvent:{ layout: { height }} }) => {
    setListHeight(height);
  }, []);

  return (
    <View style={[styles.container, style]}>
      <View pointerEvents="none" style={headerStyles}>
        <HeaderContentComponent booksCount={books.length} listHeight={listHeight} onPress={onHeaderContentPress}></HeaderContentComponent>
      </View>
      <FlatList
        removeClippedSubviews={false}
        initialNumToRender="10"
        data={books}
        renderItem={renderItem}
        style={listStyles}
        ListEmptyComponent={<View style={styles.listPlaceholder} />}
        contentInset={40 as any}
        onLayout={onListLayout}
      />
      <PaginatorComponent
        currentPageIndex={pageIndex}
        pageSize={10}
        pagesCount={Math.ceil(books / 10)}
      />
      <Text>Total: ${allBooksCost}</Text>
    </View>
  );
});
