import * as React from 'react';
import {useEffect, useState, forceUpdate} from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  Dimensions,
  FlatList,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {doc, onSnapshot} from 'firebase/firestore';
// import grid from './Components/grid.js';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();

import firestore from '@react-native-firebase/firestore';

let a = '';
let b = 0;
while (b < 5) {
  b = b + 1;
  console.log('user', a);
}

// const users = await firestore().collection('Users').get();
// const user = await firestore().collection('Users').doc('ABC').get();
// console.log(user);
// while (this.GameStatus['Gamestatus'] === 'yes') {
//   console.log('why');
//
// }
//intialize

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update state to force render
  // An function that increment 👆🏻 the previous state like here
  // is better than directly setting `value + 1`
}
let Game = '';
function alertGame() {}
function User(docname, gridData, mode) {
  const [board, setboard] = useState(gridData);
  const forceUpdate = useForceUpdate();
  // const dataFetchedRef = useRef(0);

  useEffect(() => {
    const subscriber = firestore()
      .collection('SDP')
      .doc(docname)
      .onSnapshot(documentSnapshot => {
        // if (dataFetchedRef.current < 1) {
        //   dataFetchedRef.current++;
        //   return;
        // }
        if (documentSnapshot.data().GameStatus === 'Game end.') {
          if (documentSnapshot.data().Winner === 'MCTS 2') {
            Game = 'Game ended. ' + 'Winner is AI';
          } else if (documentSnapshot.data().Winner === 'Human 1') {
            Game = 'Game ended. ' + 'Winner is Player 1';
          } else if (documentSnapshot.data().Winner === 'Human 2') {
            Game = 'Game ended. ' + 'Winner is Player 2';
          }
        } else {
          Game = 'In Progress ';
        }

        if (documentSnapshot.data().flag === 'true') {
          if (documentSnapshot.data().Player === 'Human 1') {
            gridData[documentSnapshot.data().LocationRow][
              documentSnapshot.data().LocationCol
            ] = 2;
          } else if (documentSnapshot.data().Player === 'MCTS 2') {
            gridData[documentSnapshot.data().LocationRow][
              documentSnapshot.data().LocationCol
            ] = 1;
          } else if (documentSnapshot.data().Player === 'Human 2') {
            gridData[documentSnapshot.data().LocationRow][
              documentSnapshot.data().LocationCol
            ] = 3;
          }
        }

        setboard(gridData);
        console.log('haha', gridData);
        // console.log('number of time: ', dataFetchedRef.current);

        // dataFetchedRef.current = true;

        // let grids = grid(gridData);
        // console.log(grids);
        forceUpdate();
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docname]);
  return (
    <View
      style={{
        flex: 0.8,
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 5,
      }}>
      <Text
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          fontSize: 50,
        }}>
        {Game}
      </Text>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        {getGrid(gridData[0])}
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        {getGrid(gridData[1])}
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        {getGrid(gridData[2])}
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        {getGrid(gridData[3])}
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        {getGrid(gridData[4])}
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        {getGrid(gridData[5])}
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        {getGrid(gridData[6])}
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        {getGrid(gridData[7])}
      </View>
    </View>
  );

  // Stop listening for updates when no longer required
  // eslint-disable-next-line react-hooks/exhaustive-deps
}

function HomeScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Button
        title="Start the Game"
        onPress={() => {
          chooseGameMode(navigation);
          initialState();

          //navigation.navigate('Details')
        }}
      />
    </View>
  );
}

function getData() {
  return new Promise((resolve, reject) => {
    const collection = firestore().collection('SDP').doc('Steplog');
    collection.get().then(doc => {
      let flag = '';
      flag = doc.data();
      resolve(flag);
    });
  });
}
async function getGame(UserID) {
  let random2 = await User(UserID);
  console.log(random2);
}

async function getData2(gridData) {
  let data = await getData();
  let settings = await getSettings();
  if (settings.Mode === '3') {
    let human1 = await getHuman1();
    let human2 = await getHuman2();
    gridData[parseInt(human1.move)] = {key: 1};
    gridData[parseInt(human2.move)] = {key: 2};
    getData2();
  } else {
    let com1 = await getComputer();
    let hum = await getHuman1();
    gridData[parseInt(com1.move)] = {key: 1};
    gridData[parseInt(hum.move)] = {key: 2};
    console.log(com1);
    console.log(hum);
    getData2();
  }
}

function getHuman1() {
  return new Promise((resolve, reject) => {
    const collection = firestore().collection('SDP').doc('Human 1');
    collection.get().then(doc => {
      let flag = '';
      flag = doc.data();
      resolve(flag);
    });
  });
}

function getHuman2() {
  return new Promise((resolve, reject) => {
    const collection = firestore().collection('SDP').doc('Human 2');
    collection.get().then(doc => {
      let flag = '';
      flag = doc.data();
      resolve(flag);
    });
  });
}

function getComputer() {
  return new Promise((resolve, reject) => {
    const collection = firestore().collection('SDP').doc('MCTS 2');
    collection.get().then(doc => {
      let flag = '';
      flag = doc.data();
      resolve(flag);
    });
  });
}

function getSettings() {
  return new Promise((resolve, reject) => {
    const collection = firestore().collection('SDP').doc('settings');
    collection.get().then(doc => {
      let flag = '';
      flag = doc.data();
      resolve(flag);
    });
  });
}
async function getMode() {
  let settings = await getSettings();
  console.log('here', settings.Mode);
  return settings.Mode;
}
function setSettings(mode, difficulty) {
  firestore()
    .collection('SDP')
    .doc('settings')
    .set({
      PvC: mode,
      difficulty: difficulty,
    })
    .then(() => {
      console.log('User added!');
    });
}
function DetailsScreen({navigation, route}) {
  const getTitle = d => {
    if (d === 'e') {
      return 'Easy Mode';
    } else if (d === 'm') {
      return 'Medium Mode';
    } else if (d === 'h') {
      return 'Hard Mode';
    } else if (d === 'pvp') {
      return 'PvP';
    } else {
      return '';
    }
  };
  let random = getTitle(route.params.d);
  if (random === 'PvP') {
    setSettings('0', '0');
  } else if (random === 'Easy Mode') {
    setSettings('1', '1');
  } else if (random === 'Medium Mode') {
    setSettings('1', '2');
  } else if (random === 'Hard Mode') {
    setSettings('1', '3');
  }

  if (random === 'PvP') {
    return User('Steplog', gridData, 'PvP');
  } else {
    return User('Steplog', gridData, 'PvC');
  }
}
// return User('Steplog', gridData);

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Game" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 2,
  },
  title: {
    textAlign: 'center',
    marginVertical: 60,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 30,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  baseText: {
    fontSize: 69,
    color: 'black',
    textAlign: 'center',
  },
  item: {
    flex: 1,
    alignSelf: 'stretch',
    padding: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 1,
  },
  text: {
    color: 'white',
    fontSize: 32,
  },
  button: {
    backgroundColor: '#cf6893',
    borderRadius: 10,
    borderWidth: 10,
    borderColor: '#26ff00',
  },
  Gamestatus: {
    justifyContent: 'center',
    fontSize: 25,
    marginBottom: 20,
  },
});

const chooseAI = navi => {
  Alert.alert(
    'Choose the AI difficulty',
    'choose from three options from below',
    [
      {
        text: 'Easy',
        onPress: () => {
          console.log('Easy Mode chosen:'), navi.navigate('Game', {d: 'e'});
        },
      },
      {
        text: 'Medium',
        onPress: () => {
          console.log('Medium Mode Chosen'), navi.navigate('Game', {d: 'm'});
        },
      },
      {
        text: 'Hard',
        onPress: () => {
          console.log('Hard Mode Chosen'), navi.navigate('Game', {d: 'h'});
        },
      },
    ],
  );
};
const chooseGameMode = navi => {
  Alert.alert(
    'Choose the AI difficulty',
    'choose from three options from below',
    [
      {
        text: 'Player vs. Player',
        onPress: () => {
          navi.navigate('Game', {d: 'pvp'});
        },
      },
      {
        text: 'Player vs. Computer',
        onPress: () => {
          console.log('Medium Mode Chosen'), chooseAI(navi);
        },
      },
    ],
  );
};

// const formatData = (data, numColumns) => {
//   const numberOfFullRows = Math.floor(data.length / numColumns);
//   let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
//   while (
//     numberOfElementsLastRow !== numColumns &&
//     numberOfElementsLastRow !== 0
//   ) {
//     data.push({key: `blank-${numberOfElementsLastRow}`, empty: true});
//     numberOfElementsLastRow++;
//   }
//   return data;
// };

//   let renderItem = ({item, index}) => {
//     if (item.empty !== true) {
//       if (item.key === 0) {
//         return <View style={[gridStyles.item]} />;
//       }
//       if (item.key === 1) {
//         return <View style={[gridStyles.item2]} />;
//       }
//       if (item.key === 2) {
//         return <View style={[gridStyles.item3]} />;
//       }
//     }
//     return (
//       <View style={gridStyles.item}>
//         <Text style={gridStyles.itemText} />
//       </View>
//     );
//   };
//   console.log(renderItem())
//   return (
//     <View style={[gridStyles.item]} />
//   );
// }

console.log('here');
const numColumns = 16;
const gridStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 0,
  },
  item: {
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: 50, // approximate a square
  },
  item2: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: 50,
  },
  item3: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: 50,
  },
  item4: {
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: 50,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#fff',
  },
});

let gridData = resetGrid();

function resetGrid() {
  let gridData = [];
  let row = 8;
  let column = 8;
  for (let i = 0; i < row; i++) {
    let temp = [];
    for (let j = 0; j < column; j++) {
      temp.push(0);
    }
    gridData.push(temp);
  }
  return gridData;
}

function getGrid(gridData) {
  let temp = [];
  for (let i = 0; i < gridData.length; i++) {
    temp.push(helper(gridData[i]));
  }
  return temp;
}
function helper(gridData) {
  if (gridData === 1) {
    return <View style={[gridStyles.item2]} />;
  } else if (gridData === 2) {
    return <View style={[gridStyles.item3]} />;
  } else if (gridData === 3) {
    return <View style={[gridStyles.item4]} />;
  } else {
    return <View style={[gridStyles.item]} />;
  }
}
function initialState() {
  firestore()
    .collection('SDP')
    .doc('Steplog')
    .set({
      GameStatus: 'Not Finished',
      LocationCol: 'false',
      LocationRow: 'false',
      Player: 'false',
      flag: 'false',
    })
    .then(() => {
      console.log('User added!');
    });
  firestore()
    .collection('SDP')
    .doc('settings')
    .set({
      PvC: 'false',
      difficulty: 'false',
    })
    .then(() => {
      console.log('User added!');
    });
  gridData = resetGrid();
}
console.log(gridData[0]);
console.log(getGrid(gridData[0]));
// console.log(getGrid());
// console.log(getGrid()[1][2])
