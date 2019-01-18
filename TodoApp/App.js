/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, ScrollView, Button} from 'react-native';
import path from './config/path';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {

  state = {
    text: "",
    list: [],
    forUpdate: null
  }

  componentDidMount = () => {
    // console.log("data-----------------------");
    this.getData();
  }
  
  getData = () => {
    console.log("data");
    fetch(`${path}/getlist`).then(res => res.json()).then(res => {console.log(res);this.setState({list: res.data,text: ""})});
  }
  selectForUpdate = (index, val) => {
    this.setState({forUpdate: {index, val}, text: val.text},() => {
      console.log(this.state.forUpdate);
    });
  }
  update = () => {
    const { list, text, forUpdate } = this.state;
    fetch(`${path}/update`,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({id: forUpdate.val._id,text})
    }).then(res => res.json()).then((res) => {list[forUpdate.index] = (res.data); this.setState({list,text: "",forUpdate: null})});
  }
  add = (inputText) => {
    const { list } = this.state;
    fetch(`${path}/add`,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({text: inputText})
    }).then(res => res.json()).then((res) => {list.push(res.data); this.setState({list,text: "",forUpdate: null})});
  }

  delete = (index, val) => {
    const { list } = this.state;
    fetch(`${path}/delete`,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({id: val._id})
    }).then(res => res.json()).then((res) => {list.splice(index, 1); this.setState({list,text: "",forUpdate: null});console.log(res)});
  
  }
  render() {
    const {list, text, forUpdate} = this.state;
    return (
      <View style={styles.container}>
     
        <Text style={styles.welcome}>TODO APP</Text>

        <TextInput
          style={styles.TextInput}
          placeholder="Type here!"
          value={text}
          onChangeText={(text) => {this.setState({text})}}
        />

        {/* <Button title="Add" onPress={() => {if(text ){list.push(text);this.setState({list,text: ""})}}} /> */}
        <Button title="Add" onPress={() => {if(text ){this.add(text)}}} />
        <Button disabled={forUpdate ? false : true} title="Update" onPress={() => {if(text ){this.update()}}} />

         <ScrollView centerContent="yes" snapToAlignment="center" style={styles.textCont} alwaysBounceVertical={true}>
        {list.map((val,index) => {
          return(
            <View key={index} style={styles.listBlock}>
              <Text style={styles.centerText}>{val.text}</Text>
              <Text style={styles.centerText}>|</Text>
              <Text onPress={() => {this.selectForUpdate(index, val)}} style={{...styles.centerText,...styles.blueText}}>Update</Text>
              <Text style={styles.centerText}>|</Text>
              <Text onPress={() => {this.delete(index, val)}} style={{...styles.centerText,...styles.blueText}}>Delete</Text>
            </View>
          )
        })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  blueText:{
    color: "blue"
  },
  listBlock: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  centerText: {
    textAlign: "center",
    margin: 2
  },
  textCont:{
    width: "100%",
    margin: "auto"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  TextInput: {
    width: "80%",
    borderStyle: "solid",
    borderWidth: 1
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
